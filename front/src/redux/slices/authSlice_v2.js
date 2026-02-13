import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authData: JSON.parse(localStorage.getItem('authData_v2')) || null,
};

const authSliceV2 = createSlice({
  name: 'authV2',
  initialState,
  reducers: {
    loginV2: (state, action) => {
      state.authData = action.payload.authData;
      localStorage.setItem(
        'authData_v2',
        JSON.stringify(action.payload.authData),
      );
    },
    logoutV2: (state) => {
      state.authData = null;
      localStorage.removeItem('authData_v2');
    },
  },
});

export const { loginV2, logoutV2 } = authSliceV2.actions;
export default authSliceV2.reducer;
