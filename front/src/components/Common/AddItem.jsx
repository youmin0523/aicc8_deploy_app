import React from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';

const AddItem = () => {
  return (
    <div className="add-card item w-1/3 h-[25vh] p-[0.25rem]">
      <div className="w-full h-full border border-gray-500 rounded-md flex py-3 items-center justify-center">
        <button>
          <IoAddCircleOutline />
          <span>할 일 추가하기</span>
        </button>
      </div>
    </div>
  );
};

export default AddItem;
