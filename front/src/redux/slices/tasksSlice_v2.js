import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  POST_TASK_V2_API_URL,
  GET_TASKS_V2_API_URL,
  UPDATE_COMPLETED_TASK_V2_API_URL,
  DELETE_TASK_V2_API_URL,
  UPDATE_TASK_V2_API_URL,
  GET_TASK_HISTORY_V2_API_URL,
} from '../../utils/apiUrls_v2';

import {
  postRequest,
  getRequest,
  patchRequest,
  deleteRequest,
  putRequest,
} from '../../utils/requests';

// 공통 비동기 로직 (rejectWithValue 적용)
const postItemThunk = (type, url) =>
  createAsyncThunk(type, async (data, { rejectWithValue }) => {
    try {
      return await postRequest(url, { body: JSON.stringify(data) });
    } catch (error) {
      return rejectWithValue(error);
    }
  });

const getItemThunk = (type, url) =>
  createAsyncThunk(type, async (uid, { rejectWithValue }) => {
    try {
      return await getRequest(`${url}/${uid}`);
    } catch (error) {
      return rejectWithValue(error);
    }
  });

const patchItemThunk = (type, url) =>
  createAsyncThunk(type, async (data, { rejectWithValue }) => {
    try {
      return await patchRequest(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  });

const deleteItemThunk = (type, url) =>
  createAsyncThunk(type, async (id, { rejectWithValue }) => {
    try {
      return await deleteRequest(`${url}/${id}`, { method: 'DELETE' });
    } catch (error) {
      return rejectWithValue(error);
    }
  });

const putItemThunk = (type, url) =>
  createAsyncThunk(type, async (data, { rejectWithValue }) => {
    try {
      return await putRequest(url, { body: JSON.stringify(data) });
    } catch (error) {
      return rejectWithValue(error);
    }
  });

// Thunks
export const fetchGetItemV2 = getItemThunk(
  'apiV2/fetchGetItem',
  GET_TASKS_V2_API_URL,
);
export const fetchPostItemV2 = postItemThunk(
  'apiV2/fetchPostItem',
  POST_TASK_V2_API_URL,
);
export const fetchUpdateCompletedV2 = patchItemThunk(
  'apiV2/fetchUpdateCompleted',
  UPDATE_COMPLETED_TASK_V2_API_URL,
);
export const fetchDeleteItemV2 = deleteItemThunk(
  'apiV2/fetchDeleteItem',
  DELETE_TASK_V2_API_URL,
);
export const fetchPutTaskItemV2 = putItemThunk(
  'apiV2/fetchPutTaskItem',
  UPDATE_TASK_V2_API_URL,
);
export const fetchGetTaskHistoryV2 = getItemThunk(
  'apiV2/fetchGetTaskHistory',
  GET_TASK_HISTORY_V2_API_URL,
);

const tasksSliceV2 = createSlice({
  name: 'tasksV2',
  initialState: {
    tasks: [],
    taskHistory: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetItemV2.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchGetItemV2.rejected, (state, action) => {
        state.error = action.payload?.msg || action.error.message;
      })
      .addCase(fetchGetTaskHistoryV2.fulfilled, (state, action) => {
        state.taskHistory = action.payload;
      });
  },
});

export default tasksSliceV2.reducer;
