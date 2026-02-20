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
      {/* 프리미엄 배경 광 처리 - 더 몽환적으로 수정 */}
      <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none animate-pulse"
        style={{ animationDelay: '2s' }}
      />

      {/* 캘린더 스타일 오버라이드 (시인성 강화 버전) */}
      <style>{`
        .v2-calendar .react-calendar__month-view__days {
          grid-auto-rows: 78px !important;
          background-color: transparent !important;
          border: none !important;
          gap: 6px !important;
        }
        .v2-calendar .react-calendar__tile {
          height: 78px !important;
          max-height: 78px !important;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 20px !important;
          transition: all 0.5s cubic-bezier(0.2, 1, 0.2, 1) !important;
          padding: 10px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          align-items: center !important;
        }
        .v2-calendar .react-calendar__navigation {
          margin-bottom: 16px !important;
          height: 48px !important;
          background: rgba(255, 255, 255, 0.03);
          padding: 6px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-blur: 10px;
        }
        .v2-calendar .react-calendar__navigation button {
          min-width: 44px !important;
          height: 42px !important;
          border-radius: 16px !important;
          font-weight: 900 !important;
          font-size: 16px !important;
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .v2-calendar .react-calendar__navigation button:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
        }
        .v2-calendar .react-calendar__tile:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(59, 130, 246, 0.5) !important;
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0,0,0,0.6), 0 0 30px rgba(59, 130, 246, 0.15);
          z-index: 10;
        }
        .v2-calendar .react-calendar__tile--active {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(124, 58, 237, 0.3)) !important;
          border-color: rgba(59, 130, 246, 0.8) !important;
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.3) !important;
        }
        .v2-calendar .react-calendar__navigation__label {
          font-size: 15px !important;
          letter-spacing: 0.4em !important;
          color: white !important;
          text-transform: uppercase !important;
          font-weight: 900 !important;
        }
        .v2-calendar .react-calendar__month-view__weekdays {
          margin-bottom: 8px !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          font-size: 11px !important;
          color: rgba(255, 255, 255, 0.3) !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>

      {/* [LAYOUT] 좌측 메인 섹션 - 간격 최적화 */}
      <div className="flex-[6.8] flex flex-col gap-6 min-h-0 min-w-0 h-full relative z-10 pb-10">
        {/* 캘린더 카드 - 상단 정렬 밀착을 위해 패딩 및 마진 재조정 */}
        <div className="flex-none bg-[#111318]/40 backdrop-blur-3xl p-8 rounded-[4rem] border border-white/10 shadow-[0_50px_120px_rgba(0,0,0,0.7)] relative group transition-all duration-700 hover:border-blue-500/30 min-h-fit">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

          <div className="w-full h-full flex items-center justify-center">
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

        {/* 다이어리 섹션 - 캘린더 하단에 자연스럽게 배치 */}
        <div className="flex-none min-h-[400px] bg-[#111318]/60 backdrop-blur-3xl rounded-[4rem] border border-white/10 p-10 flex flex-col gap-6 relative shadow-2xl group transition-all duration-700 hover:border-emerald-500/30">
          <header className="flex justify-between items-center shrink-0">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-3xl flex items-center justify-center shadow-[0_15px_30px_rgba(16,185,129,0.15)] border border-emerald-500/10">
                <MdBook size={28} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-[0.6em] text-white">
                  Daily Life Log
                </h3>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Temporal Record: {selectedDate}
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveDiary}
              className="group flex items-center gap-4 px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[12px] transition-all duration-500 shadow-[0_10px_30px_rgba(5,150,105,0.4)] hover:shadow-[0_20px_50px_rgba(5,150,105,0.6)] hover:scale-105 active:scale-95"
            >
              <MdSave
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              Synchronize Record
            </button>
          </header>

          <div className="flex-1 bg-black/40 rounded-[3rem] p-8 border border-white/5 focus-within:border-emerald-500/40 transition-all duration-500 shadow-inner overflow-hidden min-h-[250px]">
            <textarea
              value={diaryContent}
              onChange={(e) => setDiaryContent(e.target.value)}
              placeholder="여정의 조각들을 기록하세요..."
              className="w-full h-full bg-transparent border-none text-gray-200 focus:outline-none resize-none text-xl leading-relaxed custom-scrollbar placeholder:text-gray-800 font-medium"
            />
          </div>
        </div>
      </div>

      {/* 우측 섹션: 통합 대시보드 사이드바 (슬림화 및 고밀도) */}
      <div className="flex-[3.5] flex flex-col gap-5 overflow-hidden min-w-0 h-full relative z-10">
        {/* Habits (Habits) - 상단 배치 */}
        <section className="flex-[3.5] bg-[#111318]/40 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-7 flex flex-col overflow-hidden shadow-2xl transition-all duration-700 hover:border-emerald-500/30">
          <header className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 flex items-center gap-2">
              <MdEmojiEvents
                size={18}
                className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              />
              Neural Protocol
            </h3>
            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-black tracking-widest border border-emerald-500/20">
              {Math.round(
                (habits.filter((h) => h.is_completed).length /
                  (habits.length || 1)) *
                  100,
              )}
              % SYNC
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
            {habits.length > 0 ? (
              habits.map((habit) => (
                <div
                  key={habit._id}
                  className="group flex items-center justify-between p-4 bg-white/[0.02] hover:bg-emerald-500/[0.08] rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${habit.is_completed ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 text-gray-600'}`}
                    >
                      {habit.is_completed ? (
                        <MdCheckCircle size={18} />
                      ) : (
                        <MdRadioButtonUnchecked size={18} />
                      )}
                    </div>
                    <span
                      className={`text-[13px] font-bold tracking-tight ${habit.is_completed ? 'text-gray-600 line-through' : 'text-gray-300'}`}
                    >
                      {habit.habit_name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <MdEmojiEvents size={40} />
                <p className="text-[8px] font-black uppercase tracking-[0.3em] mt-2">
                  No Active Protocols
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Timeline (Timeline) - 중간 배치 */}
        <section className="flex-[3.5] bg-[#111318]/40 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-7 flex flex-col overflow-hidden shadow-2xl transition-all duration-700 hover:border-purple-500/30">
          <header className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 flex items-center gap-2">
              <MdEvent
                size={18}
                className="drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]"
              />
              Event Horizon
            </h3>
            <span className="text-[9px] font-black text-purple-400/60 uppercase">
              {
                schedules.filter((s) =>
                  isSameDay(parseISO(s.start_date), new Date(selectedDate)),
                ).length
              }{' '}
              Nodes
            </span>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
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
                    className="p-4 bg-white/[0.02] hover:bg-purple-600/[0.08] rounded-[1.5rem] border border-white/5 hover:border-purple-500/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                      <span className="text-[12px] font-black text-gray-200 truncate group-hover:text-purple-300 transition-colors">
                        {s.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                      <MdAccessTime size={12} className="text-purple-500/40" />
                      {format(parseISO(s.start_date), 'HH:mm')} —{' '}
                      {format(parseISO(s.end_date), 'HH:mm')}
                    </div>
                  </div>
                ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <MdEvent size={40} />
                <p className="text-[8px] font-black uppercase tracking-[0.3em] mt-2">
                  Temporal Void
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Neural Tasks (할일) - 하단 배치 */}
        <section className="flex-[3] bg-[#111318]/80 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-7 flex flex-col overflow-hidden shadow-2xl transition-all duration-700 hover:border-blue-500/30">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 flex items-center gap-2 mb-4">
            <MdList
              size={18}
              className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            />
            Neural Tasks
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden group hover:bg-blue-600/[0.05] transition-all">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600/20 animate-pulse" />
            <MdList
              size={32}
              className="mb-2 text-blue-500/10 group-hover:text-blue-500/30 transition-all duration-700 group-hover:scale-110"
            />
            <span className="text-[9px] font-black text-gray-700 group-hover:text-blue-500/40 uppercase tracking-[0.4em] transition-all">
              Awaiting Input...
            </span>
          </div>
        </section>
      </div>

      {/* 프리미엄 플로팅 액션 버튼 (FAB) - 기존 유지하며 스타일 약간 보정 */}
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
              <span className="px-5 py-2.5 bg-black/90 backdrop-blur-3xl rounded-xl text-[10px] font-black uppercase tracking-[0.4em] text-white opacity-0 group-hover/btn:opacity-100 transition-all duration-500 border border-white/10 shadow-2xl translate-x-4 group-hover/btn:translate-x-0">
                {item.label}
              </span>
              <div
                className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white shadow-xl hover:scale-115 hover:-rotate-6 active:scale-95 transition-all duration-500 border border-white/20`}
                style={{ boxShadow: `0 15px 35px ${item.shadow}` }}
              >
                {React.cloneElement(item.icon, { size: 24 })}
              </div>
            </button>
          ))}
        </div>

        <button className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(37,99,235,0.5)] hover:shadow-[0_30px_60px_rgba(37,99,235,0.7)] hover:scale-110 active:scale-90 transition-all duration-700 group-hover:rotate-45 border border-white/20 relative">
          <div className="absolute inset-0 bg-white/30 rounded-[2rem] animate-ping opacity-20 group-hover:hidden" />
          <span className="text-3xl font-light">+</span>
        </button>
      </div>
    </div>
  );
};

export default CalendarTab;
