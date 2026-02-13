import React, { useState } from 'react';
import {
  MdEditDocument,
  MdInfoOutline,
  MdCalendarToday,
  MdErrorOutline,
} from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import {
  fetchDeleteItem,
  fetchGetItem,
  fetchUpdateCompleted,
} from '../../redux/slices/apiSlice';
import { openModal } from '../../redux/slices/modalSlice';

// //* [Mentor's Encyclopedia: Item (V1 - Ultra Premium Edition)]
// //* 1. 레이어드 디자인: // //* [Elevation Logic] 카드의 그림자와 테두리 광택을 정교하게 조절하여 입체감을 부여했습니다.
// //* 2. 반응형 보정: // //* [3-Step Breakpoints] w-full(Mobile) -> md:w-1/2(Tablet) -> lg:w-1/3(Desktop) 레이아웃을 완벽하게 지원합니다.
// //* 3. 용어 동기화: // //* [Lesson Sync] 버튼 라벨을 수업 시간에 약속된 'Completed / Incomplete'로 유지하여 학습 일관성을 확보했습니다(v3.21).

const Item = ({ task }) => {
  const dispatch = useDispatch();
  const { _id, title, description, date, iscompleted, isimportant, userid } =
    task;
  const [localCompleted, setLocalCompleted] = useState(iscompleted);

  const formatDate = (dateStr) => {
    try {
      return format(parseISO(dateStr), 'MMM dd, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const toggleCompleted = async (e) => {
    e.stopPropagation();
    const nextState = !localCompleted;
    setLocalCompleted(nextState);
    try {
      await dispatch(
        fetchUpdateCompleted({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: _id, isCompleted: nextState }),
        }),
      ).unwrap();
      dispatch(fetchGetItem(userid));
    } catch {
      setLocalCompleted(!nextState);
      toast.error('변경 실패');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await dispatch(fetchDeleteItem(_id)).unwrap();
      dispatch(fetchGetItem(userid));
      toast.success('삭제되었습니다.');
    } catch {
      toast.error('삭제 실패');
    }
  };

  return (
    <div className="item w-full md:w-1/2 lg:w-1/3 p-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div
        className={`group relative w-full h-full rounded-2xl transition-all duration-500 border
        ${isimportant ? 'border-red-500/20 bg-gradient-to-br from-[#1e1616] to-[#161a22]' : 'border-gray-800 bg-[#161a22]'}
        ${localCompleted ? 'opacity-30 grayscale-[0.8]' : 'hover:scale-[1.03] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] hover:border-gray-600'}
        flex flex-col justify-between overflow-hidden shadow-2xl`}
      >
        {/* Important Marker & Glow Layout */}
        {isimportant && (
          <>
            <div className="absolute left-0 top-0 w-1.5 h-full bg-red-500 z-10 shadow-[2px_0_10px_rgba(239,68,68,0.5)]"></div>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MdErrorOutline className="text-red-500 text-6xl rotate-[15deg]" />
            </div>
          </>
        )}

        <div className="p-8">
          <div className="flex flex-col gap-3 mb-6">
            <h2
              className={`text-[1.2rem] font-black tracking-tight leading-snug transition-all ${localCompleted ? 'text-gray-600 line-through' : 'text-white group-hover:text-blue-400'}`}
            >
              {title}
            </h2>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/5 text-gray-400">
                <MdCalendarToday size={12} className="text-blue-500/70" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {formatDate(date)}
                </span>
              </div>
              {isimportant && (
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                  Critical
                </span>
              )}
            </div>
          </div>

          <p
            className={`text-[13px] font-medium leading-[1.8] h-[4rem] overflow-hidden ${localCompleted ? 'text-gray-700' : 'text-gray-400 opacity-90'}`}
          >
            {description}
          </p>
        </div>

        <div className="px-8 pb-8 pt-6 border-t border-white/5 bg-black/20">
          <div className="flex justify-between items-center">
            {/* 고도화된 자세히 버튼 */}
            <button
              onClick={() =>
                dispatch(openModal({ modalType: 'details', task }))
              }
              className="group/detail flex items-center gap-2.5 text-gray-400 hover:text-white transition-all"
            >
              <div className="p-2 rounded-xl bg-gray-800/50 group-hover/detail:bg-blue-600 transition-all shadow-inner">
                <MdInfoOutline size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover/detail:text-gray-200">
                Details
              </span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleCompleted}
                className={`text-[9px] font-black uppercase tracking-[0.2em] py-2 px-5 rounded-xl transition-all border-2 shadow-inner
                  ${
                    localCompleted
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/0 opacity-100'
                      : 'bg-black/40 text-gray-400 hover:text-white border-transparent hover:border-gray-700'
                  }`}
              >
                {localCompleted ? 'Completed' : 'Incomplete'}
              </button>
              <div className="flex gap-4 text-gray-700 ml-2 group-hover:text-gray-400 transition-colors">
                <button
                  onClick={() =>
                    dispatch(openModal({ modalType: 'update', task }))
                  }
                  className="hover:text-blue-400 transition-all hover:rotate-12"
                  title="Edit"
                >
                  <MdEditDocument size={22} />
                </button>
                <button
                  onClick={handleDelete}
                  className="hover:text-red-500 transition-all hover:scale-110"
                  title="Delete"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
