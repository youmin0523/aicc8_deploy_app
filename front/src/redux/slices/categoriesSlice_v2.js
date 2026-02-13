import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  GET_CATEGORIES_API_URL,
  POST_CATEGORY_API_URL,
  UPDATE_CATEGORY_API_URL,
  DELETE_CATEGORY_API_URL,
} from '../../utils/apiUrls_v2';
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from '../../utils/requests';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (userId, { rejectWithValue }) => {
    try {
      return await getRequest(`${GET_CATEGORIES_API_URL}/${userId}`);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchPostCategory = createAsyncThunk(
  'categories/fetchPostCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      return await postRequest(POST_CATEGORY_API_URL, {
        body: JSON.stringify(categoryData),
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const categoriesSliceV2 = createSlice({
  name: 'categoriesV2',
  initialState: {
    categories: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload?.msg || action.error.message;
      });
  },
});

export default categoriesSliceV2.reducer;
