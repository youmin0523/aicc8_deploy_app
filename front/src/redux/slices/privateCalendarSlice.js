import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api/v2/private';

// --- Thunks ---

// 특정 날짜 다이어리 조회
export const fetchDiaryThunk = createAsyncThunk(
  'private/fetchDiary',
  async ({ userId, date }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/diary?userId=${userId}&date=${date}`,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// 다이어리 저장
export const saveDiaryThunk = createAsyncThunk(
  'private/saveDiary',
  async (diaryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/diary`, diaryData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// 습관 목록 조회
export const fetchHabitsThunk = createAsyncThunk(
  'private/fetchHabits',
  async ({ userId, date }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/habits?userId=${userId}&date=${date}`,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// 습관 체크 토글
export const toggleHabitCheckThunk = createAsyncThunk(
  'private/toggleHabitCheck',
  async (checkData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/habits/toggle`,
        checkData,
      );
      return { ...checkData, ...response.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// 신규 습관 등록
export const addHabitThunk = createAsyncThunk(
  'private/addHabit',
  async (habitData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/habits`, habitData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// 일정 목록 조회
export const fetchSchedulesThunk = createAsyncThunk(
  'private/fetchSchedules',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/schedules?userId=${userId}`,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// 일정 등록
export const addScheduleThunk = createAsyncThunk(
  'private/addSchedule',
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/schedules`,
        scheduleData,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// 모든 다이어리 목록 조회 (마킹용)
export const fetchAllDiariesThunk = createAsyncThunk(
  'private/fetchAllDiaries',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/diaries/all?userId=${userId}`,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// 모든 습관 로그 조회 (마킹용)
export const fetchAllHabitLogsThunk = createAsyncThunk(
  'private/fetchAllHabitLogs',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/habits/logs/all?userId=${userId}`,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

const privateCalendarSlice = createSlice({
  name: 'privateCalendar',
  initialState: {
    currentDiary: null,
    allDiaries: [], // 마크용 전체 일기 데이터
    habits: [],
    allHabitLogs: [], // 마크용 전체 습관 로그 데이터
    schedules: [],
    loading: false,
    error: null,
    selectedDate: new Date().toISOString().split('T')[0], // 기본 오늘 날짜
  },
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Diary
      .addCase(fetchDiaryThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiaryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDiary = action.payload;
      })
      .addCase(fetchDiaryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Habits
      .addCase(fetchHabitsThunk.fulfilled, (state, action) => {
        state.habits = action.payload;
      })
      .addCase(toggleHabitCheckThunk.fulfilled, (state, action) => {
        const { habitId, isCompleted } = action.payload;
        const habit = state.habits.find((h) => h._id === habitId);
        if (habit) {
          habit.is_completed = isCompleted;
        }
      })
      // Schedules
      .addCase(fetchSchedulesThunk.fulfilled, (state, action) => {
        state.schedules = action.payload;
      })
      // All Diaries (Marking)
      .addCase(fetchAllDiariesThunk.fulfilled, (state, action) => {
        state.allDiaries = action.payload;
      })
      // All Habit Logs (Marking)
      .addCase(fetchAllHabitLogsThunk.fulfilled, (state, action) => {
        state.allHabitLogs = action.payload;
      });
  },
});

export const { setSelectedDate } = privateCalendarSlice.actions;
export default privateCalendarSlice.reducer;
