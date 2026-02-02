import React from 'react';
import { MdEditDocument } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

const Item = ({ task }) => {
  const { _id, title, description, date, iscompleted, isimportant } = task;

  const cutOverText = (text, length, lastDots) => {
    if (length === '' || length === null || length === undefined) {
      // 텍스트 길이(length) : 20으로 지정
      length = 20;
    }

    if (lastDots === '' || lastDots === null || lastDots === undefined) {
      // 텍스트 뒷부분에 붙일 문자열(lastDots) : '...'으로 지정
      lastDots = '...';
    }

    if (text.length > length) {
      // 텍스트 길이가 지정한 길이보다 길면 텍스트를 지정한 길이만큼 자르고 뒷부분에 문자열을 붙인다.
      text = text.substr(0, length) + lastDots;
    }

    return text;
  };
  return (
    <div className="item w-1/3 h-[25vh] p-[0.25rem]">
      <div className="w-full h-full border border-gray-500 rounded-md flex py-3 px-4 flex-col justify-between bg-gray-950">
        <div className="upper">
          <h2 className="text-xl font-normal mb-3 relative pb-2 flex justify-between border-b">
            <span className="font-semibold">{title}</span>
            <span className="text-sm py-1 px-3 border border-gray-500 rounded-sm hover:bg-gray-700 cursor-pointer">
              자세히
            </span>
          </h2>
          <p>{cutOverText(description)}</p>
        </div>
        <div className="lower">
          <p className="text-sm mb-1">{date}</p>
          <div className="item-footer flex justify-between">
            <div className="flex gap-2">
              <button className="block py-1 px-4 bg-green-400 text-sm text-white rounded-md">
                Completed
              </button>
              <button className="block py-1 px-4 bg-red-500 text-sm text-white rounded-md">
                Important
              </button>
            </div>
            <div className="flex gap-2">
              <button>
                <MdEditDocument className="w-5 h-5" />
              </button>
              <button>
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
