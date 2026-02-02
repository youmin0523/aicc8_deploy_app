import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { POST_TASK_API_URL } from '../../utils/apiUrls';

import { postRequest } from '../../utils/requests';

// 공통된 비동기 액션 생성 로직을 별도의 함수로 분리
const postItemFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (postData) => {
    // console.log(postData);
    const options = {
      body: JSON.stringify(postData),
    };

    return await postRequest(apiURL, options);
  });
};

// Post Item Data Fetch
export const fetchPostItem = postItemFetchThunk(
  'fetchPostItem',
  POST_TASK_API_URL,
);

const handleFulfilled = (stateKey) => (state, action) => {
  state[stateKey] = action.payload;
};

const handleRejected = (action) => {
  console.log('Error', action.payload);
};

const apisSlice = createSlice({
  name: 'api',
  initialState: {
    postItemData: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostItem.fulfilled, handleFulfilled('postItemData'))
      .addCase(fetchPostItem.rejected, handleRejected);
  },
});

export default apisSlice.reducer;
