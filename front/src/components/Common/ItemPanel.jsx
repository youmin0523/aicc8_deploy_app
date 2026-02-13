import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { SkeletonTheme } from 'react-loading-skeleton';
import {
  MdCheckCircle,
  MdPendingActions,
  MdErrorOutline,
  MdListAlt,
  MdInfoOutline,
} from 'react-icons/md';
import { toast } from 'react-toastify';

import PageTitle from './PageTitle';
import AddItem from './AddItem';
import Modal from './Modal';
import Item from './Item';
import LoadingSkeleton from './LoadingSkeleton';
import { fetchGetItem } from '../../redux/slices/apiSlice';
import { login } from '../../redux/slices/authSlice';

// //* [Mentor's Encyclopedia: Interactive Summary Board (V1 - Data Orchestration)]
// //* 1. 데이터 정의 (Data Semantics):
// //*    - Total: 모든 업무의 집합 / Pending: 미완료 업무 / Done: 완료 업무 / Vital: 중요 표시 업무.
// //* 2. 실시간 동적 필터링: // //* [Quick Sort] 상단 요약 카드를 클릭하면 하단 리스트가 해당 카테고리에 맞춰 즉시 재정렬됩니다.
// //* 3. UX 보정: 활성 필터에 하이라이트 효과를 부여하여 사용자가 현재 어떤 데이터를 보고 있는지 명확히 인지하게 함(v3.34).

const SummaryCard = ({
  icon,
  label,
  count,
  colorClass,
  borderClass,
  active,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`flex-1 min-w-[130px] p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.05] shadow-lg flex items-center gap-4 group
    ${active ? `bg-opacity-20 ${colorClass} ${borderClass.replace('/10', '/40')} ring-1 ring-white/10` : 'bg-[#161a22] border-transparent hover:border-white/5'}`}
  >
    <div
      className={`p-2.5 rounded-xl ${colorClass} bg-opacity-10 text-xl shrink-0 group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest truncate group-hover:text-gray-300 transition-colors">
        {label}
      </span>
      <span className="text-lg font-bold text-gray-100">{count}</span>
    </div>
  </div>
);

const ItemPanel = ({ pageTitle, filteredCompleted, filteredImportant }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [localFilter, setLocalFilter] = useState('all'); // 'all', 'pending', 'done', 'vital'

  const userKey = useSelector((state) => state.auth.authData?.sub);
  const isOpen = useSelector((state) => state.modal.isOpen);
  const allTasks = useSelector((state) => state.api.getItemData || []);

  const totalCount = allTasks.length;
  const completedCount = allTasks.filter((t) => t.iscompleted).length;
  const pendingCount = totalCount - completedCount;
  const importantCount = allTasks.filter((t) => t.isimportant).length;

  useEffect(() => {
    if (!userKey) return;
    const fetchTasks = async () => {
      try {
        setLoading(true);
        await dispatch(fetchGetItem(userKey)).unwrap();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [dispatch, userKey]);

  // 페이지 이동 시 상위에서 내려주는 필터가 바뀔 수 있으므로 localFilter 초기화 로직 (선택사항)
  useEffect(() => {
    setLocalFilter('all');
  }, [pageTitle]);

  const sortedTasks = [...allTasks]
    .filter((task) => {
      // 1순위: 상위 컴포넌트(GNB/SideBar)에서 온 기본 필터링 (Home/Completed/Important 탭 대응)
      let pass = true;
      if (filteredCompleted !== 'all') {
        pass = filteredCompleted ? task.iscompleted : !task.iscompleted;
      }
      if (filteredImportant !== undefined && pass) {
        pass = filteredImportant ? task.isimportant : !task.isimportant;
      }
      return pass;
    })
    .filter((task) => {
      // 2순위: 요약 카드 클릭을 통한 로컬 퀵 필터링
      if (localFilter === 'all') return true;
      if (localFilter === 'pending') return !task.iscompleted;
      if (localFilter === 'done') return task.iscompleted;
      if (localFilter === 'vital') return task.isimportant;
      return true;
    });

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (res) => {
      const userInfo = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${res.access_token}` },
        },
      ).then((r) => r.json());
      dispatch(login({ authData: userInfo }));
      toast.success(`${userInfo.name}님 환영합니다!`);
    },
  });

  return (
    <div className="panel bg-[#0b0e14] flex-1 h-full py-8 md:py-10 px-6 md:px-10 overflow-y-auto custom-scrollbar">
      {userKey ? (
        <div className="relative w-full h-full max-w-[1440px] mx-auto">
          {isOpen && <Modal />}

          <div className="flex flex-col gap-8 mb-12">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <PageTitle title={pageTitle} />
                <div className="group relative">
                  <MdInfoOutline
                    className="text-gray-600 hover:text-blue-500 cursor-help transition-colors"
                    size={18}
                  />
                  <div className="absolute left-0 top-6 w-64 p-4 bg-[#1e2229] border border-white/10 rounded-2xl shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50 pointer-events-none">
                    <h4 className="text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest">
                      Pipeline Dictionary
                    </h4>
                    <ul className="flex flex-col gap-2">
                      <li className="text-[11px] text-gray-400">
                        <b className="text-gray-200">TOTAL:</b> 모든 업무의 총합
                        스택
                      </li>
                      <li className="text-[11px] text-gray-400">
                        <b className="text-gray-200">PENDING:</b> 실행 대기 중인
                        미완료 건
                      </li>
                      <li className="text-[11px] text-gray-400">
                        <b className="text-gray-200">DONE:</b> 프로세스가 종료된
                        완료 건
                      </li>
                      <li className="text-[11px] text-gray-400">
                        <b className="text-gray-200">VITAL:</b> 즉각 대응이
                        필요한 중요 업무
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="hidden md:block text-[10px] font-black text-gray-700 tracking-widest uppercase italic">
                Active Protocol / {localFilter.toUpperCase()} FILTRATION
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard
                icon={<MdListAlt className="text-blue-400" />}
                label="Total"
                count={totalCount}
                colorClass="bg-blue-600"
                borderClass="border-blue-500/10"
                active={localFilter === 'all'}
                onClick={() => setLocalFilter('all')}
              />
              <SummaryCard
                icon={<MdPendingActions className="text-amber-400" />}
                label="Pending"
                count={pendingCount}
                colorClass="bg-amber-600"
                borderClass="border-amber-500/10"
                active={localFilter === 'pending'}
                onClick={() => setLocalFilter('pending')}
              />
              <SummaryCard
                icon={<MdCheckCircle className="text-emerald-400" />}
                label="Done"
                count={completedCount}
                colorClass="bg-emerald-600"
                borderClass="border-emerald-500/10"
                active={localFilter === 'done'}
                onClick={() => setLocalFilter('done')}
              />
              <SummaryCard
                icon={<MdErrorOutline className="text-red-400" />}
                label="Vital"
                count={importantCount}
                colorClass="bg-red-600"
                borderClass="border-red-500/10"
                active={localFilter === 'vital'}
                onClick={() => setLocalFilter('vital')}
              />
            </div>
          </div>

          <div className="flex flex-wrap -m-3">
            {loading ? (
              <SkeletonTheme
                baseColor="#161a22"
                highlightColor="#232936"
                height="28vh"
              >
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </SkeletonTheme>
            ) : (
              sortedTasks?.map((task) => <Item key={task._id} task={task} />)
            )}
            <AddItem />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-8 animate-in fade-in duration-1000">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl rotate-12 shadow-2xl flex items-center justify-center">
            <MdListAlt size={40} className="text-white -rotate-12" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase italic">
              Legacy Pipeline V1
            </h1>
            <button
              onClick={loginWithGoogle}
              className="mt-6 bg-white hover:bg-gray-100 text-black py-4 px-12 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all"
            >
              Initialize Access
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemPanel;
