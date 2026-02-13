import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdMenu, MdAdd, MdCalendarMonth, MdSwapHoriz } from 'react-icons/md';
import { logout } from '../../redux/slices/authSlice';
import {
  fetchCategories,
  fetchPostCategory,
} from '../../redux/slices/categoriesSlice_v2';
import { toast } from 'react-toastify';

// //* [Mentor's Encyclopedia: NavbarV2 (UI/Logic Restore)]
// //* 1. 데이터 소스: Redux 'auth' + 'categoriesV2' (V2 전용 슬라이스 명칭 복구).
// //* 2. UI 복구: V2 전용 사이드바 너비(w-72/w-20), 전용 로고 그래픽, 유저 프로필 스타일을 원상 복구했습니다.
// //* 3. 기능 복구: 초기 진입 시 카테고리 자동 생성(Auto-Init) 로직과 V1 전환 링크를 다시 연결했습니다.

const NavbarV2 = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.authData);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // //* [Bug Fix] 슬라이스 명칭을 'categoriesV2'로 올바르게 복구하여 데이터 연동 오류를 해결했습니다.
  const { categories } = useSelector((state) => state.categoriesV2);
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

  return (
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
          className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl transition-colors"
        >
          <MdAdd size={24} className="text-blue-400" />
          <span className={`${!isSidebarOpen && 'hidden'} font-bold`}>
            All Tasks
          </span>
        </Link>
        <Link
          to="/v2/calendar"
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
  );
};

export default NavbarV2;
