import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { login } from '../../redux/slices/authSlice';
import { fetchGetItemV2 } from '../../redux/slices/tasksSlice_v2';
import { fetchCategories } from '../../redux/slices/categoriesSlice_v2';
import { openModalV2 } from '../../redux/slices/modalSlice_v2';
import { toast } from 'react-toastify';
import ItemV2 from './Item_v2';
import CalendarSectionV2 from './CalendarSectionV2';

const ItemPanelV2 = ({ pageTitle }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { tasks } = useSelector((state) => state.tasksV2);
  const { categories } = useSelector((state) => state.categoriesV2);
  const auth = useSelector((state) => state.auth.authData);

  const [selectedCategory, setSelectedCategory] = useState('all');

  // //* [Added Code] Direct Login Functionality for V2 (v2.85 - Unified Auth)
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        ).then((res) => res.json());

        // 전역 auth slice를 사용하여 V1/V2 상태 동기화
        dispatch(login({ authData: userInfo }));
        toast.success(`${userInfo.name}님, (V2) 환영합니다!`);
      } catch (error) {
        console.error('Fetch User Info Error:', error);
        toast.error('사용자 정보를 가져오는 데 실패했습니다.');
      }
    },
    onError: (error) => console.log('Login Failed:', error),
  });

  useEffect(() => {
    if (auth?.sub) {
      dispatch(fetchGetItemV2(auth.sub));
      dispatch(fetchCategories(auth.sub));
    }
  }, [auth, dispatch]);

  useEffect(() => {
    if (location.hash === '#calendar-view') {
      setTimeout(() => {
        const calendarSection = document.getElementById('calendar-view');
        if (calendarSection) {
          calendarSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const filteredTasks = tasks?.filter((task) => {
    if (selectedCategory === 'all') return true;
    return (
      task.categoryid === selectedCategory ||
      (task.categoryname === 'V1 Task' && selectedCategory === 'all')
    );
  });

  const handleCreateTask = () => {
    dispatch(openModalV2({ modalType: 'create', task: null }));
  };

  return (
    <div className="flex-1 p-8 bg-[#121212] h-screen overflow-y-auto custom-scrollbar text-white scroll-smooth">
      <header
        id="tasks-top"
        className="mb-10 flex justify-between items-center pr-40"
      >
        <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent italic tracking-tighter">
          {pageTitle}
        </h2>
        <button
          onClick={handleCreateTask}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 text-xs uppercase tracking-widest active:scale-95"
        >
          + Add New Task
        </button>
      </header>

      {/* //* [Category Sorting System] 동적 필터링 바 */}
      {auth && (
        <div className="flex flex-wrap gap-2.5 mb-10 pb-4 border-b border-gray-800/50">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
             ${selectedCategory === 'all' ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-transparent text-gray-500 border-gray-800 hover:border-gray-600'}`}
          >
            All Units
          </button>
          {categories?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2.5
                ${selectedCategory === cat._id ? 'bg-gray-800 text-white border-white/20' : 'bg-transparent text-gray-600 border-gray-800 hover:border-gray-700'}`}
              style={
                selectedCategory === cat._id
                  ? { borderLeftColor: cat.color, borderLeftWidth: '3px' }
                  : {}
              }
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: cat.color,
                  boxShadow: `0 0 8px ${cat.color}`,
                }}
              />
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks && filteredTasks.length > 0 ? (
          filteredTasks.map((task) => <ItemV2 key={task._id} task={task} />)
        ) : (
          <div className="col-span-full py-20 text-center flex justify-center items-center">
            {auth ? (
              <div className="text-gray-500 bg-[#1a1a1a] p-10 rounded-3xl border border-gray-800 border-dashed w-full">
                No tasks found. Create your first task!
              </div>
            ) : (
              /* //* [Modified Code] 기존 점선 디자인을 유지하며 호버 효과와 클릭 핸들러 적용 (v2.74) */
              <button
                onClick={loginWithGoogle}
                className="bg-[#1a1a1a] border border-gray-800 border-dashed hover:border-blue-500/50 p-10 rounded-3xl transition-all transform hover:scale-105 active:scale-100 group w-full"
              >
                <p className="text-xl font-bold text-gray-500 group-hover:text-blue-400 transition-colors">
                  로그인이 필요한 서비스입니다.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  클릭하여 로그인을 진행해 주세요.
                </p>
              </button>
            )}
          </div>
        )}
      </div>

      {/* //* [Integrated Calendar] 대시보드 내장 캘린더 섹션 */}
      <div id="calendar-view" className="mt-20">
        <CalendarSectionV2 />
      </div>
    </div>
  );
};

export default ItemPanelV2;
