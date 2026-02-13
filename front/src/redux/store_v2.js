import { configureStore } from '@reduxjs/toolkit';
import tasksV2Reducer from './slices/tasksSlice_v2';
import categoriesV2Reducer from './slices/categoriesSlice_v2';
import authV2Reducer from './slices/authSlice_v2';
import modalV2Reducer from './slices/modalSlice_v2';

const storeV2 = configureStore({
  reducer: {
    tasksV2: tasksV2Reducer,
    categoriesV2: categoriesV2Reducer,
    authV2: authV2Reducer,
    modalV2: modalV2Reducer,
  },
});

export default storeV2;
