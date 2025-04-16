import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

// Async thunk for fetching shines
export const fetchShines = createAsyncThunk('shines/fetchShines', async () => {
  const response = await axios.get(`${getAPIURL()}/getAll/about/shine`);
  return response.data.get_all_shine;
});

// Async thunk for fetching a shine by ID
export const fetchShineById = createAsyncThunk('shines/fetchShineById', async (id) => {
  const response = await axios.get(`${getAPIURL()}/getById/about/shine/${id}`);
  return response.data.shineById; // Return the shine data
});

// Async thunk for deleting a shine
export const deleteShine = createAsyncThunk('shines/deleteShine', async (id) => {
  const response = await axios.delete(`${getAPIURL()}/delete/about/shine/${id}`);
  return { id, message: response.data.message[0].value };
});

// Async thunk for creating a shine
export const createShine = createAsyncThunk('shines/createShine', async (formData) => {
  const response = await axios.post(`${getAPIURL()}/create/about/shine`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.message[0].value; // Return the success message
});

// Async thunk for updating a shine
export const updateShine = createAsyncThunk('shines/updateShine', async ({ id, formData }) => {
  const response = await axios.put(`${getAPIURL()}/update/about/shine/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.message[0].value; // Return the success message
});

// Create the slice
const shineSlice = createSlice({
  name: 'shines',
  initialState: {
    shines: [],
    currentShine: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShines.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShines.fulfilled, (state, action) => {
        state.loading = false;
        state.shines = action.payload;
      })
      .addCase(fetchShines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchShineById.fulfilled, (state, action) => {
        state.currentShine = action.payload; // Store the fetched shine
      })
      .addCase(deleteShine.fulfilled, (state, action) => {
        state.shines = state.shines.filter((shine) => shine._id !== action.payload.id);
      })
      .addCase(createShine.fulfilled, (state, action) => {
        // Optionally, you can handle the success message here
      })
      .addCase(updateShine.fulfilled, (state, action) => {
        // Optionally, you can handle the success message here
      });
  },
});

// Export the actions and reducer
export const { } = shineSlice.actions;
export default shineSlice.reducer;