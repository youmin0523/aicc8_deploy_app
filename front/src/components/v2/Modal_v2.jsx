import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalV2, openModalV2 } from '../../redux/slices/modalSlice_v2';
import {
  fetchGetItemV2,
  fetchPostItemV2,
  fetchPutTaskItemV2,
} from '../../redux/slices/tasksSlice_v2';
import { fetchCategories } from '../../redux/slices/categoriesSlice_v2';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import './Modal_v2.css';

// //* [Mentor's Encyclopedia: ModalV2 (Restore)]
// //* 1. 데이터 소스: 'tasksV2' (일정), 'categoriesV2' (슬라이스 명칭 복구).
// //* 2. 기능 복구: 타임존 버그 해결을 위해 parseISO/format 로직을 유지하면서, 잘못된 슬라이스 경로를 수정했습니다.
// //* 3. UI 복구: V2 전용 폼 레이아웃, 상태 버튼 디자인, 네온 이펙트 풋터를 다시 활성화했습니다.

const ModalV2 = () => {
  const dispatch = useDispatch();

  // //* [Bug Fix] state.categories -> state.categoriesV2 로 슬라이스 경로 복구
  const { modalType, task } = useSelector((state) => state.modalV2);
  const user = useSelector((state) => state.auth.authData?.sub);
  const { categories } = useSelector((state) => state.categoriesV2);

  const [formData, setFormData] = useState({
    title: '',
    description: '- ',
    due_date: '',
    due_time: '12:00',
    isCompleted: false,
    isImportant: false,
    categoryId: '',
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialized) {
      if ((modalType === 'edit' || modalType === 'details') && task) {
        const localDate = parseISO(task.due_date);
        setFormData({
          _id: task._id,
          title: task.title,
          description: task.description,
          due_date: format(localDate, 'yyyy-MM-dd'),
          due_time: format(localDate, 'HH:mm'),
          isCompleted: task.iscompleted,
          isImportant: task.isimportant,
          categoryId: task.categoryid || '',
        });
      } else if (modalType === 'create') {
        setFormData((prev) => ({
          ...prev,
          due_date: format(new Date(), 'yyyy-MM-dd'),
          userId: user,
        }));
      }
      setIsInitialized(true);
    }
  }, [modalType, task, isInitialized, user]);

  const handleClose = () => {
    setIsInitialized(false);
    dispatch(closeModalV2());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.error('제목을 입력해주세요.');

    const combinedDateTime = `${formData.due_date}T${formData.due_time}:00`;
    const submitData = {
      ...formData,
      due_date: combinedDateTime,
      userId: user,
      categoryId: formData.categoryId || null,
    };

    try {
      if (modalType === 'create') {
        await dispatch(fetchPostItemV2(submitData)).unwrap();
      } else if (modalType === 'edit') {
        await dispatch(fetchPutTaskItemV2(submitData)).unwrap();
      }
      handleClose();
      dispatch(fetchGetItemV2(user));
    } catch {
      toast.error('처리 실패');
    }
  };

  const isReadOnly = modalType === 'details';

  return (
    <div
      className="v2-modal-overlay flex items-center justify-center fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
      onClick={handleClose}
    >
      <div
        className="v2-modal-content bg-[#121212] border border-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-8">
          <header className="flex justify-between items-center mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 py-1 px-3 bg-blue-500/10 rounded-full border border-blue-500/20">
              V2 {modalType} Mode
            </span>
            <button
              type="button"
              className="text-gray-500 hover:text-white text-3xl"
              onClick={handleClose}
            >
              &times;
            </button>
          </header>

          <div className="space-y-8">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Task Title..."
              className="w-full bg-transparent text-4xl font-black border-none focus:outline-none placeholder:text-gray-800"
              readOnly={isReadOnly}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black text-gray-600">
                  Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  className="bg-[#1a1a1a] border border-gray-800 p-3 rounded-xl text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black text-gray-600">
                  Time
                </label>
                <input
                  type="time"
                  name="due_time"
                  value={formData.due_time}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  className="bg-[#1a1a1a] border border-gray-800 p-3 rounded-xl text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black text-gray-600">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="bg-[#1a1a1a] border border-gray-800 p-3 rounded-xl text-sm outline-none"
                >
                  <option value="">No Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-black text-gray-600">
                Notes
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Details..."
                readOnly={isReadOnly}
                className="bg-[#1a1a1a] border border-gray-800 p-4 rounded-xl min-h-[120px] text-sm resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  !isReadOnly &&
                  setFormData((p) => ({ ...p, isImportant: !p.isImportant }))
                }
                className={`flex-1 py-4 rounded-2xl border transition-all font-bold text-xs uppercase ${formData.isImportant ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-gray-800/30 border-gray-800 text-gray-600'}`}
              >
                ★ Important
              </button>
              <button
                type="button"
                onClick={() =>
                  !isReadOnly &&
                  setFormData((p) => ({ ...p, isCompleted: !p.isCompleted }))
                }
                className={`flex-1 py-4 rounded-2xl border transition-all font-bold text-xs uppercase ${formData.isCompleted ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-gray-800/30 border-gray-800 text-gray-600'}`}
              >
                ✔ Completed
              </button>
            </div>
          </div>

          <footer className="flex gap-3 mt-12 pt-6 border-t border-gray-800/50">
            {!isReadOnly ? (
              <button
                type="submit"
                className="flex-1 py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                Save Task
              </button>
            ) : (
              <button
                type="button"
                className="flex-1 py-4 rounded-xl bg-blue-600 text-white font-black uppercase tracking-widest"
                onClick={() =>
                  dispatch(openModalV2({ modalType: 'edit', task }))
                }
              >
                Edit Now
              </button>
            )}
            <button
              type="button"
              className="px-8 rounded-xl bg-gray-900 text-gray-400 font-bold"
              onClick={handleClose}
            >
              Cancel
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ModalV2;
