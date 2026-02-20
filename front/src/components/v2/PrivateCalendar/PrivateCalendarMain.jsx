import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MdBook,
  MdAutoMode,
  MdList,
  MdEvent,
  MdArrowBack,
  MdArrowForward,
} from 'react-icons/md';
import NavbarV2 from '../Navbar_v2';
import DiaryTab from './DiaryTab';
import HabitTab from './HabitTab';
import TodoTab from './TodoTab';
import ScheduleTab from './ScheduleTab';
import CalendarTab from './CalendarTab'; //* [Modified Code] CalendarTab 임포트 추가

const PrivateCalendarMain = () => {
  const [activeTab, setActiveTab] = useState('calendar'); //* [Modified Code] calendar를 기본 탭으로 설정 (기존: diary)
  const auth = useSelector((state) => state.auth.authData);
  const navigate = useNavigate();

  // 로그인 상태 체크
  if (!auth) {
    return (
      <div className="flex bg-[#0f1115] min-h-screen text-white flex-col items-center justify-center">
        <h2 className="text-2xl font-black mb-4 uppercase tracking-widest">
          Authentication Required
        </h2>
        <p className="text-gray-500 mb-8 font-bold">
          Please login to access Private Space
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-10 py-4 bg-blue-600 rounded-full font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        >
          Return to Base
        </button>
      </div>
    );
  }

  // 탭 정보 정의
  const tabs = [
    { id: 'calendar', label: '캘린더', icon: <MdEvent /> }, //* [Modified Code] 통합 캘린더 탭 추가
    { id: 'diary', label: '다이어리', icon: <MdBook /> },
    { id: 'habit', label: '습관', icon: <MdAutoMode /> },
    { id: 'todo', label: '할일', icon: <MdList /> },
    { id: 'schedule', label: '일정', icon: <MdEvent /> },
  ];

  return (
    <div className="flex bg-[#0f1115] min-h-screen text-gray-200 font-sans">
      <NavbarV2 />

      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto pt-4 px-10 pb-10 custom-scrollbar">
        {/* 헤더 섹션 - 폰트 사이즈 대폭 축소하여 상단 공간 확보 */}
        <header className="flex justify-between items-center mb-3 shrink-0">
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-1">
              Private <span className="text-blue-500">Calendar</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-bold tracking-[0.4em] uppercase opacity-70">
              Personal Life Log & Achievement
            </p>
          </div>
        </header>

        {/* 컨텐츠 영역 - CalendarTab으로 단일 고정, 높이 제약 해제 */}
        <div className="flex-1 bg-[#16181d]/50 backdrop-blur-3xl rounded-[3rem] border border-white/5 p-1 transition-all">
          <CalendarTab />
        </div>
      </main>
    </div>
  );
};

export default PrivateCalendarMain;
