import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from './aiService';

const initialState = {
    feedback: null,
    isLoading: false,
    isError: false,
    message: '',
};

export const reviewCode = createAsyncThunk(
    'ai/review',
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await aiService.reviewCode(data, token);
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Review failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        resetAi: (state) => {
            state.feedback = null;
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(reviewCode.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.feedback = null;
            })
            .addCase(reviewCode.fulfilled, (state, action) => {
                state.isLoading = false;
                state.feedback = action.payload.feedback;
            })
            .addCase(reviewCode.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetAi } = aiSlice.actions;
export default aiSlice.reducer;
