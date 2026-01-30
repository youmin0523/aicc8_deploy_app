import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import modalReducer from './slices/modalSlice';

const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
    modal: modalReducer,
  }),
});

export default store;
