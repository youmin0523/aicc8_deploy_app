import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  modalType: 'create', // create, details, edit, category
  task: null,
};

const modalSliceV2 = createSlice({
  name: 'modalV2',
  initialState,
  reducers: {
    openModalV2: (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.task = action.payload.task;
    },
    closeModalV2: (state) => {
      state.isOpen = false;
      state.task = null;
    },
  },
});

export const { openModalV2, closeModalV2 } = modalSliceV2.actions;
export default modalSliceV2.reducer;
