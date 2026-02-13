import React, { useState, useEffect, useRef } from 'react';
import {
  MdMenu,
  MdClose,
  MdLogout,
  MdPerson,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowDown,
  MdToday,
  MdNextPlan,
  MdBolt,
} from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

import { navMenus } from '../../utils/naviList';
import { login, logout } from '../../redux/slices/authSlice';
import {
  fetchUpdateCompleted,
  fetchGetItem,
} from '../../redux/slices/apiSlice';
import {
  openModal,
  toggleSidebar,
  setSidebar,
} from '../../redux/slices/modalSlice';

// //* [Mentor's Encyclopedia: Identity Synchronization (V1 - UI Refinement)]
// //* 1. 심볼 아이덴티티 단일화: // //* [No Duplicate Identity] 데스크탑/태블릿에서 상단 바의 로고를 숨기고 사이드바 로고만 노출하여 시각적 중복을 제거했습니다(v3.35).
// //* 2. 전역 앵커 시스템: // //* [Global Floating Orbs] Neon Orbs는 어떤 브라우저 사이즈에서도 '우측 상단'에 고정되어 업무 인사이트를 제공합니다.
// //* 3. 구현 원리:
// //*    - // //* [Responsive Header] md 이상에서는 상단 바의 배경과 로고를 제거하여 사이드바와 자연스럽게 융합되도록 설계했습니다.

const TodoList = ({ tasks, onDetail, onComplete }) => {
  if (!tasks || tasks.length === 0)
    return (
      <div className="text-center text-gray-700 text-[10px] py-4 italic font-bold uppercase tracking-widest">
        No Pending Tasks
      </div>
    );

  return (
    <ul className="flex flex-col gap-2.5 pr-1 custom-scrollbar overflow-y-auto max-h-[190px]">
      {tasks.map((task) => (
        <li
          key={task._id}
          onClick={() => onDetail(task)}
          className="group flex items-center justify-between p-3.5 rounded-2xl bg-black/30 hover:bg-black/50 transition-all cursor-pointer border border-white/5 hover:border-blue-500/30 shadow-sm"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.isimportant ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-gray-800'}`}
            ></div>
            <span className="truncate text-gray-400 text-[11px] group-hover:text-gray-100 font-bold tracking-tight lowercase">
              {task.title}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task);
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-inner"
          >
            <MdBolt size={13} />
          </button>
        </li>
      ))}
    </ul>
  );
};

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

const NeonOrb = ({ count, icon, color, mini, onTrigger, onLeave }) => {
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
        className={`group relative rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 border-b-[3px] border-r-[3px]
        ${mini ? 'w-10 h-10' : 'w-16 h-16 md:w-14 md:h-14 lg:w-16 lg:h-16'} bg-gradient-to-br ${styles}`}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.4),transparent)] opacity-40"></div>
        <div
          className={`${mini ? 'text-lg' : 'text-2xl'} text-white relative z-10 ${count > 0 && 'animate-pulse'}`}
        >
          {icon}
        </div>
        <div
          className={`absolute -top-1 -right-1 rounded-full bg-white text-black font-black flex items-center justify-center shadow-lg border-2 border-black/10 transition-all
          ${mini ? 'w-4 h-4 text-[7px]' : 'w-6 h-6 text-[10px]'}`}
        >
          {count}
        </div>
      </button>
    </div>
  );
};

const Navbar = () => {
  const dispatch = useDispatch();
  const path = useLocation();
  const isActive = (to) => path.pathname === to;

  const authState = useSelector((state) => state.auth.authData);
  const tasks = useSelector((state) => state.api.getItemData);
  const isSidebarOpen = useSelector((state) => state.modal.isSidebarOpen);

  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [activeOrb, setActiveOrb] = useState(null);
  const hoverTimer = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) setIsDesktopOpen(false);
      else setIsDesktopOpen(true);
      if (window.innerWidth >= 768) dispatch(setSidebar(false));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const getToday = () => new Date().toISOString().split('T')[0];
  const todaysTasks = tasks?.filter(
    (t) => t.date === getToday() && !t.iscompleted,
  );
  const tomorrowsTasks = tasks?.filter(
    (t) => t.date !== getToday() && !t.iscompleted,
  );

  const handleOrbTrigger = (type, isClick = false) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setActiveOrb((prev) => {
      if (isClick && prev === type) return null;
      return type;
    });
  };

  const handleOrbLeave = () => {
    hoverTimer.current = setTimeout(() => {
      setActiveOrb(null);
    }, 450);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (res) => {
      const info = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${res.access_token}` },
        },
      ).then((r) => r.json());
      dispatch(login({ authData: info }));
      if (info.sub) dispatch(fetchGetItem(info.sub));
    },
  });

  const handleGlobalComplete = async (task) => {
    try {
      await dispatch(
        fetchUpdateCompleted({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: task._id, isCompleted: true }),
        }),
      ).unwrap();
      dispatch(fetchGetItem(authState.sub));
      toast.success('Protocol Executed');
    } catch {
      toast.error('Sync failed');
    }
  };

  return (
    <>
      {/* //* [Unified Global Header] md 이상에서는 로고와 배경을 제거하며, 사이드바 버튼 클릭 방해 방지를 위해 pointer-events 제어 */}
      <header
        className="fixed top-0 left-0 w-full h-20 flex items-center justify-between px-6 z-[1000] transition-all
        bg-[#0d1117]/90 backdrop-blur-2xl border-b border-white/5 md:bg-transparent md:backdrop-blur-none md:border-none md:pointer-events-none"
      >
        {/* Mobile-Only Elements: Hamburger & Center Symbol */}
        <div className="flex-1 flex items-center md:hidden pointer-events-auto">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="w-12 h-12 rounded-2xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all border border-white/5 active:scale-90"
          >
            {isSidebarOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-3 absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="logo scale-75"></div>
          <h1 className="text-white font-black italic text-base tracking-tighter uppercase whitespace-nowrap">
            YOUMINSU
          </h1>
        </div>

        {/* //* [Right-Side Orbs] 항상 우측 상단에 고정 */}
        <div className="flex-1 flex items-center justify-end gap-5 pointer-events-auto">
          <NeonOrb
            count={todaysTasks?.length || 0}
            icon={<MdToday />}
            color="red"
            mini={true}
            onTrigger={(isClick) => handleOrbTrigger('today', isClick)}
            onLeave={handleOrbLeave}
          />
          <NeonOrb
            count={tomorrowsTasks?.length || 0}
            icon={<MdNextPlan />}
            color="blue"
            mini={true}
            onTrigger={(isClick) => handleOrbTrigger('future', isClick)}
            onLeave={handleOrbLeave}
          />
        </div>
      </header>

      {/* Main Sidebar */}
      <nav
        className={`bg-[#0d1117] h-full border-r border-white/5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0 z-50 flex flex-col
        ${isSidebarOpen ? 'fixed top-0 left-0 translate-x-0 w-[320px] shadow-[50px_0_100px_rgba(0,0,0,0.5)] pt-12' : 'fixed md:relative top-0 left-0 -translate-x-full md:translate-x-0 pt-16'}
        ${isDesktopOpen ? 'md:w-[320px] p-8 px-10' : 'md:w-[100px] px-3 py-8'}`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDesktopOpen(!isDesktopOpen);
          }}
          className="absolute top-24 -right-3.5 w-7 h-7 bg-blue-600 rounded-full hidden md:flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)] z-[2000] border-2 border-[#0d1117] cursor-pointer"
        >
          {isDesktopOpen ? (
            <MdKeyboardDoubleArrowLeft size={18} />
          ) : (
            <MdKeyboardDoubleArrowRight size={18} />
          )}
        </button>

        {/* 사이드바 메인 로고 섹션 (md 이상에서만 아이덴티티 주도) */}
        <div
          className={`flex flex-col mb-12 transition-all ${!isDesktopOpen && 'md:items-center'}`}
        >
          <div className="flex items-center gap-5">
            <div className="logo shrink-0 scale-110 shadow-[0_0_20px_rgba(59,130,246,0.2)]"></div>
            {(isDesktopOpen || isSidebarOpen) && (
              <div className="flex flex-col">
                <h2 className="font-black text-2xl tracking-tighter italic uppercase text-white leading-none">
                  YOUMINSU
                </h2>
                <span className="text-[10px] text-blue-500/60 font-black mt-2 tracking-[.3em] uppercase">
                  Signature Hub
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="nav-container flex-1 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
          {/* 메뉴 탭: 행간 슬림화 (v3.31 반영) */}
          <ul className="flex flex-col gap-1.5">
            {navMenus.map((m, i) => (
              <li
                key={i}
                className={`rounded-[1.1rem] transition-all border ${isActive(m.to) ? 'bg-blue-600 border-blue-400 shadow-[0_10px_25px_rgba(37,99,235,0.3)]' : 'border-transparent hover:bg-white/5'}`}
              >
                <Link
                  to={m.to}
                  className={`flex items-center gap-5 py-3.5 px-5 ${isDesktopOpen ? '' : 'md:justify-center p-0 md:h-14'}`}
                >
                  <span
                    className={`text-[1.4rem] ${isActive(m.to) ? 'text-white' : 'text-gray-500 transition-colors'}`}
                  >
                    {m.icon}
                  </span>
                  {(isDesktopOpen || isSidebarOpen) && (
                    <span
                      className={`text-[12px] font-black uppercase tracking-[0.2em] ${isActive(m.to) ? 'text-white' : 'text-gray-400'}`}
                    >
                      {m.label}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* 하단 브리핑 센터: Task 내용 실시간 노출 */}
          {(isDesktopOpen || isSidebarOpen) && (
            <div className="flex flex-col gap-6 mt-4 border-t border-white/5 pt-8 animate-in fade-in duration-700 pb-10">
              <div className="briefing-section">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                    <MdToday className="text-red-500/50" /> Today
                  </span>
                  <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full">
                    {todaysTasks?.length || 0}
                  </span>
                </div>
                <TodoList
                  tasks={todaysTasks}
                  onDetail={(t) =>
                    dispatch(openModal({ modalType: 'details', task: t }))
                  }
                  onComplete={handleGlobalComplete}
                />
              </div>

              <div className="briefing-section">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                    <MdNextPlan className="text-blue-500/50" /> Future
                  </span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                    {tomorrowsTasks?.length || 0}
                  </span>
                </div>
                <TodoList
                  tasks={tomorrowsTasks}
                  onDetail={(t) =>
                    dispatch(openModal({ modalType: 'details', task: t }))
                  }
                  onComplete={handleGlobalComplete}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-6">
          {authState?.name ? (
            <div
              className={`flex items-center gap-5 group cursor-pointer ${!isDesktopOpen && 'md:justify-center p-0'}`}
              onClick={() =>
                window.confirm('Terminate Session?') && dispatch(logout())
              }
            >
              <img
                src={authState.picture}
                className="w-11 h-11 rounded-2xl border-2 border-white/10 group-hover:border-red-500/50 shadow-2xl transition-all"
                alt="pr"
              />
              {(isDesktopOpen || isSidebarOpen) && (
                <div className="flex flex-col max-w-[150px]">
                  <span className="text-sm font-black text-gray-200 truncate">
                    {authState.name}
                  </span>
                  <span className="text-[9px] font-black text-blue-500/50 group-hover:text-red-500 uppercase tracking-tighter mt-1 transition-colors">
                    Admin Terminal Off
                  </span>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => loginWithGoogle()}
              className={`flex items-center gap-5 w-full hover:bg-white/5 p-4 rounded-2xl transition-all ${!isDesktopOpen && 'md:justify-center p-0 h-16'}`}
            >
              <MdPerson size={32} className="text-gray-700" />
              {(isDesktopOpen || isSidebarOpen) && (
                <span className="font-black uppercase text-[10px] tracking-[.3em] text-gray-600">
                  Access Key
                </span>
              )}
            </button>
          )}
        </div>
      </nav>

      {/* //* [Global Anchored Popup] */}
      {activeOrb && (
        <TodoPopup
          title={activeOrb === 'today' ? 'Today Briefing' : 'Future Insights'}
          tasks={activeOrb === 'today' ? todaysTasks : tomorrowsTasks}
          onClose={() => setActiveOrb(null)}
          onDetail={(t) =>
            dispatch(openModal({ modalType: 'details', task: t }))
          }
          onComplete={handleGlobalComplete}
          onMouseEnter={() => handleOrbTrigger(activeOrb)}
          onMouseLeave={handleOrbLeave}
        />
      )}

      {isSidebarOpen && (
        <div
          onClick={() => dispatch(setSidebar(false))}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[45] md:hidden animate-in fade-in duration-500"
        />
      )}
    </>
  );
};

export default Navbar;
