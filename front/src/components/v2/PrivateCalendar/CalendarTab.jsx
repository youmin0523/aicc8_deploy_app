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
  MdEdit,
  MdAdd,
} from 'react-icons/md';
import { getKoreanHolidays } from '../../../utils/holidayUtils';
import { toast } from 'react-toastify';
import '../CalendarView_v2.css';

const CalendarTab = ({ setActiveTab, isShowAll = true }) => {
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
  const [isEditing, setIsEditing] = useState(true);

  // [*Added Code] 임시 Todo 데이터 상태 관리 및 통합 모달 상태 추가
  const [localTodos, setLocalTodos] = useState([
    {
      id: 1,
      title: 'Check System Diagnostics',
      prio: 'HIGH',
      label: 'bg-red-500/20 text-red-500 border-red-500/30',
    },
    {
      id: 2,
      title: 'Database Synchronization',
      prio: 'NORMAL',
      label: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    },
  ]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    action: 'add',
    payload: null,
  });
  const [quickInput, setQuickInput] = useState({
    title: '',
    start_time: '09:00',
    end_time: '10:00',
    prio: 'NORMAL',
  });

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
    // [*Modified Code] 다이어리 데이터가 존재하면 읽기 모드(isEditing=false), 없으면 쓰기 모드(isEditing=true)
    setIsEditing(!currentDiary?._id);

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
            type: file.type || '',
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    // Reset input so the same file can be uploaded again if removed
    e.target.value = '';
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
      setIsEditing(false); // 저장 성공 후 읽기 모드로 강제 전환
      toast.success('Diary synchronized successfully');
    } catch (err) {
      toast.error('Failed to save diary');
    }
  };

  // [*Added Code] Quick Widget Add & Edit 핸들러
  const openQuickModal = (type, action = 'add', payload = null) => {
    setModalConfig({ isOpen: true, type, action, payload });
    if (payload) {
      setQuickInput({
        title: type === 'habit' ? payload.habit_name : payload.title,
        start_time:
          payload.start_time || payload.start_date
            ? format(
                parseISO(payload.start_date || new Date().toISOString()),
                'HH:mm',
              )
            : '09:00',
        end_time:
          payload.end_time || payload.end_date
            ? format(
                parseISO(payload.end_date || new Date().toISOString()),
                'HH:mm',
              )
            : '10:00',
        prio: payload.prio || 'NORMAL',
      });
    } else {
      setQuickInput({
        title: '',
        start_time: '09:00',
        end_time: '10:00',
        prio: 'NORMAL',
      });
    }
  };

  const handleQuickSubmit = () => {
    if (!quickInput.title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    const { type, action, payload } = modalConfig;

    if (type === 'todo') {
      const getLabel = (p) =>
        p === 'HIGH'
          ? 'bg-red-500/20 text-red-500 border-red-500/30'
          : 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      if (action === 'add') {
        setLocalTodos([
          ...localTodos,
          {
            id: Date.now(),
            title: quickInput.title,
            prio: quickInput.prio,
            label: getLabel(quickInput.prio),
          },
        ]);
      } else {
        setLocalTodos(
          localTodos.map((t) =>
            t.id === payload.id
              ? {
                  ...t,
                  title: quickInput.title,
                  prio: quickInput.prio,
                  label: getLabel(quickInput.prio),
                }
              : t,
          ),
        );
      }
      toast.success('Todo successfully synchronized.');
    } else if (type === 'schedule') {
      if (action === 'add') {
        // 백엔드 연동: addScheduleThunk 사용 (임시 데이터 래핑)
        toast.success(
          'Event creation dispatched via Tab (Mock / Requires Thunk config)',
        );
      } else {
        toast.info('Event updated (Mock / Requires PUT Thunk Endpoint)');
      }
    } else if (type === 'habit') {
      if (action === 'add') {
        toast.success('Protocol added via Tab (Mock / Requires Thunk config)');
      } else {
        toast.info('Protocol updated (Mock / Requires PUT Thunk Endpoint)');
      }
    }

    setModalConfig({ isOpen: false, type: null, action: 'add', payload: null });
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
    <>
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

      {/* [Modified Code] isShowAll prop을 통한 조건부 렌더링. 단독 캘린더 뷰일 땐 캘린더만 꽉 차게 노출합니다. */}
      {!isShowAll ? (
        <div className="flex h-full w-full overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-1000 relative p-6">
          <div className="flex-1 bg-[#111318]/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl flex items-center justify-center overflow-y-auto">
            <Calendar
              className="v2-calendar !w-full !max-w-none"
              onChange={handleDateChange}
              value={new Date(selectedDate)}
              tileContent={getTileContent}
              tileClassName={getTileClassName}
              locale="ko-KR"
              formatDay={(l, d) => format(d, 'd')}
              calendarType="gregory"
            />
          </div>
        </div>
      ) : (
        <div className="flex gap-8 h-full w-full overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-1000 relative">
          {/* LEFT BLOCK: Calendar + Bottom 3 Widgets */}
          <div className="flex-[7.5] flex flex-col gap-6 min-h-0 min-w-0 h-full relative z-10 pb-5">
            {/* CALENDAR SECTION */}
            <div className="flex-[2] bg-[#111318]/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl flex items-center justify-center min-h-0 overflow-y-auto">
              <Calendar
                className="v2-calendar !w-full !max-w-none"
                onChange={handleDateChange}
                value={new Date(selectedDate)}
                tileContent={getTileContent}
                tileClassName={getTileClassName}
                locale="ko-KR"
                formatDay={(l, d) => format(d, 'd')}
                calendarType="gregory"
              />
            </div>

            {/* BOTTOM 3 WIDGETS SECTION */}
            <div className="flex-[1.2] flex gap-5 min-h-0 shrink-0">
              {/* TODO WIDGET */}
              <div className="flex-1 bg-[#111318]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-6 flex flex-col overflow-hidden shadow-xl">
                <header className="flex justify-between items-center mb-4 shrink-0">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 flex items-center gap-2">
                    <MdList size={18} /> TODO
                  </h3>
                  <button
                    onClick={() => openQuickModal('todo', 'add')}
                    className="w-5 h-5 rounded hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <MdAdd size={14} />
                  </button>
                </header>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                  {localTodos.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => openQuickModal('todo', 'edit', t)}
                      className="p-3 bg-white/[0.02] rounded-xl border border-white/5 flex flex-col gap-1 cursor-pointer hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-gray-300 truncate group-hover:text-white transition-colors">
                          {t.title}
                        </span>
                        <span
                          className={`text-[8px] px-1.5 py-0.5 rounded font-black border ${t.label}`}
                        >
                          {t.prio}
                        </span>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab && setActiveTab('todo')}
                    className="w-full mt-2 py-2 border border-dashed border-white/10 rounded-xl text-[10px] font-bold text-gray-500 hover:text-white hover:border-white/30 transition-all"
                  >
                    + MORE TASKS
                  </button>
                </div>
              </div>

              {/* SCHEDULE WIDGET */}
              <div className="flex-1 bg-[#111318]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-6 flex flex-col overflow-hidden shadow-xl">
                <header className="flex justify-between items-center mb-4 shrink-0">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 flex items-center gap-2">
                    <MdEvent size={18} /> SCHEDULE
                  </h3>
                  <button
                    onClick={() => openQuickModal('schedule', 'add')}
                    className="w-5 h-5 rounded hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <MdAdd size={14} />
                  </button>
                </header>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                  {schedules
                    .filter((s) =>
                      isSameDay(parseISO(s.start_date), new Date(selectedDate)),
                    )
                    .map((s) => (
                      <div
                        key={s._id}
                        onClick={() => openQuickModal('schedule', 'edit', s)}
                        className="p-3 bg-white/[0.02] rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1 h-3 rounded-full bg-purple-500" />
                          <span className="text-[11px] font-bold text-gray-300 truncate group-hover:text-white transition-colors">
                            {s.title}
                          </span>
                        </div>
                        <div className="text-[9px] text-gray-500 font-bold ml-3">
                          {format(parseISO(s.start_date), 'HH:mm')} —{' '}
                          {format(parseISO(s.end_date), 'HH:mm')}
                        </div>
                      </div>
                    ))}
                  {schedules.filter((s) =>
                    isSameDay(parseISO(s.start_date), new Date(selectedDate)),
                  ).length === 0 && (
                    <div className="text-center text-[10px] text-gray-600 mt-4 font-bold">
                      No Events
                    </div>
                  )}
                </div>
              </div>

              {/* HABIT WIDGET */}
              <div className="flex-1 bg-[#111318]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-6 flex flex-col overflow-hidden shadow-xl">
                <header className="flex justify-between items-center mb-4 shrink-0">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 flex items-center gap-2">
                    <MdEmojiEvents size={18} /> HABIT
                  </h3>
                  <button
                    onClick={() => openQuickModal('habit', 'add')}
                    className="w-5 h-5 rounded hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <MdAdd size={14} />
                  </button>
                </header>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                  {habits.map((h) => (
                    <div
                      key={h._id}
                      onClick={() => openQuickModal('habit', 'edit', h)}
                      className="p-3 bg-white/[0.02] rounded-xl border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors group"
                    >
                      <div
                        className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center ${h.is_completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'}`}
                      >
                        {h.is_completed ? (
                          <MdCheckCircle size={14} />
                        ) : (
                          <MdRadioButtonUnchecked size={14} />
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-bold flex-1 truncate ${h.is_completed ? 'line-through text-gray-600' : 'text-gray-300 group-hover:text-white'}`}
                      >
                        {h.habit_name}
                      </span>
                    </div>
                  ))}
                  {habits.length === 0 && (
                    <div className="text-center text-[10px] text-gray-600 mt-4 font-bold">
                      No Protocols
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT BLOCK: DAILY LIFE LOG (DIARY) */}
          <div className="flex-[3] flex flex-col gap-6 overflow-hidden min-w-0 h-full relative z-10 pb-5">
            <div className="flex-1 min-h-0 bg-[#111318]/60 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-7 flex flex-col gap-5 shadow-2xl">
              <header className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/10 shadow-inner">
                    <MdBook size={24} />
                  </div>
                  <div>
                    <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-white">
                      DIARY
                    </h3>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Sync: {selectedDate}
                    </p>
                  </div>
                </div>
                {/* [Modified Code] Save 버튼을 헤더 우측 상단으로 이동시켜 FAB 버튼과의 겹침 현상 원천 차단 + Edit 모드 분기 */}
                {isEditing ? (
                  <button
                    onClick={handleSaveDiary}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-1.5"
                  >
                    <MdSave size={16} /> <span className="mt-0.5">Save</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl flex items-center gap-1.5"
                  >
                    <MdEdit size={16} />{' '}
                    <span className="mt-0.5">Edit Log</span>
                  </button>
                )}
              </header>

              <div className="flex-1 min-h-0 flex flex-col bg-white/[0.03] rounded-[2rem] border border-white/5 p-5 overflow-hidden shadow-inner">
                <div className="flex-1 min-h-0 mb-4">
                  <textarea
                    value={diaryContent}
                    onChange={(e) => setDiaryContent(e.target.value)}
                    placeholder={
                      isEditing
                        ? '여정의 조각들을 기록하세요...'
                        : '기록이 비어있습니다.'
                    }
                    readOnly={!isEditing}
                    className={`w-full h-full bg-transparent border-none text-gray-200 focus:outline-none resize-none text-[15px] leading-[1.8] overflow-y-auto custom-scrollbar pr-2 ${!isEditing ? 'opacity-80 cursor-default' : ''}`}
                  />
                </div>

                {diaryImages.length > 0 && (
                  <div className="h-[140px] flex gap-4 auto-cols-max overflow-x-auto py-3 mb-3 custom-scrollbar shrink-0 border-t border-white/5 pt-3">
                    {diaryImages.map((img) => {
                      // [*Modified Code] 이미지가 아닌 일반 파일(PDF 문서 등)일 경우 파일 아이콘과 이름으로 렌더링하도록 분기 처리
                      const isImage =
                        img.url?.startsWith('data:image') ||
                        img.type?.startsWith('image/') ||
                        img.name?.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i);

                      return (
                        <div
                          key={img.id}
                          className="relative min-w-[100px] w-[100px] h-[110px] rounded-2xl overflow-hidden border border-white/10 group shadow-2xl flex-shrink-0 bg-[#16181d] flex flex-col items-center justify-between transition-all hover:-translate-y-1"
                        >
                          {isImage ? (
                            <div className="w-full h-[75px] bg-black/40 overflow-hidden relative">
                              <img
                                src={img.url}
                                alt="preview"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                            </div>
                          ) : (
                            <div className="w-full h-[75px] flex flex-col items-center justify-center p-2 text-gray-400 bg-white/5 relative">
                              <MdAttachFile
                                size={28}
                                className="mb-1 text-emerald-400/80 drop-shadow-lg"
                              />
                            </div>
                          )}

                          {/* [*Added Code] 썸네일 하단에 파일명을 명시적으로 출력하여 무슨 파일인지 파악 가능하게 함 */}
                          <div className="w-full h-[35px] bg-[#0f1115]/90 backdrop-blur-md flex items-center justify-center px-2 border-t border-white/5">
                            <span className="text-[8px] font-bold text-gray-300 truncate w-full text-center tracking-wider">
                              {img.name || 'document.file'}
                            </span>
                          </div>

                          {isEditing && (
                            <button
                              onClick={() => removeImage(img.id)}
                              className="absolute top-1.5 right-1.5 p-1.5 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl active:scale-95"
                            >
                              <MdClose size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isEditing && (
                  <div className="flex justify-start items-center pt-3 border-t border-white/5 shrink-0">
                    <div className="flex gap-2">
                      <label
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-blue-400 cursor-pointer shadow-sm transition-all"
                        title="Add Image"
                      >
                        <MdImage size={20} />
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      {/* [*Modified Code] 문서/기타 파일을 업로드 할 수 있도록 파일 인풋 래퍼(label)로 버튼을 감싸 활성화함 */}
                      <label
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-emerald-400 cursor-pointer shadow-sm transition-all"
                        title="Attach Document"
                      >
                        <MdAttachFile size={20} />
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="fixed bottom-12 right-12 z-[9999] fab-container group flex flex-col items-end gap-6">
            <div className="flex flex-col gap-5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-700">
              {/* [*Modified Code] 사용자가 요청한 모든 탭으로 이동할 수 있는 아이콘들을 FAB에 추가 */}
              <button
                onClick={() => setActiveTab && setActiveTab('todo')}
                className="fab-item w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-400 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform relative group/btn"
                style={{ animationDelay: '0.15s' }}
              >
                <span className="absolute right-16 px-3 py-1 bg-black/80 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  Todo
                </span>
                <MdList size={26} />
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('schedule')}
                className="fab-item w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform relative group/btn"
                style={{ animationDelay: '0.1s' }}
              >
                <span className="absolute right-16 px-3 py-1 bg-black/80 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  Schedule
                </span>
                <MdAccessTime size={26} />
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('habit')}
                className="fab-item w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform relative group/btn"
                style={{ animationDelay: '0.05s' }}
              >
                <span className="absolute right-16 px-3 py-1 bg-black/80 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  Habit
                </span>
                <MdEmojiEvents size={26} />
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('diary')}
                className="fab-item w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform relative group/btn"
              >
                <span className="absolute right-16 px-3 py-1 bg-black/80 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  Diary
                </span>
                <MdBook size={26} />
              </button>
            </div>
            <button className="main-box w-20 h-20 bg-gradient-to-br from-indigo-600 to-pink-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl relative overflow-hidden group-hover:scale-95 transition-all">
              <MdCardGiftcard size={36} />
            </button>
          </div>
        </div>
      )}

      {/* [*Added Code] 통합 Quick Add/Edit 모달 */}
      {modalConfig.isOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget)
              setModalConfig({ ...modalConfig, isOpen: false });
          }}
        >
          <div className="bg-[#111318] w-full max-w-sm rounded-[2.5rem] border border-white/10 p-7 shadow-2xl relative overflow-hidden">
            {/* Glow */}
            <div
              className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-20 pointer-events-none ${modalConfig.type === 'todo' ? 'bg-blue-500' : modalConfig.type === 'schedule' ? 'bg-purple-500' : 'bg-emerald-500'}`}
            ></div>

            <header className="flex justify-between items-start mb-6 shrink-0 z-10 relative">
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-white">
                  {modalConfig.action === 'add' ? 'NEW' : 'EDIT'}{' '}
                  <span
                    className={
                      modalConfig.type === 'todo'
                        ? 'text-blue-400'
                        : modalConfig.type === 'schedule'
                          ? 'text-purple-400'
                          : 'text-emerald-400'
                    }
                  >
                    {modalConfig.type}
                  </span>
                </h3>
                <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">
                  Synchronized Target: {selectedDate}
                </p>
              </div>
              <button
                onClick={() =>
                  setModalConfig({ ...modalConfig, isOpen: false })
                }
                className="text-gray-500 hover:text-white transition-colors"
              >
                <MdClose size={20} />
              </button>
            </header>

            <div className="space-y-4 z-10 relative">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Title / Name
                </label>
                <input
                  type="text"
                  value={quickInput.title}
                  onChange={(e) =>
                    setQuickInput({ ...quickInput, title: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50"
                  placeholder="Enter details..."
                />
              </div>

              {modalConfig.type === 'todo' && (
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                    Priority
                  </label>
                  <select
                    value={quickInput.prio}
                    onChange={(e) =>
                      setQuickInput({ ...quickInput, prio: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="HIGH">HIGH (Critical)</option>
                    <option value="NORMAL">NORMAL (Standard)</option>
                  </select>
                </div>
              )}

              {modalConfig.type === 'schedule' && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={quickInput.start_time}
                      onChange={(e) =>
                        setQuickInput({
                          ...quickInput,
                          start_time: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={quickInput.end_time}
                      onChange={(e) =>
                        setQuickInput({
                          ...quickInput,
                          end_time: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleQuickSubmit}
                className={`w-full mt-4 py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] text-white transition-all shadow-xl hover:scale-[1.02] ${modalConfig.type === 'todo' ? 'bg-blue-600 shadow-blue-600/20' : modalConfig.type === 'schedule' ? 'bg-purple-600 shadow-purple-600/20' : 'bg-emerald-600 shadow-emerald-600/20'}`}
              >
                CONFIRM & SYNC
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarTab;
