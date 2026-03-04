import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import problemService from './problemService';

const initialState = {
    problems: [],
    stats: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getProblems = createAsyncThunk(
    'problems/getAll',
    async (filters, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await problemService.getProblems(token, filters);
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createProblem = createAsyncThunk(
    'problems/create',
    async (problemData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await problemService.createProblem(problemData, token);
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to create';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateProblem = createAsyncThunk(
    'problems/update',
    async ({ id, problemData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await problemService.updateProblem(id, problemData, token);
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteProblem = createAsyncThunk(
    'problems/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            await problemService.deleteProblem(id, token);
            return id;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getStats = createAsyncThunk(
    'problems/stats',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await problemService.getStats(token);
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to get stats';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const problemSlice = createSlice({
    name: 'problems',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Get problems
            .addCase(getProblems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProblems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.problems = action.payload;
            })
            .addCase(getProblems.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create
            .addCase(createProblem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProblem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.problems.unshift(action.payload);
            })
            .addCase(createProblem.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update
            .addCase(updateProblem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const idx = state.problems.findIndex(
                    (p) => p._id === action.payload._id
                );
                if (idx !== -1) state.problems[idx] = action.payload;
            })
            .addCase(updateProblem.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete
            .addCase(deleteProblem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.problems = state.problems.filter((p) => p._id !== action.payload);
            })
            .addCase(deleteProblem.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Stats
            .addCase(getStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
            })
            .addCase(getStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = problemSlice.actions;
export default problemSlice.reducer;
