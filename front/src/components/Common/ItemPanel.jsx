import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from './PageTitle';
import AddItem from './AddItem';
import Modal from './Modal';
import Item from './Item';
import { fetchGetItem } from '../../redux/slices/apiSlice';

const ItemPanel = ({ pageTitle }) => {
  const dispatch = useDispatch();

  // Auth Data
  const state = useSelector((state) => state.auth.authData);
  // console.log(state);
  const userKey = state?.sub;
  // console.log(userKey);

  const isOpen = useSelector((state) => state.modal.isOpen);
  // console.log(isOpen);

  // Get Item Data
  const getTasksData = useSelector((state) => state.api.getItemData);
  console.log(getTasksData);

  useEffect(() => {
    if (!userKey) return;

    const fetchGetItemsData = async () => {
      try {
        await dispatch(fetchGetItem(userKey)).unwrap();
      } catch (error) {
        console.log('Failed to fetch Items: ', error);
      }
    };
    fetchGetItemsData();
  }, [dispatch, userKey]);

  return (
    <div className="panel bg-[#212121] w-4/5 h-full rounded-md border border-gray-500 py-5 px-4 overflow-y-auto">
      {userKey ? (
        <div className="w-full h-full">
          {isOpen && <Modal />}
          <PageTitle title={pageTitle} />
          <div className="flex flex-wrap">
            {getTasksData?.map((task, idx) => (
              <Item key={idx} task={task} />
            ))}

            <AddItem />
          </div>
        </div>
      ) : (
        <div className="login-message w-full h-full flex items-center justify-center">
          <button className="flex justify-center items-center gap-2 bg-gray-300 text-gray-900 py-2 px-4 rounded-md">
            <span className="text-sm font-semibold">
              로그인이 필요한 서비스입니다.
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemPanel;
