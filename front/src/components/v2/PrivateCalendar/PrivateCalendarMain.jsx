import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MdEvent,
  MdBook,
  MdEmojiEvents,
  MdAccessTime,
  MdList,
  MdDashboard,
  MdLockOutline,
  MdBackspace,
} from 'react-icons/md';
import NavbarV2 from '../Navbar_v2';
import CalendarTab from './CalendarTab';
import DiaryTab from './DiaryTab';
import HabitTab from './HabitTab';
import ScheduleTab from './ScheduleTab';
import TodoTab from './TodoTab';
import { toast } from 'react-toastify';

const TABS = [
  { id: 'showAll', label: 'Show All', icon: <MdDashboard size={18} /> },
  { id: 'calendar', label: 'Calendar', icon: <MdEvent size={18} /> },
  { id: 'diary', label: 'Diary', icon: <MdBook size={18} /> },
  { id: 'habit', label: 'Habit', icon: <MdEmojiEvents size={18} /> },
  { id: 'schedule', label: 'Schedule', icon: <MdAccessTime size={18} /> },
  { id: 'todo', label: 'Todo', icon: <MdList size={18} /> },
];

const PrivateCalendarMain = () => {
  const dispatch = useDispatch();
  //* [Modified Code] 다시 V1의 통합 인증 상태(state.auth)를 바라봅니다.
  const auth = useSelector((state) => state.auth.authData);
  const navigate = useNavigate();

  // [*Modified Code] 탭 상태 전환 추가 (사용자 요청: 모든 탭 노출 및 showAll 기본 선택)
  const [activeTab, setActiveTab] = useState('showAll');

  // [*Added Code] 프라이빗 공간 PIN 잠금 상태
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [mode, setMode] = useState('enter'); // 'enter', 'check_old', 'new_pin', 'confirm_pin'
  const [tempNewPin, setTempNewPin] = useState('');
  const [shake, setShake] = useState(false);

  // 현재 사용자 PIN 가져오기 (기본값 0000)
  const getSavedPin = () =>
    localStorage.getItem(`private_pin_${auth?.sub}`) || '0000';

  const handlePinInput = (num) => {
    if (inputPin.length < 4) {
      const newPin = inputPin + num;
      setInputPin(newPin);

      if (newPin.length === 4) {
        setTimeout(() => processPinComplete(newPin), 150);
      }
    }
  };

  const processPinComplete = (currentInput) => {
    const savedPin = getSavedPin();
    if (mode === 'enter') {
      if (currentInput === savedPin) {
        setIsUnlocked(true);
      } else {
        triggerError('Access Denied: Invalid PIN');
      }
    } else if (mode === 'check_old') {
      if (currentInput === savedPin) {
        setMode('new_pin');
        setInputPin('');
        toast.info('Enter new 4-digit PIN');
      } else {
        triggerError('Invalid current PIN');
      }
    } else if (mode === 'new_pin') {
      if (currentInput === savedPin) {
        toast.info('기존 비밀번호와 일치합니다. 변경 작업을 취소합니다.');
        setMode('enter');
        setInputPin('');
        return;
      }
      setTempNewPin(currentInput);
      setMode('confirm_pin');
      setInputPin('');
      toast.info('Confirm new PIN');
    } else if (mode === 'confirm_pin') {
      if (currentInput === tempNewPin) {
        localStorage.setItem(`private_pin_${auth?.sub}`, tempNewPin);
        toast.success('PIN Code successfully changed.');
        setMode('enter');
        setInputPin('');
      } else {
        toast.error('PIN codes do not match. Try again.');
        setMode('new_pin');
        setInputPin('');
      }
    }
  };

  const triggerError = (msg) => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setInputPin('');
    toast.error(msg);
  };

  const handleDelete = () => {
    setInputPin((prev) => prev.slice(0, -1));
  };

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

  // [*Added Code] PIN 잠금 화면 (인증 완료 전 탑재됨)
  if (!isUnlocked) {
    return (
      <div className="flex bg-[#0f1115] min-h-screen text-white flex-col items-center justify-center font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full scale-150 pointer-events-none" />

        <div
          className={`z-10 flex flex-col items-center transition-transform ${shake ? 'translate-x-[10px]' : ''}`}
        >
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            <MdLockOutline size={36} className="text-blue-500" />
          </div>

          <h2 className="text-2xl font-black mb-2 uppercase tracking-[0.4em] text-white">
            {mode === 'enter'
              ? 'Private Protocol Locked'
              : mode === 'check_old'
                ? 'Verify Current PIN'
                : mode === 'new_pin'
                  ? 'Enter New PIN'
                  : 'Confirm New PIN'}
          </h2>
          <p className="text-gray-500 mb-12 font-bold uppercase tracking-widest text-[10px]">
            {mode === 'enter'
              ? 'Enter 4-digit PIN to access spatial data'
              : mode === 'check_old'
                ? 'Authentication required for modification'
                : mode === 'new_pin'
                  ? 'Set a new 4-digit security code'
                  : 'Re-enter to confirm your new code'}
          </p>

          {/* Dots */}
          <div className="flex gap-6 mb-12">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${i < inputPin.length ? 'bg-blue-500 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-white/10'}`}
              />
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handlePinInput(num.toString())}
                className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xl font-bold transition-all hover:scale-110 hover:border-blue-500/30 flex items-center justify-center"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => {
                if (mode === 'enter') {
                  setMode('check_old');
                  setInputPin('');
                } else {
                  setMode('enter');
                  setInputPin('');
                }
              }}
              className="w-16 h-16 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-400 hover:text-white transition-all uppercase hover:bg-white/5"
            >
              {mode === 'enter' ? 'Change' : 'Cancel'}
            </button>
            <button
              onClick={() => handlePinInput('0')}
              className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xl font-bold transition-all hover:scale-110 hover:border-blue-500/30 flex items-center justify-center"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="w-16 h-16 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all hover:bg-white/5"
            >
              <MdBackspace size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-3 w-full mt-2">
            {mode === 'enter' && (
              <button
                onClick={() => {
                  localStorage.setItem(`private_pin_${auth?.sub}`, '0000');
                  toast.warn(
                    'Neural-Link 초기화: PIN이 기본값(0000)으로 강제 재설정되었습니다.',
                  );
                  setMode('enter');
                  setInputPin('');
                }}
                className="text-[10px] font-bold text-blue-500/70 hover:text-blue-400 uppercase tracking-[0.2em] transition-colors"
              >
                Forgot the password?
              </button>
            )}

            {mode === 'enter' && (
              <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                Default PIN: <span className="text-gray-400">0000</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 통합 세션이 확인되면 즉시 활성화
  return (
    <div className="flex bg-[#0f1115] min-h-screen text-gray-200 font-sans relative overflow-hidden">
      <NavbarV2 />
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-4 px-10 pb-10 relative z-10">
        <header className="flex items-center mb-3 shrink-0 relative z-20 min-h-[60px]">
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-1">
              Private <span className="text-blue-500">Calendar</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-bold tracking-[0.4em] uppercase opacity-70">
              Personal Life Log & Achievement
            </p>
          </div>

          {/* [*Modified Code] 사용자가 요청한 모든 탭 리스트 노출 영역 (Orb 간섭 회피를 위해 중앙 위치 지정) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex bg-[#16181d]/80 rounded-2xl p-1.5 border border-white/5 shadow-2xl">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 bg-[#16181d]/50 backdrop-blur-3xl rounded-[3rem] border border-white/5 p-1 transition-all min-h-0 overflow-hidden mb-4 shadow-2xl flex flex-col">
          {activeTab === 'showAll' && (
            <CalendarTab setActiveTab={setActiveTab} isShowAll={true} />
          )}
          {activeTab === 'calendar' && (
            <CalendarTab setActiveTab={setActiveTab} isShowAll={false} />
          )}
          {activeTab === 'diary' && <DiaryTab />}
          {activeTab === 'habit' && <HabitTab />}
          {activeTab === 'schedule' && <ScheduleTab />}
          {activeTab === 'todo' && <TodoTab />}
        </div>
      </main>
    </div>
  );
};

export default PrivateCalendarMain;
