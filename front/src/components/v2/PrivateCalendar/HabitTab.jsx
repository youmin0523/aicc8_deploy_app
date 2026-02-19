import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdAdd,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdSettings,
  MdHistory,
  MdEmojiEvents,
  MdClose,
  MdAccessTime,
  MdRepeat,
  MdEventAvailable,
  MdNotificationsActive,
  MdAutoMode,
} from 'react-icons/md';
import {
  fetchHabitsThunk,
  toggleHabitCheckThunk,
  addHabitThunk,
} from '../../../redux/slices/privateCalendarSlice';
import { toast } from 'react-toastify';

const HabitTab = () => {
  const dispatch = useDispatch();
  const { authData } = useSelector((state) => state.auth);
  const { habits, selectedDate } = useSelector(
    (state) => state.privateCalendar,
  );

  // 모달 및 설정 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [config, setConfig] = useState({
    habit_name: '',
    start_time: '09:00',
    end_time: '10:00',
    repeat_type: 'everyday',
    goal_duration: '30', // 일수 단위로 입력받아 날짜로 변환 예정
    reminder_time: '08:30',
    use_reminder: true,
  });

  // 습관 프리셋
  const habitPresets = [
    '일찍 일어나기',
    '아침 명상',
    '영양제 먹기',
    '하루 물 2L 마시기',
    '다이어리 쓰기',
    '가계부 쓰기',
    '30분 러닝',
    '홈트레이닝',
    '걷기 운동',
    '가벼운 스트레칭',
    '반려견 산책',
    '틈틈이 독서',
    '영어 공부',
    '야식 안먹기',
    '금주',
    '금연',
  ];

  useEffect(() => {
    if (authData?.sub) {
      dispatch(fetchHabitsThunk({ userId: authData.sub, date: selectedDate }));
    }
  }, [selectedDate, authData?.sub, dispatch]);

  const handleToggleCheck = async (habit) => {
    try {
      await dispatch(
        toggleHabitCheckThunk({
          habitId: habit._id,
          date: selectedDate,
          isCompleted: !habit.is_completed,
        }),
      ).unwrap();

      if (!habit.is_completed) {
        toast.success('Mission Accomplished: ' + habit.habit_name);
      }
    } catch (err) {
      toast.error('상태 변경 실패');
    }
  };

  // 프리셋 클릭 시 모달 오픈
  const openConfigModal = (name) => {
    setConfig({
      ...config,
      habit_name: name || '',
    });
    setIsModalOpen(true);
  };

  // 습관 등록 실행
  const handleSaveHabit = async () => {
    try {
      const today = new Date();
      const goalEndDate = new Date();
      goalEndDate.setDate(today.getDate() + parseInt(config.goal_duration));

      const payload = {
        userId: authData.sub,
        habit_name: config.habit_name,
        start_time: config.start_time,
        end_time: config.end_time,
        repeat_type: config.repeat_type,
        goal_start_date: today.toISOString().split('T')[0],
        goal_end_date: goalEndDate.toISOString().split('T')[0],
        reminder_time: config.use_reminder ? config.reminder_time : null,
        isActive: true,
      };

      await dispatch(addHabitThunk(payload)).unwrap();
      dispatch(fetchHabitsThunk({ userId: authData.sub, date: selectedDate }));
      toast.success(`Protocol Initialized: ${config.habit_name}`);
      setIsModalOpen(false);
    } catch (err) {
      toast.error('습관 등록 실패');
    }
  };

  return (
    <div className="relative flex gap-10 h-full max-h-full overflow-hidden animate-in slide-in-from-right-10 duration-500">
      {/* 왼쪽: 현재 활성화된 습관 리스트 */}
      <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-hidden">
        <header className="flex justify-between items-center mb-2">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-2">
            <MdEmojiEvents size={18} /> Daily Habit Protocol
          </h3>
          <div className="text-[9px] font-black italic text-gray-600 uppercase">
            Current Date: {selectedDate}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
          {habits.length > 0 ? (
            habits.map((habit) => (
              <div
                key={habit._id}
                className={`group flex items-center justify-between p-6 rounded-[2.5rem] border transition-all duration-300 ${
                  habit.is_completed
                    ? 'bg-blue-600/10 border-blue-500/30'
                    : 'bg-black/20 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleToggleCheck(habit)}
                    className={`transition-all duration-500 ${
                      habit.is_completed
                        ? 'text-blue-500 scale-110'
                        : 'text-gray-600 hover:text-white'
                    }`}
                  >
                    {habit.is_completed ? (
                      <MdCheckCircle size={32} />
                    ) : (
                      <MdRadioButtonUnchecked size={32} />
                    )}
                  </button>
                  <div>
                    <h4
                      className={`text-lg font-bold transition-all ${habit.is_completed ? 'text-blue-100 italic line-through' : 'text-gray-200'}`}
                    >
                      {habit.habit_name}
                    </h4>
                    <div className="flex flex-wrap gap-4 mt-1">
                      <span className="text-[9px] font-black uppercase tracking-tighter text-blue-500/60 flex items-center gap-1">
                        <MdRepeat size={10} /> {habit.repeat_type}
                      </span>
                      {habit.start_time && (
                        <span className="text-[9px] font-black uppercase tracking-tighter text-purple-400 flex items-center gap-1">
                          <MdAccessTime size={10} />{' '}
                          {habit.start_time.slice(0, 5)} -{' '}
                          {habit.end_time?.slice(0, 5)}
                        </span>
                      )}
                      {habit.reminder_time && (
                        <span className="text-[9px] font-black uppercase tracking-tighter text-orange-400 flex items-center gap-1">
                          <MdNotificationsActive size={10} />{' '}
                          {habit.reminder_time.slice(0, 5)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 hover:text-white transition-all">
                    <MdHistory size={20} />
                  </button>
                  <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 hover:text-white transition-all">
                    <MdSettings size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 border-2 border-dashed border-white/5 rounded-[3rem]">
              <MdAutoMode size={60} className="mb-4" />
              <p className="text-sm font-black uppercase tracking-widest">
                No Active Protocol
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽: 습관 추가/프리셋 영역 */}
      <div className="w-80 flex flex-col gap-6 min-h-0">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all"></div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2 relative z-10">
            Add Protocol
          </h3>
          <p className="text-[10px] text-blue-200 uppercase font-bold tracking-tighter mb-6 relative z-10 opacity-70 italic">
            Select from neural presets
          </p>
          <button
            onClick={() => openConfigModal('')}
            className="w-full py-4 bg-white text-blue-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <MdAdd size={18} /> Configure Custom
          </button>
        </div>

        <div className="flex-1 bg-black/20 rounded-[2.5rem] border border-white/5 p-8 overflow-hidden flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">
            Neural Presets
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {habitPresets.map((name, i) => (
              <button
                key={i}
                onClick={() => openConfigModal(name)}
                className="w-full p-4 rounded-2xl bg-white/5 hover:bg-blue-600/20 text-xs font-bold text-gray-400 hover:text-white border border-transparent hover:border-blue-500/30 text-left transition-all flex items-center justify-between group"
              >
                {name}
                <MdAdd className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 설정 모달 (Config Modal - Using Portal for consistency) */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#1a1c23] w-full max-w-lg rounded-[3rem] border border-white/10 p-10 shadow-[0_0_100px_rgba(37,99,235,0.2)]">
              <header className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                    Initialize <span className="text-blue-500">Protocol</span>
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                    Configure Neural Habit Parameters
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 transition-all"
                >
                  <MdClose size={24} />
                </button>
              </header>

              <div className="space-y-8">
                {/* 이름 */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500/80 flex items-center gap-2">
                    <MdAutoMode /> Habit Identity
                  </label>
                  <input
                    type="text"
                    value={config.habit_name}
                    onChange={(e) =>
                      setConfig({ ...config, habit_name: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    placeholder="Enter habit name..."
                  />
                </div>

                {/* 시간 설정 */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <MdAccessTime size={16} /> Start Time
                    </label>
                    <input
                      type="time"
                      value={config.start_time}
                      onChange={(e) =>
                        setConfig({ ...config, start_time: e.target.value })
                      }
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <MdAccessTime size={16} /> End Time
                    </label>
                    <input
                      type="time"
                      value={config.end_time}
                      onChange={(e) =>
                        setConfig({ ...config, end_time: e.target.value })
                      }
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* 반복 주기 & 목표 기간 */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <MdRepeat size={16} /> Cycle
                    </label>
                    <select
                      value={config.repeat_type}
                      onChange={(e) =>
                        setConfig({ ...config, repeat_type: e.target.value })
                      }
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="everyday">Everyday</option>
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <MdEventAvailable size={16} /> Goal (Days)
                    </label>
                    <input
                      type="number"
                      value={config.goal_duration}
                      onChange={(e) =>
                        setConfig({ ...config, goal_duration: e.target.value })
                      }
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* 알림 설정 */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <MdNotificationsActive size={16} /> Neural Sync
                      Notification
                    </label>
                    <button
                      onClick={() =>
                        setConfig({
                          ...config,
                          use_reminder: !config.use_reminder,
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-all relative ${config.use_reminder ? 'bg-blue-600' : 'bg-gray-800'}`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.use_reminder ? 'left-7' : 'left-1'}`}
                      />
                    </button>
                  </div>
                  {config.use_reminder && (
                    <input
                      type="time"
                      value={config.reminder_time}
                      onChange={(e) =>
                        setConfig({ ...config, reminder_time: e.target.value })
                      }
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all [color-scheme:dark] animate-in slide-in-from-top-2"
                    />
                  )}
                </div>

                <button
                  onClick={handleSaveHabit}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-blue-600/20 hover:scale-[1.02] transition-all duration-300"
                >
                  Launch Protocol
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default HabitTab;
