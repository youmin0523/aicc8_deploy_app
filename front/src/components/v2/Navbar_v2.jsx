import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MdMenu,
  MdAdd,
  MdCalendarMonth,
  MdSwapHoriz,
  MdToday,
  MdNextPlan,
  MdClose,
  MdBolt,
} from 'react-icons/md';
import { logout } from '../../redux/slices/authSlice';
import {
  fetchCategories,
  fetchPostCategory,
} from '../../redux/slices/categoriesSlice_v2';
import {
  fetchUpdateCompletedV2,
  fetchGetItemV2,
} from '../../redux/slices/tasksSlice_v2';
import { openModalV2 } from '../../redux/slices/modalSlice_v2';
import { toast } from 'react-toastify';
import { isSameDay, parseISO } from 'date-fns';

// //* [V2 Premium Components: NeonOrb & TodoPopup]
// //* V1의 핵심 UX인 Neon Orb 시스템을 V2 아키텍처에 맞게 재설계하여 이식했습니다.

const TodoPopup = ({
  title,
  tasks,
  onClose,
  onDetail,
  onComplete,
  onMouseEnter,
  onMouseLeave,
}) => (
  <div
    className="fixed top-24 right-6 z-[10000] animate-in slide-in-from-top-4 fade-in duration-400 pointer-events-auto"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <div className="absolute -top-6 left-0 w-full h-8 bg-transparent" />
    <div className="bg-[#12161d]/98 backdrop-blur-3xl border border-white/10 w-[320px] md:w-[420px] rounded-[3rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,1)] overflow-hidden border-t-blue-500/50">
      <header className="px-8 py-7 border-b border-white/5 flex justify-between items-center bg-black/40">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-100">
            {title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all"
        >
          <MdClose size={24} />
        </button>
      </header>
      <div className="p-6 max-h-[45vh] overflow-y-auto custom-scrollbar">
        {tasks?.length > 0 ? (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                onClick={() => {
                  onDetail(task);
                  onClose();
                }}
                className="w-full p-4.5 rounded-3xl bg-black/40 hover:bg-blue-600/10 border border-transparent hover:border-blue-500/30 transition-all cursor-pointer group flex items-center justify-between shadow-sm"
              >
                <div className="flex flex-col min-w-0 pr-4">
                  <span className="text-[13px] font-bold text-gray-300 group-hover:text-white truncate">
                    {task.title}
                  </span>
                  <span className="text-[9px] text-gray-600 mt-1.5 uppercase font-black tracking-tighter">
                    Command Unit ACTIVE
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete(task);
                  }}
                  className="shrink-0 p-2.5 rounded-2xl bg-white/5 hover:bg-emerald-600 text-gray-400 hover:text-white transition-all"
                >
                  <MdBolt size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="text-gray-200/10 mb-4 flex justify-center">
              <MdBolt size={40} />
            </div>
            <div className="text-gray-700 font-bold uppercase tracking-[0.3em] text-[9px]">
              Zero Tasks / Mission Clear
            </div>
          </div>
        )}
      </div>
      <footer className="p-6 bg-black/30 text-center border-t border-white/5">
        <button
          onClick={onClose}
          className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-500 transition-colors"
        >
          Terminate Visual
        </button>
      </footer>
    </div>
  </div>
);

const NeonOrb = ({ count, icon, color, onTrigger, onLeave }) => {
  const styles = {
    red: 'from-rose-500 to-red-900 shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_40px_rgba(244,63,94,0.6)] border-rose-500/40',
    blue: 'from-cyan-400 to-blue-800 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] border-cyan-400/40',
  }[color];

  return (
    <div
      className="flex flex-col items-center gap-2"
      onMouseEnter={() => onTrigger(false)}
      onMouseLeave={onLeave}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTrigger(true);
        }}
        className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 border-b-[3px] border-r-[3px] bg-gradient-to-br ${styles}`}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.4),transparent)] opacity-40"></div>
        <div
          className={`text-lg text-white relative z-10 ${count > 0 && 'animate-pulse'}`}
        >
          {icon}
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black font-black flex items-center justify-center shadow-lg border-2 border-black/10 transition-all text-[7px]">
          {count}
        </div>
      </button>
    </div>
  );
};

// //* [Mentor's Encyclopedia: NavbarV2 (UI/Logic Restore)]
// //* 1. 데이터 소스: Redux 'auth' + 'categoriesV2' (V2 전용 슬라이스 명칭 복구).
// //* 2. UI 복구: V2 전용 사이드바 너비(w-72/w-20), 전용 로고 그래픽, 유저 프로필 스타일을 원상 복구했습니다.
// //* 3. 기능 복구: 초기 진입 시 카테고리 자동 생성(Auto-Init) 로직과 V1 전환 링크를 다시 연결했습니다.

const NavbarV2 = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.authData);
  const location = useLocation();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.categoriesV2);
  const { tasks } = useSelector((state) => state.tasksV2);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeOrb, setActiveOrb] = useState(null);
  const hoverTimer = useRef(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    const initCategories = async (userId) => {
      if (isInitializing.current) return;
      isInitializing.current = true;

      try {
        const existingCats = await dispatch(fetchCategories(userId)).unwrap();
        if (existingCats && existingCats.length === 0) {
          const defaultCats = [
            { name: 'Personal', color: '#4A90E2' },
            { name: 'Study', color: '#F5A623' },
            { name: 'Health', color: '#7ED321' },
            { name: 'Privacy', color: '#9013FE' },
            { name: 'Etc', color: '#4A4A4A' },
          ];

          for (const cat of defaultCats) {
            await dispatch(fetchPostCategory({ ...cat, userId })).unwrap();
          }
          dispatch(fetchCategories(userId));
          toast.info('V2 기본 카테고리가 생성되었습니다.');
        }
      } catch (error) {
        console.error('Failed to init categories:', error);
      } finally {
        isInitializing.current = false;
      }
    };

    if (auth?.sub) {
      initCategories(auth.sub);
    }
  }, [auth?.sub, dispatch]);

  const todaysTasks = tasks?.filter(
    (t) => isSameDay(parseISO(t.due_date), new Date()) && !t.iscompleted,
  );
  const tomorrowsTasks = tasks?.filter((t) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return isSameDay(parseISO(t.due_date), tomorrow) && !t.iscompleted;
  });

  const handleOrbTrigger = (type, isClick = false) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setActiveOrb((prev) => (isClick && prev === type ? null : type));
  };

  const handleOrbLeave = () => {
    hoverTimer.current = setTimeout(() => setActiveOrb(null), 450);
  };

  const handleGlobalComplete = async (task) => {
    try {
      await dispatch(
        fetchUpdateCompletedV2({ itemId: task._id, isCompleted: true }),
      ).unwrap();
      dispatch(fetchGetItemV2(auth.sub));
      toast.success('Protocol Executed');
    } catch {
      toast.error('Sync failed');
    }
  };

  const handleCalendarClick = (e) => {
    if (location.pathname === '/v2') {
      e.preventDefault();
      const calendarSection = document.getElementById('calendar-view');
      if (calendarSection) {
        calendarSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAllTasksClick = (e) => {
    if (location.pathname === '/v2') {
      e.preventDefault();
      const tasksSection = document.getElementById('tasks-top');
      if (tasksSection) {
        tasksSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* //* [V2 Premium Header] Neon Orbs 통합 */}
      <header className="fixed top-0 right-0 p-6 z-[1000] pointer-events-none">
        <div className="flex items-center gap-5 pointer-events-auto">
          <NeonOrb
            count={todaysTasks?.length || 0}
            icon={<MdToday />}
            color="red"
            onTrigger={(isClick) => handleOrbTrigger('today', isClick)}
            onLeave={handleOrbLeave}
          />
          <NeonOrb
            count={tomorrowsTasks?.length || 0}
            icon={<MdNextPlan />}
            color="blue"
            onTrigger={(isClick) => handleOrbTrigger('future', isClick)}
            onLeave={handleOrbLeave}
          />
        </div>
      </header>

      {/* Popups */}
      {activeOrb === 'today' && (
        <TodoPopup
          title="Incursion Status: TODAY"
          tasks={todaysTasks}
          onClose={() => setActiveOrb(null)}
          onDetail={(t) =>
            dispatch(openModalV2({ modalType: 'details', task: t }))
          }
          onComplete={handleGlobalComplete}
          onMouseEnter={() => handleOrbTrigger('today')}
          onMouseLeave={handleOrbLeave}
        />
      )}
      {activeOrb === 'future' && (
        <TodoPopup
          title="Forecast Status: TOMORROW"
          tasks={tomorrowsTasks}
          onClose={() => setActiveOrb(null)}
          onDetail={(t) =>
            dispatch(openModalV2({ modalType: 'details', task: t }))
          }
          onComplete={handleGlobalComplete}
          onMouseEnter={() => handleOrbTrigger('future')}
          onMouseLeave={handleOrbLeave}
        />
      )}

      <nav
        className={`bg-[#1a1a1a] text-white transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'} h-screen flex flex-col p-4 border-r border-gray-800 shrink-0 z-50`}
      >
        <div className="flex items-center justify-between mb-8 pl-1">
          <Link
            to="/v2"
            className={`flex items-center gap-6 group ${!isSidebarOpen && 'hidden'}`}
          >
            <div className="logo scale-90 shrink-0"></div>
            <h2 className="font-black text-2xl tracking-tighter text-white group-hover:text-blue-400 transition-colors uppercase italic">
              YOUMINSU
            </h2>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 hover:bg-gray-800 rounded-lg transition-all ${!isSidebarOpen && 'mx-auto'}`}
          >
            <MdMenu size={24} />
          </button>
        </div>

        <div className="flex-1 space-y-2">
          <Link
            to="/v2"
            onClick={handleAllTasksClick}
            className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <MdAdd size={24} className="text-blue-400" />
            <span className={`${!isSidebarOpen && 'hidden'} font-bold`}>
              All Tasks
            </span>
          </Link>
          <Link
            to="/v2#calendar-view"
            onClick={handleCalendarClick}
            className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <MdCalendarMonth size={24} className="text-purple-400" />
            <span className={`${!isSidebarOpen && 'hidden'} font-bold`}>
              Calendar
            </span>
          </Link>

          {/* V1 전환 링크 복원 */}
          <div className="pt-4 mt-4 border-t border-gray-800">
            <Link
              to="/"
              className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl transition-colors group"
            >
              <MdSwapHoriz
                size={24}
                className="text-cyan-400 group-hover:rotate-180 transition-transform duration-500"
              />
              <span
                className={`${!isSidebarOpen && 'hidden'} text-cyan-400 font-bold italic`}
              >
                Switch to V1
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-auto border-t border-gray-800 pt-4">
          {auth ? (
            <div className="flex items-center gap-3 p-2">
              <img
                src={auth.picture}
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <div className={`${!isSidebarOpen && 'hidden'} min-w-0`}>
                <p className="text-sm font-bold truncate">{auth.name}</p>
                <button
                  onClick={() => dispatch(logout())}
                  className="text-xs text-gray-500 hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <p
              className={`text-sm text-gray-500 text-center ${!isSidebarOpen && 'hidden'}`}
            >
              Login Required
            </p>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavbarV2;
