import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../redux/slices/modalSlice';
import { fetchPostItem } from '../../redux/slices/apiSlice';
import { toast } from 'react-toastify';

const Modal = () => {
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const state = useSelector((state) => state.auth.authData);
  const user = state?.sub;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    isCompleted: false,
    isImportant: false,
    userId: user,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // console.log(name, value, type, checked);
    // console.log(e.target.checked);
    setFormData((prev) => ({
      ...prev,
      // input의 타입이 checked일 경우, checked의 값으로 업데이트, 아니면 value의 값으로 업데이트
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 기능 차단

    if (!user) {
      toast.error('잘못된 사용자 입니다.');
      return;
    }

    if (!formData.title) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (!formData.description) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    if (!formData.date) {
      toast.error('날짜를 입력해주세요.');
      return;
    }

    // console.log(formData);
    try {
      await dispatch(fetchPostItem(formData)).unwrap(); // async-await을 사용할 때는 unwrap()을 사용하는 것이 좋다.
      toast.success('할일이 추가되었습니다.');
    } catch (error) {
      console.log('Error Post Item Data:  ', error);
      toast.error('할일 추가에 실패했습니다. 콘솔을 확인해주세요');
    }

    handleCloseModal();
  };

  return (
    <div className="modal fixed bg-black bg-opacity-50 w-full h-full left-0 top-0 z-50 flex justify-center items-center">
      <div className="form-wrapper bg-gray-700 rounded-md w-1/2 flex flex-col items-center relative p-4">
        <h2 className="text-2xl py-2 border-b border-gray-300 w-fit font-semibold">
          Add Todo
        </h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="input-control">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              placeholder="제목을 입력해주세요..."
              onChange={handleChange}
            />
          </div>
          <div className="input-control">
            <label htmlFor="description">내용</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              placeholder="내용을 입력해주세요..."
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="input-control">
            <label htmlFor="date">입력 날짜</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              name="date"
              onChange={handleChange}
            />
          </div>
          <div className="input-control toggler">
            <label htmlFor="isCompleted">완료 여부</label>
            <input
              type="checkbox"
              id="isCompleted"
              checked={formData.isCompleted}
              name="isCompleted"
              onChange={handleChange}
            />
          </div>
          <div className="input-control toggler">
            <label htmlFor="isImportant">중요성 여부</label>
            <input
              type="checkbox"
              id="isImportant"
              checked={formData.isImportant}
              name="isImportant"
              onChange={handleChange}
            />
          </div>
          <div className="submit-btn flex justify-end">
            <button
              type="submit"
              className="flex justify-end bg-black py-3 px-6 rounded-md hover:bg-slate-900"
            >
              할일 추가하기
            </button>
          </div>
        </form>
        <IoMdClose
          className="absolute right-10 top-10 cursor-pointer"
          onClick={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Modal;
