import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
  }),
});

export default store;
