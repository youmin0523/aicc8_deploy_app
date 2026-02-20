import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdEvent } from 'react-icons/md';
import NavbarV2 from '../Navbar_v2';
import CalendarTab from './CalendarTab';

const PrivateCalendarMain = () => {
  const dispatch = useDispatch();
  //* [Modified Code] 다시 V1의 통합 인증 상태(state.auth)를 바라봅니다.
  const auth = useSelector((state) => state.auth.authData);
  const navigate = useNavigate();

  // 로그인 상태가 아닐 때의 처리 (V1 로그인 유도)
  if (!auth) {
    return (
      <div className="flex bg-[#0f1115] min-h-screen text-white flex-col items-center justify-center font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full scale-150" />
        <h2 className="text-3xl font-black mb-4 uppercase tracking-[0.5em] text-white animate-pulse">
          Authentication Required
        </h2>
        <p className="text-gray-500 mb-10 font-bold uppercase tracking-widest opacity-60">
          Please login via V1 Base to access Private Space
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-12 py-5 bg-blue-600 hover:bg-blue-500 rounded-full font-black uppercase tracking-widest transition-all shadow-2xl shadow-blue-900/40 active:scale-95"
        >
          Return to Login Sector
        </button>
      </div>
    );
  }

  // 통합 세션이 확인되면 즉시 활성화
  return (
    <div className="flex bg-[#0f1115] min-h-screen text-gray-200 font-sans relative overflow-hidden">
      <NavbarV2 />
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-4 px-10 pb-10 relative z-10">
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

        <div className="flex-1 bg-[#16181d]/50 backdrop-blur-3xl rounded-[3rem] border border-white/5 p-1 transition-all min-h-0 overflow-hidden mb-4 shadow-2xl">
          <CalendarTab />
        </div>
      </main>
    </div>
  );
};

export default PrivateCalendarMain;
