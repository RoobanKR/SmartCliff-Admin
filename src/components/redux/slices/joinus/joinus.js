import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../utils/utils";


// Async Thunks
export const fetchJobPositions = createAsyncThunk("joinUs/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${getAPIURL()}/getAll/joinus`);
        return response.data.All_joinus;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error fetching job positions");
    }
});

export const fetchJobPositionById = createAsyncThunk("joinUs/fetchById", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${getAPIURL()}/getById/joinus/${id}`);
        return response.data.joinUsGetById;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error fetching job position");
    }
});

export const createJobPosition = createAsyncThunk("joinUs/create", async (jobData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${getAPIURL()}/create/joinus`, jobData,
    
    );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error creating job position");
    }
});

export const updateJobPosition = createAsyncThunk("joinUs/update", async ({ id, jobData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${getAPIURL()}/update/joinus/${id}`, jobData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error updating job position");
    }
});

export const deleteJobPosition = createAsyncThunk("joinUs/delete", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${getAPIURL()}/delete/joinus/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error deleting job position");
    }
});

export const updateSelectedJobPosition = createAsyncThunk("joinUs/updateSelected", async ({ id, selected }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${getAPIURL()}/change/selected/${id}`, { selected });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error updating selected job position");
    }
});

// Slice
const joinUsSlice = createSlice({
    name: "joinUs",
    initialState: {
        jobPositions: [],
        selectedJob: null,
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobPositions.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchJobPositions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.jobPositions = action.payload;
            })
            .addCase(fetchJobPositions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(fetchJobPositionById.fulfilled, (state, action) => {
                state.selectedJob = action.payload;
            })
            .addCase(createJobPosition.fulfilled, (state, action) => {
                state.jobPositions.push(action.payload);
            })
            .addCase(updateJobPosition.fulfilled, (state, action) => {
                const index = state.jobPositions.findIndex((job) => job._id === action.payload._id);
                if (index !== -1) state.jobPositions[index] = action.payload;
            })
            .addCase(deleteJobPosition.fulfilled, (state, action) => {
                state.jobPositions = state.jobPositions.filter((job) => job._id !== action.payload);
            })
            .addCase(updateSelectedJobPosition.fulfilled, (state, action) => {
                state.jobPositions = state.jobPositions.map((job) => ({
                    ...job,
                    selected: job._id === action.payload._id ? action.payload.selected : false,
                }));
            });
    },
});

export default joinUsSlice.reducer;
