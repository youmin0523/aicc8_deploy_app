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
  fetchAllDiariesThunk,
  fetchAllHabitLogsThunk,
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
  MdCardGiftcard,
  MdImage,
  MdAttachFile,
  MdClose,
} from 'react-icons/md';
import { getKoreanHolidays } from '../../../utils/holidayUtils';
import { toast } from 'react-toastify';
import '../CalendarView_v2.css';

const CalendarTab = () => {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth.authData); //* [Fixed] 통합 세션(auth) 참조
  const {
    habits,
    schedules,
    currentDiary,
    selectedDate,
    allDiaries,
    allHabitLogs,
  } = useSelector((state) => state.privateCalendar);

  const [diaryContent, setDiaryContent] = useState('');
  const [diaryImages, setDiaryImages] = useState([]);

  // 1. 초기 데이터 로드 (매우 중요)
  useEffect(() => {
    if (authData?.sub) {
      const date = selectedDate || format(new Date(), 'yyyy-MM-dd');
      dispatch(fetchDiaryThunk({ userId: authData.sub, date }));
      dispatch(fetchHabitsThunk({ userId: authData.sub, date }));
      dispatch(fetchSchedulesThunk({ userId: authData.sub }));
      dispatch(fetchAllDiariesThunk({ userId: authData.sub }));
      dispatch(fetchAllHabitLogsThunk({ userId: authData.sub }));
    }
  }, [authData?.sub, selectedDate, dispatch]);

  // 2. 다이어리 상태 동기화
  useEffect(() => {
    setDiaryContent(currentDiary?.content || '');
    try {
      if (currentDiary?.images) {
        const parsed =
          typeof currentDiary.images === 'string'
            ? JSON.parse(currentDiary.images)
            : currentDiary.images;
        setDiaryImages(Array.isArray(parsed) ? parsed : []);
      } else {
        setDiaryImages([]);
      }
    } catch (e) {
      setDiaryImages([]);
    }
  }, [currentDiary]);

  const handleDateChange = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    dispatch(setSelectedDate(formattedDate));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDiaryImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: reader.result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setDiaryImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSaveDiary = async () => {
    if (!diaryContent.trim() && diaryImages.length === 0) return;
    try {
      await dispatch(
        saveDiaryThunk({
          _id: currentDiary?._id,
          userId: authData.sub,
          entry_date: selectedDate,
          content: diaryContent,
          images: diaryImages,
        }),
      ).unwrap();
      dispatch(fetchAllDiariesThunk({ userId: authData.sub }));
      toast.success('Diary synchronized successfully');
    } catch (err) {
      toast.error('Failed to save diary');
    }
  };

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
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasSchedule = schedules.some((s) => {
      const start = format(parseISO(s.start_date), 'yyyy-MM-dd');
      const end = format(parseISO(s.end_date), 'yyyy-MM-dd');
      return dateStr >= start && dateStr <= end;
    });
    const hasDiary = allDiaries.some(
      (d) => format(parseISO(d.entry_date), 'yyyy-MM-dd') === dateStr,
    );
    const hasHabitLog = allHabitLogs.some(
      (l) => format(parseISO(l.check_date), 'yyyy-MM-dd') === dateStr,
    );

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 pointer-events-none">
        <div className="flex gap-1.5">
          {hasDiary && (
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
          )}
          {hasSchedule && (
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)] animate-pulse" />
          )}
          {hasHabitLog && (
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-8 h-full w-full overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-1000 relative">
      <style>{`
        .v2-calendar .react-calendar__month-view__days { grid-auto-rows: 62px !important; gap: 6px !important; }
        .v2-calendar .react-calendar__tile { height: 62px !important; background: rgba(255, 255, 255, 0.03) !important; border-radius: 14px !important; font-size: 15px !important; font-weight: 700 !important; color: rgba(255, 255, 255, 0.9) !important; display: flex !important; flex-direction: column !important; align-items: center !important; }
        .v2-calendar .react-calendar__tile--now { background: rgba(59, 130, 246, 0.15) !important; color: #60a5fa !important; }
        .v2-calendar .react-calendar__tile--active { background: linear-gradient(135deg, #2563eb, #7c3aed) !important; color: white !important; }
        .v2-calendar .react-calendar__navigation { margin-bottom: 24px !important; background: rgba(255, 255, 255, 0.03); border-radius: 20px; padding: 6px; }
        .v2-calendar .react-calendar__navigation button { color: white !important; font-weight: 800 !important; }
        
        /* [Added Code] 프리미엄 커스텀 스크롤바 */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        
        @keyframes gift-shake { 0%, 100% { transform: scale(1) rotate(0); } 25% { transform: scale(1.1) rotate(-8deg); } 50% { transform: scale(1.1) rotate(8deg); } }
        @keyframes item-burst { 0% { opacity: 0; transform: translate(24px, 48px) scale(0); } 100% { opacity: 1; transform: translate(0, 0) scale(1); } }
        @keyframes item-collect { 0% { opacity: 1; transform: translate(0, 0) scale(1); } 100% { opacity: 0; transform: translate(24px, 48px) scale(0); } }
        .fab-item { pointer-events: none; animation: item-collect 0.4s forwards; }
        .fab-container:hover .fab-item { pointer-events: auto; animation: item-burst 0.7s forwards; }
        .fab-container:hover .main-box { animation: gift-shake 0.5s infinite; }
      `}</style>

      <div className="flex-[7] flex flex-col gap-6 min-h-0 min-w-0 h-full relative z-10">
        <div className="flex-[1.4] bg-[#111318]/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl flex items-center justify-center">
          <Calendar
            className="v2-calendar !w-full !max-w-none"
            onChange={handleDateChange}
            value={new Date(selectedDate)}
            tileContent={getTileContent}
            tileClassName={getTileClassName}
            locale="ko-KR"
            formatDay={(l, d) => format(d, 'd')}
          />
        </div>

        <div className="flex-1 min-h-0 bg-[#111318]/60 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-8 flex flex-col gap-6 shadow-2xl mb-5">
          <header className="flex justify-between items-center shrink-0">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center border border-emerald-500/10">
                <MdBook size={28} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.6em] text-white">
                  Daily Life Log
                </h3>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Synchronized: {selectedDate}
                </p>
              </div>
            </div>
          </header>

          <div className="flex-1 min-h-0 flex flex-col bg-white/[0.03] rounded-[2rem] border border-white/5 p-6 overflow-hidden">
            {/* [Modified Code] 본문 영역을 독립적인 flex-1로 감싸 공간 확보 */}
            <div className="flex-1 min-h-0 mb-4">
              <textarea
                value={diaryContent}
                onChange={(e) => setDiaryContent(e.target.value)}
                placeholder="여정의 조각들을 기록하세요..."
                className="w-full h-full bg-transparent border-none text-gray-200 focus:outline-none resize-none text-[20px] leading-[1.8] overflow-y-auto custom-scrollbar pr-2"
              />
            </div>

            {/* [Modified Code] 이미지 갤러리: 고정 높이 부여로 본문 압착 방지 */}
            {diaryImages.length > 0 && (
              <div className="h-[140px] flex gap-4 overflow-x-auto py-4 mb-4 no-scrollbar shrink-0 border-t border-white/5 pt-4">
                {diaryImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative min-w-[100px] h-[100px] rounded-2xl overflow-hidden border border-white/10 group shadow-2xl"
                  >
                    <img
                      src={img.url}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdClose size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/5 shrink-0">
              <div className="flex gap-3">
                <label className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-blue-400 cursor-pointer">
                  <MdImage size={24} />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-emerald-400">
                  <MdAttachFile size={24} />
                </button>
              </div>
              <button
                onClick={handleSaveDiary}
                className="px-10 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black uppercase text-[11px] transition-all shadow-xl active:scale-95"
              >
                <MdSave size={20} className="inline mr-2" /> Sync Metadata
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-[3.5] flex flex-col gap-5 overflow-hidden min-w-0 h-full relative z-10 pb-5">
        <div className="flex-[1] bg-[#111318]/40 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-7 flex flex-col overflow-hidden">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 flex items-center gap-2 mb-6">
            <MdEmojiEvents size={18} /> Neural Protocol
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
            {habits.map((h) => (
              <div
                key={h._id}
                className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${h.is_completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5'}`}
                >
                  {h.is_completed ? (
                    <MdCheckCircle size={18} />
                  ) : (
                    <MdRadioButtonUnchecked size={18} />
                  )}
                </div>
                <span
                  className={`text-[13px] font-bold ${h.is_completed ? 'line-through text-gray-600' : 'text-gray-300'}`}
                >
                  {h.habit_name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-[1] bg-[#111318]/40 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-7 flex flex-col overflow-hidden">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 flex items-center gap-2 mb-6">
            <MdEvent size={18} /> Event Horizon
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {schedules
              .filter((s) =>
                isSameDay(parseISO(s.start_date), new Date(selectedDate)),
              )
              .map((s) => (
                <div
                  key={s._id}
                  className="p-4 bg-white/[0.02] rounded-[1.5rem] border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-1 h-3 rounded-full bg-purple-500" />
                    <span className="text-[12px] font-black">{s.title}</span>
                  </div>
                  <div className="text-[9px] text-gray-500 font-bold">
                    {format(parseISO(s.start_date), 'HH:mm')} —{' '}
                    {format(parseISO(s.end_date), 'HH:mm')}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-12 right-12 z-[9999] fab-container group flex flex-col items-end gap-6">
        <div className="flex flex-col gap-5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-700">
          <button className="fab-item w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl">
            <MdBook size={26} />
          </button>
          <button className="fab-item w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl">
            <MdEmojiEvents size={26} />
          </button>
        </div>
        <button className="main-box w-20 h-20 bg-gradient-to-br from-indigo-600 to-pink-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl relative overflow-hidden">
          <MdCardGiftcard size={36} />
        </button>
      </div>
    </div>
  );
};

export default CalendarTab;
