import { createSlice } from '@reduxjs/toolkit';

// initialState : 초기값 세팅
const initialState = {
  isOpen: false,
  isSidebarOpen: false, // [Added] 모바일 사이드바 오픈 상태
  modalType: 'create',
  task: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.task = action.payload.task;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { openModal, closeModal, toggleSidebar, setSidebar } =
  modalSlice.actions;
export default modalSlice.reducer;
