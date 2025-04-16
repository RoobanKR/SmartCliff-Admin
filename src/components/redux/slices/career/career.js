import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../utils/utils';

export const fetchAllCareers = createAsyncThunk('career/fetchAllCareers', async () => {
    const response = await axios.get(`${getAPIURL()}/getAll/career`);
    return response.data.careers;
});

export const fetchCareerById = createAsyncThunk('career/fetchCareerById', async (id) => {
    const response = await axios.get(`${getAPIURL()}/getById/career/${id}`);
    return response.data.career; 
});

export const deleteCareer = createAsyncThunk('career/deleteCareer', async (id) => {
    const response = await axios.delete(`${getAPIURL()}/delete/career/${id}`);
    return { id, message: response.data.message[0].value };
});

export const createCareer = createAsyncThunk('career/createCareer', async (formData) => {
    const response = await axios.post(`${getAPIURL()}/create/career`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.message[0].value; 
});

export const updateCareer = createAsyncThunk('career/updateCareer', async ({ id, formData }) => {
    const response = await axios.put(`${getAPIURL()}/update/career/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.message[0].value; 
});

const careerSlice = createSlice({
    name: 'career',
    initialState: {
        careers: [],
        currentCareer: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCareers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllCareers.fulfilled, (state, action) => {
                state.loading = false;
                state.careers = action.payload;
            })
            .addCase(fetchAllCareers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCareerById.fulfilled, (state, action) => {
                state.currentCareer = action.payload;
            })
            .addCase(deleteCareer.fulfilled, (state, action) => {
                state.careers = state.careers.filter((career) => career._id !== action.payload.id);
            })
            .addCase(createCareer.fulfilled, (state, action) => {
            })
            .addCase(updateCareer.fulfilled, (state, action) => {
            });
    },
});

// Export the actions and reducer
export const { } = careerSlice.actions;
export default careerSlice.reducer;