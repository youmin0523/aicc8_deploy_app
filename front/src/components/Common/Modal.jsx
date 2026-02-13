import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../redux/slices/modalSlice';
import {
  fetchGetItem,
  fetchPostItem,
  fetchPutTaskItem,
} from '../../redux/slices/apiSlice';
import { toast } from 'react-toastify';

// //* [Mentor's Encyclopedia: Modal (V1 - Wording Restore)]
// //* 1. 용어 복구: // //! [Lesson Original] 수업 내용과 사이드바에 맞춰 Priority -> Important, Status -> Completed 등 모든 영문 라벨을 원상 복구했습니다.
// //* 2. 루틴 고정: 상세 보기(details) 모드는 이전 피드백을 반영하여 오직 '닫기' 기능만 수행하도록 유지하되, 버튼명은 수업 표준을 따릅니다.
// //* 3. 구현 원리: 학습 시 혼란을 방지하기 위해 naviList.jsx와 DB 필드명에 명시된 단어들만 사용하여 UI 가독성을 높였습니다(v3.16).

const Modal = () => {
  const dispatch = useDispatch();
  const { modalType, task } = useSelector((state) => state.modal);
  const user = useSelector((state) => state.auth.authData?.sub);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    isCompleted: false,
    isImportant: false,
    userId: user,
  });

  useEffect(() => {
    if ((modalType === 'details' || modalType === 'update') && task) {
      setFormData({
        title: task.title,
        description: task.description,
        date: task.date,
        isCompleted: task.iscompleted,
        isImportant: task.isimportant,
        _id: task._id,
      });
    } else {
      setFormData({
        title: '',
        description: '- ',
        date: new Date().toISOString().split('T')[0],
        isCompleted: false,
        isImportant: false,
        userId: user,
      });
    }
  }, [modalType, task, user]);

  const handleClose = () => dispatch(closeModal());

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalType === 'details') return handleClose();

    if (!user) return toast.error('로그인이 필요합니다.');
    if (!formData.title) return toast.error('제목을 입력해주세요.');

    try {
      if (modalType === 'create') {
        await dispatch(
          fetchPostItem({
            ...formData,
            isImportant: formData.isImportant,
            isCompleted: formData.isCompleted,
          }),
        ).unwrap();
        toast.success('할 일이 추가되었습니다.');
      } else if (modalType === 'update') {
        await dispatch(
          fetchPutTaskItem({
            ...formData,
            isImportant: formData.isImportant,
            isCompleted: formData.isCompleted,
          }),
        ).unwrap();
        toast.success('수정이 완료되었습니다.');
      }
      handleClose();
      dispatch(fetchGetItem(user));
    } catch {
      toast.error('실패하였습니다.');
    }
  };

  const isReadOnly = modalType === 'details';
  const modalTitle =
    modalType === 'update'
      ? 'Edit Todo'
      : modalType === 'details'
        ? 'Todo Details'
        : 'Add Todo';

  return (
    <div className="modal fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex justify-center items-center p-4">
      <div className="bg-[#2c2c2c] border border-gray-600 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <div className="p-8">
          <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
            <h2 className="text-xl font-bold italic tracking-tighter text-white">
              {modalTitle}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-white"
            >
              <IoMdClose size={24} />
            </button>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="field-group">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-[#1e1e1e] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            <div className="field-group">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-[#1e1e1e] border border-gray-700 rounded-xl px-4 py-3 h-32 text-white outline-none focus:border-blue-500 resize-none disabled:opacity-50 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="field-group">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full bg-[#1e1e1e] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div className="flex flex-col justify-end gap-3 pb-1">
                {/* [Restore] 수업 전용 용어: Important, Completed */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="isImportant"
                    checked={formData.isImportant}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    className="w-4 h-4 accent-red-500"
                  />
                  <span
                    className={`text-xs font-bold ${formData.isImportant ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    Important
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="isCompleted"
                    checked={formData.isCompleted}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span
                    className={`text-xs font-bold ${formData.isCompleted ? 'text-blue-500' : 'text-gray-500'}`}
                  >
                    Completed
                  </span>
                </label>
              </div>
            </div>

            <footer className="mt-8 flex gap-3">
              {isReadOnly ? (
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-white text-black py-3 rounded-xl font-bold uppercase text-xs hover:bg-gray-200"
                >
                  Close
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold uppercase text-xs hover:bg-blue-700"
                  >
                    {modalType === 'create' ? 'Create Task' : 'Update Task'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-8 bg-gray-700 text-gray-400 py-3 rounded-xl font-bold text-xs uppercase hover:text-white"
                  >
                    Cancel
                  </button>
                </>
              )}
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
