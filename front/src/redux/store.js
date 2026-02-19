import { configureStore } from '@reduxjs/toolkit';
// V1 Reducers
import authReducer from './slices/authSlice';
import modalReducer from './slices/modalSlice';
import apiReducer from './slices/apiSlice';

// V2 Reducers
import tasksV2Reducer from './slices/tasksSlice_v2';
import categoriesV2Reducer from './slices/categoriesSlice_v2';
import authV2Reducer from './slices/authSlice_v2';
import modalV2Reducer from './slices/modalSlice_v2';
import privateCalendarReducer from './slices/privateCalendarSlice';

const store = configureStore({
  reducer: {
    // V1 States
    auth: authReducer,
    modal: modalReducer,
    api: apiReducer,

    // V2 States
    tasksV2: tasksV2Reducer,
    categoriesV2: categoriesV2Reducer,
    authV2: authV2Reducer,
    modalV2: modalV2Reducer,
    privateCalendar: privateCalendarReducer,
  },
});

export default store;
