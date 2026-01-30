import React from 'react';

const ItemPanel = () => {
  return (
    <div className="panel bg-[#212121] w-4/5 h-full rounded-md border border-gray-500 py-5 px-4 overflow-y-auto">
      <div className="login-message w-full h-full flex items-center justify-center">
        <button className="flex justify-center items-center gap-2 bg-gray-300 text-gray-900 py-2 px-4 rounded-md">
          <span className="text-sm font-semibold">
            로그인이 필요한 서비스입니다.
          </span>
        </button>
      </div>
    </div>
  );
};

export default ItemPanel;
