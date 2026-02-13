import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdAccessTime,
  MdStar,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdHistory,
} from 'react-icons/md';
import { openModalV2 } from '../../redux/slices/modalSlice_v2';
import {
  fetchUpdateCompletedV2,
  fetchPutTaskItemV2,
  fetchGetItemV2,
} from '../../redux/slices/tasksSlice_v2';
import { toast } from 'react-toastify';

// //* [Mentor's Encyclopedia: Item_v2]
// //* 1. 데이터 소스 (Data Source): Redux 'tasksV2' Slice. (V2 전용 PostgreSQL 테이블)
// //* 2. 애니메이션 (Animation):
// //*    - 호버 효과: 'hover:border-gray-600'와 'hover:scale-[1.01]'을 통한 부드러운 반응성.
// //*    - 카테고리 네온: 'boxShadow'와 'animate-pulse'를 결합한 네온 사인 효과로 카테고리 강조.
// //* 3. 구현 원리:
// //*    - // //! [Original Logic] 단순히 텍스트만 나열하여 정보의 중요도가 구분이 안 됨.
// //*    - // //* [Modified Logic] Deadline(마감)과 History(등록)를 별도 배지로 분리하여 시각적 위계 확립.

const ItemV2 = ({ task }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.authData);

  const handleOpenDetail = () =>
    dispatch(openModalV2({ modalType: 'details', task }));

  const handleToggleImportant = async (e) => {
    e.stopPropagation();
    if (!auth?.sub) return;
    try {
      await dispatch(
        fetchPutTaskItemV2({
          ...task,
          isimportant: !task.isimportant,
          isImportant: !task.isimportant,
          userId: auth.sub,
          categoryId: task.categoryid,
        }),
      ).unwrap();
      dispatch(fetchGetItemV2(auth.sub));
      toast.success(!task.isimportant ? '중요 표시 완료' : '표시 해제');
    } catch {
      toast.error('변경 실패');
    }
  };

  const handleToggleCompleted = async (e) => {
    e.stopPropagation();
    if (!auth?.sub) return;
    try {
      // //* [Modified Code] V2 전용 fetchUpdateCompletedV2 (PATCH) 를 호출하여 신규 테이블의 완료 상태를 수정합니다.
      await dispatch(
        fetchUpdateCompletedV2({
          itemId: task._id,
          isCompleted: !task.iscompleted,
        }),
      ).unwrap();
      dispatch(fetchGetItemV2(auth.sub));
      toast.success(!task.iscompleted ? 'Task 완료' : '진행 중으로 변경');
    } catch {
      toast.error('변경 실패');
    }
  };

  return (
    <div
      onClick={handleOpenDetail}
      className="bg-[#1a1a1a] border border-gray-800 rounded-[2rem] p-6 hover:border-gray-600 transition-all group relative overflow-hidden cursor-pointer flex flex-col h-[380px] shadow-2xl"
    >
      {/* //* [V2 Visual Identity] 좌측 세로 컬러 바 */}
      <div
        className="absolute top-0 left-0 w-1.5 h-full opacity-60"
        style={{
          backgroundColor:
            task.categorycolor || task.categoryColor || '#4A90E2',
        }}
      />

      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-black text-gray-100 group-hover:text-blue-400 transition-colors truncate pr-4 italic tracking-tighter">
          {task.title}
        </h3>
        <button
          onClick={handleToggleImportant}
          className={`p-2 rounded-full hover:bg-gray-800 transition-all ${task.isimportant ? 'text-yellow-400' : 'text-gray-700'}`}
        >
          <MdStar size={28} />
        </button>
      </div>

      <div className="text-gray-500 text-sm mb-6 line-clamp-3 h-[72px] overflow-hidden whitespace-pre-line leading-relaxed font-medium">
        {task.description}
      </div>

      <div className="mt-auto space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-2xl flex items-center gap-3">
            <MdHistory className="text-emerald-500" size={18} />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">
                Added
              </span>
              <span className="text-[11px] text-gray-400 truncate font-bold">
                {task.created_at?.split('T')[0]}
              </span>
            </div>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-2xl flex items-center gap-3">
            <MdAccessTime className="text-blue-500" size={18} />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-black text-blue-500/50 uppercase tracking-widest">
                Due
              </span>
              <span className="text-[11px] text-gray-400 truncate font-bold">
                {task.due_date?.split('T')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* //* [Modified Code] Category Label with Pulse Effect */}
        {(task.categoryname || task.categoryName) && (
          <div className="inline-flex items-center gap-2.5 bg-gray-900/80 px-4 py-2 rounded-full border border-gray-800">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: task.categorycolor || task.categoryColor,
                boxShadow: `0 0 10px ${task.categorycolor || task.categoryColor}`,
              }}
            />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
              {task.categoryname || task.categoryName}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-800/80">
        <button
          onClick={handleToggleCompleted}
          className={`w-full flex items-center justify-center gap-3 h-14 rounded-2xl border transition-all font-black text-xs uppercase tracking-[0.3em] ${task.iscompleted ? 'bg-emerald-500 border-transparent text-white shadow-lg shadow-emerald-500/20' : 'bg-transparent border-gray-800 text-gray-600 hover:border-blue-500 hover:text-blue-400'}`}
        >
          {task.iscompleted ? (
            <MdCheckCircle size={22} />
          ) : (
            <MdRadioButtonUnchecked size={22} />
          )}
          <span>{task.iscompleted ? 'Task Finished' : 'Work in progress'}</span>
        </button>
      </div>
    </div>
  );
};

export default ItemV2;
