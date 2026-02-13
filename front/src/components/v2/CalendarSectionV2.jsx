import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { format, isSameDay, parseISO } from 'date-fns';
import { getKoreanHolidays } from '../../utils/holidayUtils';
import { openModalV2 } from '../../redux/slices/modalSlice_v2';
import './CalendarView_v2.css';

const CalendarSectionV2 = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasksV2);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const getTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = format(date, 'MM-dd');
    const holidays = getKoreanHolidays(date.getFullYear());
    const holidayName = holidays[dateStr];

    const dayTasks = tasks.filter((t) => isSameDay(parseISO(t.due_date), date));
    const popupPosition = date.getDay() >= 5 ? 'popup-left' : 'popup-right';

    return (
      <div className="relative w-full h-full pointer-events-none">
        {holidayName && (
          <span className="holiday-label absolute top-1 right-1 text-[9px] text-red-500 font-black z-10">
            {holidayName}
          </span>
        )}

        {dayTasks.length > 0 && (
          <>
            <div className="calendar-task-list pointer-events-auto">
              {dayTasks.slice(0, 2).map((t, i) => (
                <div
                  key={i}
                  className={`text-[9px] truncate px-1 py-0.5 rounded border-l-2 mb-0.5 ${t.iscompleted ? 'opacity-30' : ''}`}
                  style={{
                    borderLeftColor: t.categorycolor || '#4A90E2',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  }}
                >
                  {t.title}
                </div>
              ))}
            </div>

            <div
              className={`task-hover-popup ${popupPosition} transition-all pointer-events-auto`}
            >
              <div className="popup-header">
                <span className="text-white text-sm font-black italic tracking-tighter">
                  {format(date, 'yyyy. MM. dd')}
                </span>
              </div>
              <div className="popup-body custom-scrollbar">
                {dayTasks.map((t) => (
                  <div
                    key={t._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(openModalV2({ modalType: 'details', task: t }));
                    }}
                    className="flex items-center gap-3 p-3 bg-gray-900/80 rounded-xl border border-gray-800 hover:border-blue-500/50 hover:bg-black transition-all cursor-pointer group mb-2"
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                      style={{
                        backgroundColor: t.categorycolor || '#4A90E2',
                        boxShadow: `0 0 8px ${t.categorycolor || '#4A90E2'}`,
                      }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-[11px] font-bold text-gray-200 truncate group-hover:text-blue-400 ${t.iscompleted ? 'line-through opacity-40' : ''}`}
                      >
                        {t.title}
                      </span>
                      <span className="text-[9px] text-gray-600 font-mono tracking-tighter">
                        {format(parseISO(t.due_date), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-section mt-12 pt-12 border-t border-gray-800">
      <header className="mb-10 flex items-center justify-between pr-40">
        <h2 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
          SMART CALENDAR V2
        </h2>
        <div className="text-xs font-mono text-gray-600 uppercase tracking-widest px-6 py-2 bg-white/5 rounded-full border border-white/5">
          {format(selectedDate, 'MMMM yyyy')}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 calendar-container bg-[#121212] p-8 rounded-[2.5rem] border border-gray-800 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-visible">
          <Calendar
            className="v2-calendar"
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={getTileContent}
            tileClassName={getTileClassName}
            locale="en-US"
            calendarType="gregory"
            formatDay={(l, d) => format(d, 'd')}
          />
        </div>

        <aside className="w-full lg:w-[350px] shrink-0">
          <div className="bg-[#121212] h-[580px] rounded-[2.5rem] p-8 border border-gray-800 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
              <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">
                {format(selectedDate, 'MM.dd')} List
              </h3>
              <span className="text-[10px] font-mono text-gray-500">
                {format(selectedDate, 'EEEE')}
              </span>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
              {tasks.filter((t) =>
                isSameDay(parseISO(t.due_date), selectedDate),
              ).length > 0 ? (
                tasks
                  .filter((t) => isSameDay(parseISO(t.due_date), selectedDate))
                  .map((t) => (
                    <div
                      key={t._id}
                      onClick={() =>
                        dispatch(openModalV2({ modalType: 'details', task: t }))
                      }
                      className="p-5 bg-gray-900/40 rounded-2xl border border-gray-800 hover:border-blue-500/30 hover:bg-black transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <div
                        className="absolute top-0 left-0 w-1 h-full"
                        style={{
                          backgroundColor: t.categorycolor || '#4A90E2',
                        }}
                      />
                      <div className="text-[10px] font-black text-blue-500 mb-2 uppercase tracking-widest">
                        {format(parseISO(t.due_date), 'HH:mm')}
                      </div>
                      <div
                        className={`text-sm font-bold truncate text-gray-200 group-hover:text-blue-400 ${t.iscompleted ? 'line-through opacity-30' : ''}`}
                      >
                        {t.title}
                      </div>
                      <p className="text-[11px] text-gray-600 mt-2 line-clamp-1">
                        {t.description}
                      </p>
                    </div>
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-700 text-sm font-medium italic">
                  일정이 없습니다.
                </div>
              )}
            </div>
            <button
              onClick={() =>
                dispatch(openModalV2({ modalType: 'create', task: null }))
              }
              className="mt-8 w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-[0.98] transition-all shadow-xl shadow-white/5"
            >
              Add New Task
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CalendarSectionV2;
