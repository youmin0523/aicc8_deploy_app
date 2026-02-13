import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { login } from '../../redux/slices/authSlice';
import { fetchGetItemV2 } from '../../redux/slices/tasksSlice_v2';
import { openModalV2 } from '../../redux/slices/modalSlice_v2';
import { toast } from 'react-toastify';
import ItemV2 from './Item_v2';

const ItemPanelV2 = ({ pageTitle }) => {
  const dispatch = useDispatch();
  const { tasks, status } = useSelector((state) => state.tasksV2);
  const auth = useSelector((state) => state.auth.authData);

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
    }
  }, [auth, dispatch]);

  const handleCreateTask = () => {
    dispatch(openModalV2({ modalType: 'create', task: null }));
  };

  return (
    <div className="flex-1 p-8 bg-[#121212] min-h-screen text-white">
      <header className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {pageTitle}
        </h2>
        <button
          onClick={handleCreateTask}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-blue-900/40"
        >
          + Add New Task
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => <ItemV2 key={task._id} task={task} />)
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
    </div>
  );
};

export default ItemPanelV2;
