import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../redux/slices/modalSlice';

const Modal = () => {
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const state = useSelector((state) => state.auth.authData);
  const userKey = state?.sub;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    isCompleted: false,
    isImportant: false,
    userId: userKey,
  });

  const handleChange = () => {};

  return (
    <div className="modal fixed bg-black bg-opacity-50 w-full h-full left-0 top-0 z-50 flex justify-center items-center">
      <div className="form-wrapper bg-gray-700 rounded-md w-1/2 flex flex-col items-center relative p-4">
        <h2 className="text-2xl py-2 border-b border-gray-300 w-fit font-semibold">
          코딩하기
        </h2>
        <form className="w-full" onSubmit="">
          <div className="input-control">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="제목을 입력해주세요..."
              onChange={handleChange}
            />
          </div>
          <div className="input-control">
            <label htmlFor="description">내용</label>
            <textarea
              name="description"
              id="description"
              placeholder="내용을 입력해주세요..."
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="input-control">
            <label htmlFor="date">입력 날짜</label>
            <input type="date" id="date" name="date" onChange={handleChange} />
          </div>
          <div className="input-control toggler">
            <label htmlFor="isCompleted">완료 여부</label>
            <input
              type="checkbox"
              id="isCompleted"
              name="isCompleted"
              onChange={handleChange}
            />
          </div>
          <div className="input-control toggler">
            <label htmlFor="isImportant">중요성 여부</label>
            <input
              type="checkbox"
              id="isImportant"
              name="isImportant"
              onChange={handleChange}
            />
          </div>
          <div className="submit-btn flex justify-end">
            <button
              type="button"
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
