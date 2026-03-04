import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import problemReducer from '../features/problems/problemSlice';
import aiReducer from '../features/ai/aiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        problems: problemReducer,
        ai: aiReducer,
    },
});
