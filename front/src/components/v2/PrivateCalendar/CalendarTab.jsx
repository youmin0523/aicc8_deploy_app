import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { format, isSameDay, parseISO } from 'date-fns';
import {
  fetchDiaryThunk,
  fetchHabitsThunk,
  fetchSchedulesThunk,
  setSelectedDate,
  saveDiaryThunk,
} from '../../../redux/slices/privateCalendarSlice';
import {
  MdEmojiEvents,
  MdList,
  MdEvent,
  MdBook,
  MdSave,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdAccessTime,
} from 'react-icons/md';
import { getKoreanHolidays } from '../../../utils/holidayUtils';
import { toast } from 'react-toastify';
import '../CalendarView_v2.css'; // 기존 v2 캘린더 스타일 재사용

const CalendarTab = () => {
  const dispatch = useDispatch();
  const { authData } = useSelector((state) => state.auth);
  const { habits, schedules, currentDiary, selectedDate, loading } =
    useSelector((state) => state.privateCalendar);

  const [diaryContent, setDiaryContent] = useState('');

  // 데이터 로드
  useEffect(() => {
    if (authData?.sub) {
      const date = selectedDate || format(new Date(), 'yyyy-MM-dd');
      dispatch(fetchDiaryThunk({ userId: authData.sub, date }));
      dispatch(fetchHabitsThunk({ userId: authData.sub, date }));
      dispatch(fetchSchedulesThunk({ userId: authData.sub }));
    }
  }, [authData?.sub, selectedDate, dispatch]);

  useEffect(() => {
    setDiaryContent(currentDiary?.content || '');
  }, [currentDiary]);

  const handleDateChange = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    dispatch(setSelectedDate(formattedDate));
  };

  const handleSaveDiary = async () => {
    if (!diaryContent.trim()) return;
    try {
      await dispatch(
        saveDiaryThunk({
          _id: currentDiary?._id,
          userId: authData.sub,
          entry_date: selectedDate,
          content: diaryContent,
          images: currentDiary?.images || [],
        }),
      ).unwrap();
      toast.success('Diary synchronized successfully');
    } catch (err) {
      toast.error('Failed to save diary');
    }
  };

  // 캘린더 날짜별 클래스 설정
  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = format(date, 'MM-dd');
    const day = date.getDay();
    const holidays = getKoreanHolidays(date.getFullYear());

    const classes = [];
    if (day === 0) classes.push('sun');
    if (day === 6) classes.push('sat');
    if (holidays[dateStr]) classes.push('holiday');
    return classes.join(' ');
  };

  // 캘린더 날짜별 마커 표시
  const getTileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    // 일정 체크 (필터링 최적화)
    const daySchedules = schedules.filter((s) =>
      isSameDay(parseISO(s.start_date), date),
    );
    const hasSchedule = daySchedules.length > 0;

    // 습관 체크
    const hasHabit = habits.length > 0;

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 pointer-events-none">
        <div className="flex gap-1">
          {hasSchedule && (
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
          )}
          {hasHabit && (
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          )}
          {/* Todo 마커 자리 (추후 데이터 연동 시 활용) */}
          <div className="w-1 h-1 rounded-full bg-blue-500/30" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-8 h-full w-full overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-1000 relative">
      {/* 프리미엄 배경 광 처리 */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* 캘린더 타일 높이 및 프리미엄 스타일 오버라이드 (압축 버전) */}
      <style>{`
        .v2-calendar .react-calendar__month-view__days {
          grid-auto-rows: 78px !important;
          background-color: transparent !important;
          border: none !important;
          gap: 3px !important;
        }
        .v2-calendar .react-calendar__tile {
          height: 78px !important;
          max-height: 78px !important;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.04) !important;
          border-radius: 12px !important;
          transition: all 0.3s ease !important;
          padding: 6px !important;
        }
        .v2-calendar .react-calendar__navigation {
          margin-bottom: 8px !important;
          height: 36px !important;
        }
        .v2-calendar .react-calendar__navigation button {
          min-width: 32px !important;
          height: 32px !important;
          border-radius: 10px !important;
        }
        .v2-calendar .react-calendar__tile:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 20px rgba(0,0,0,0.4);
        }
        .v2-calendar .react-calendar__tile--active {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(124, 58, 237, 0.2)) !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3) !important;
        }
        .v2-calendar .react-calendar__navigation button {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 14px !important;
          color: #888 !important;
        }
        .v2-calendar .react-calendar__navigation button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
        }
        .v2-calendar .react-calendar__navigation__label {
          font-weight: 900 !important;
          letter-spacing: 0.2em !important;
          text-transform: uppercase !important;
          color: #fff !important;
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      {/* 좌측 섹션: 캘린더 + 다이어리 */}
      <div className="flex-[7.4] flex flex-col gap-4 min-h-0 min-w-0 h-full relative z-10">
        {/* 캘린더 카드 */}
        <div className="bg-[#111318]/60 backdrop-blur-2xl p-4 rounded-[2.5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden relative group flex-1 transition-all duration-500 hover:border-white/20">
          {/* 카드 베벨 효과 */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="flex-1 w-full flex items-center justify-center py-2">
            <Calendar
              className="v2-calendar !w-full"
              onChange={handleDateChange}
              value={new Date(selectedDate)}
              tileContent={getTileContent}
              tileClassName={getTileClassName}
              locale="ko-KR"
              formatDay={(l, d) => format(d, 'd')}
            />
          </div>
        </div>

        {/* 다이어리 섹션 - 더 슬림하게 */}
        <div className="h-[130px] min-h-[130px] bg-[#111318]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-5 flex flex-col gap-3 overflow-hidden relative shadow-2xl group transition-all duration-500 hover:border-blue-500/30">
          <header className="flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600/20 text-blue-500 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                <MdBook size={20} />
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                  Daily Life Log
                </h3>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                  {selectedDate}
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveDiary}
              className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 shadow-[0_10px_20px_rgba(5,150,105,0.2)] hover:shadow-[0_15px_30px_rgba(5,150,105,0.4)] hover:scale-105 active:scale-95"
            >
              <MdSave
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
              Save Record
            </button>
          </header>
          <div className="flex-1 bg-black/40 rounded-[2rem] p-5 border border-white/5 group-focus-within:border-blue-500/40 transition-all shadow-inner">
            <textarea
              value={diaryContent}
              onChange={(e) => setDiaryContent(e.target.value)}
              placeholder="Record the fragments of your journey..."
              className="w-full h-full bg-transparent border-none text-gray-200 focus:outline-none resize-none text-base leading-relaxed custom-scrollbar placeholder:text-gray-700 font-medium"
            />
          </div>
        </div>
      </div>

      {/* 우측 섹션: 리스트 대시보드 */}
      <div className="flex-[2.6] flex flex-col gap-4 overflow-hidden min-w-0 h-full relative z-10">
        {/* 습관 (Habits) */}
        <section className="flex-1 bg-[#111318]/60 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-7 flex flex-col overflow-hidden shadow-2xl transition-all duration-500 hover:border-emerald-500/30">
          <header className="flex justify-between items-center mb-6 shrink-0 border-b border-white/5 pb-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 flex items-center gap-2">
              <MdEmojiEvents
                size={18}
                className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              />{' '}
              Habits
            </h3>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-white italic">
                {Math.round(
                  (habits.filter((h) => h.is_completed).length /
                    (habits.length || 1)) *
                    100,
                )}
                %
              </span>
              <div className="w-12 h-1 bg-emerald-950 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-1000"
                  style={{
                    width: `${(habits.filter((h) => h.is_completed).length / (habits.length || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
            {habits.length > 0 ? (
              habits.map((habit) => (
                <div
                  key={habit._id}
                  className="group flex items-center justify-between p-4 bg-white/[0.03] hover:bg-emerald-500/[0.08] rounded-2xl border border-white/5 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${habit.is_completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-600'}`}
                    >
                      {habit.is_completed ? (
                        <MdCheckCircle
                          size={22}
                          className="drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                        />
                      ) : (
                        <MdRadioButtonUnchecked size={22} />
                      )}
                    </div>
                    <span
                      className={`text-sm font-bold tracking-tight ${habit.is_completed ? 'text-gray-500 line-through' : 'text-gray-200'} transition-colors`}
                    >
                      {habit.habit_name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <MdEmojiEvents size={50} />
                <p className="text-[8px] font-black uppercase tracking-[0.3em] mt-2">
                  No Active Protocols
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 일정 (Timeline) */}
        <section className="flex-1 bg-[#111318]/60 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-7 flex flex-col overflow-hidden shadow-2xl transition-all duration-500 hover:border-purple-500/30">
          <header className="flex justify-between items-center mb-6 shrink-0 border-b border-white/5 pb-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 flex items-center gap-2">
              <MdEvent
                size={18}
                className="drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]"
              />{' '}
              Timeline
            </h3>
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-[9px] font-black tracking-widest border border-purple-500/20 shadow-[0_0_15px_rgba(167,139,250,0.1)]">
              Today:{' '}
              {
                schedules.filter((s) =>
                  isSameDay(parseISO(s.start_date), new Date(selectedDate)),
                ).length
              }
            </span>
          </header>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            {schedules.filter((s) =>
              isSameDay(parseISO(s.start_date), new Date(selectedDate)),
            ).length > 0 ? (
              schedules
                .filter((s) =>
                  isSameDay(parseISO(s.start_date), new Date(selectedDate)),
                )
                .map((s) => (
                  <div
                    key={s._id}
                    className="p-5 bg-white/[0.03] hover:bg-purple-600/[0.08] rounded-2xl border border-white/5 hover:border-purple-500/40 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1.5 h-4 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                      <span className="text-sm font-black text-gray-100 group-hover:text-purple-300 transition-colors truncate">
                        {s.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/5">
                        <MdAccessTime
                          size={14}
                          className="text-purple-500/60"
                        />
                        <span className="text-[10px] text-gray-400 font-black tracking-tighter uppercase whitespace-nowrap">
                          {format(parseISO(s.start_date), 'HH:mm')} —{' '}
                          {format(parseISO(s.end_date), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <MdEvent size={50} />
                <p className="text-[8px] font-black uppercase tracking-[0.3em] mt-2">
                  The Void is Still
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 할일 (Tasks) */}
        <section className="h-[140px] bg-[#111318]/80 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-7 flex flex-col overflow-hidden shadow-2xl shrink-0 group">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 flex items-center gap-2 mb-4">
            <MdList
              size={18}
              className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            />{' '}
            Neural Tasks
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center bg-black/50 rounded-2xl border border-white/5 relative overflow-hidden group-hover:bg-blue-600/[0.03] transition-colors">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600/10 animate-pulse" />
            <MdList
              size={24}
              className="mb-1 text-blue-500/10 group-hover:text-blue-500/30 transition-all duration-700"
            />
            <span className="text-[8px] font-black text-gray-800 uppercase tracking-[0.3em]">
              Sync in progress...
            </span>
          </div>
        </section>
      </div>

      {/* 프리미엄 플로팅 액션 버튼 (FAB) */}
      <div className="fixed bottom-12 right-12 flex flex-col items-end gap-5 z-[9999] group">
        <div className="flex flex-col gap-4 opacity-0 translate-y-10 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)">
          {[
            {
              id: 'diary',
              icon: <MdBook />,
              label: 'Neural Log',
              color: 'from-blue-600 to-blue-400',
              shadow: 'rgba(37,99,235,0.4)',
            },
            {
              id: 'habit',
              icon: <MdEmojiEvents />,
              label: 'New Protocol',
              color: 'from-emerald-600 to-teal-400',
              shadow: 'rgba(16,185,129,0.4)',
            },
            {
              id: 'todo',
              icon: <MdList />,
              label: 'Add Logic',
              color: 'from-blue-400 to-cyan-400',
              shadow: 'rgba(59,130,246,0.4)',
            },
            {
              id: 'schedule',
              icon: <MdEvent />,
              label: 'Timeline Entry',
              color: 'from-purple-600 to-pink-400',
              shadow: 'rgba(124,58,237,0.4)',
            },
          ].map((item, idx) => (
            <button
              key={item.id}
              className="flex items-center gap-4 group/btn"
              style={{ transitionDelay: `${idx * 50}ms` }}
              onClick={() => toast.info(`${item.label} matrix initialized`)}
            >
              <span className="px-4 py-2 bg-black/90 backdrop-blur-2xl rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white opacity-0 group-hover/btn:opacity-100 transition-all duration-300 border border-white/10 shadow-2xl translate-x-4 group-hover/btn:translate-x-0">
                {item.label}
              </span>
              <div
                className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-[1.2rem] flex items-center justify-center text-white shadow-xl hover:scale-115 hover:-rotate-6 active:scale-90 transition-all duration-500 border border-white/20`}
                style={{ boxShadow: `0 15px 30px ${item.shadow}` }}
              >
                {React.cloneElement(item.icon, { size: 24 })}
              </div>
            </button>
          ))}
        </div>

        {/* 메인 플러스 버튼 */}
        <button className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.6)] hover:scale-110 active:scale-90 transition-all duration-500 group-hover:rotate-45 border border-white/20 relative">
          <div className="absolute inset-0 bg-white/20 rounded-[2rem] animate-ping opacity-20 group-hover:hidden" />
          <span className="text-3xl font-light">+</span>
        </button>
      </div>
    </div>
  );
};

export default CalendarTab;
