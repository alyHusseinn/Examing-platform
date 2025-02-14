import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exam, ExamAttempt } from '../../types';

interface ExamState {
  currentExam: Exam | null;
  attempts: ExamAttempt[];
  loading: boolean;
  error: string | null;
}

const initialState: ExamState = {
  currentExam: null,
  attempts: [],
  loading: false,
  error: null,
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setCurrentExam: (state, action: PayloadAction<Exam>) => {
      state.currentExam = action.payload;
    },
    addAttempt: (state, action: PayloadAction<ExamAttempt>) => {
      state.attempts.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCurrentExam, addAttempt, setLoading, setError } = examSlice.actions;
export default examSlice.reducer;