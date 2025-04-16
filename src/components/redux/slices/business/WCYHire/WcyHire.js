import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

export const fetchWCYHires = createAsyncThunk('wcyHire/fetchWCYHires', async () => {
    const response = await axios.get(`${getAPIURL()}/getAll/business/why-can-you`); // Adjust the API endpoint as needed
    return response.data.get_all_wcy_hire;
});

export const fetchWCYHireById = createAsyncThunk('wcyHire/fetchWCYHireById', async (id) => {
    const response = await axios.get(`${getAPIURL()}/getById/business/why-can-you/${id}`);
    return response.data.wcyHireById; 
});

export const deleteWCYHire = createAsyncThunk('wcyHire/deleteWCYHire', async (id) => {
    const response = await axios.delete(`${getAPIURL()}/delete/business/why-can-you/${id}`);
    return { id, message: response.data.message[0].value };
});

export const createWCYHire = createAsyncThunk('wcyHire/createWCYHire', async (formData) => {
    const response = await axios.post(`${getAPIURL()}/create/business/why-can-you`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.message[0].value; 
});

export const updateWCYHire = createAsyncThunk('wcyHire/updateWCYHire', async ({ id, formData }) => {
    const response = await axios.put(`${getAPIURL()}/update/business/why-can-you/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.message[0].value; 
});

// Create the slice
const wcyHireSlice = createSlice({
    name: 'wcyHire',
    initialState: {
        wcyHires: [],
        currentWCYHire: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWCYHires.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWCYHires.fulfilled, (state, action) => {
                state.loading = false;
                state.wcyHires = action.payload;
            })
            .addCase(fetchWCYHires.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchWCYHireById.fulfilled, (state, action) => {
                state.currentWCYHire = action.payload; // Store the fetched WCYHire
            })
            .addCase(deleteWCYHire.fulfilled, (state, action) => {
                state.wcyHires = state.wcyHires.filter((wcyHire) => wcyHire._id !== action.payload.id);
            })
            .addCase(createWCYHire.fulfilled, (state, action) => {
                // Optionally, you can handle the success message here
            })
            .addCase(updateWCYHire.fulfilled, (state, action) => {
                // Optionally, you can handle the success message here
            });
    },
});

// Export the actions and reducer
export const { } = wcyHireSlice.actions;
export default wcyHireSlice.reducer;