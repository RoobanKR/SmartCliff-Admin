
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

export const createCurrentAvailability = createAsyncThunk(
  'currentAvailability/create',
  async (formData) => {
    try {
      const response = await axios.post(`${getAPIURL()}/create/business/current-availability`, formData);
      return response.data; // Adjust based on your API response structure
    } catch (error) {
      throw new Error(error.response.data.message || 'Failed to create current availability');
    }
  }
);

export const getAllCurrentAvailabilities = createAsyncThunk(
  'currentAvailability/getAll',
  async () => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/business/current-availability`);
      return response.data.availabilities; 
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to get a current availability by ID
export const getCurrentAvailabilityById = createAsyncThunk(
  'currentAvailability/getById',
  async (id) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getById/business/current-availability/${id}`);
      return response.data.availability;
    } catch (error) {
      throw error;
    }
  }
);

export const updateCurrentAvailability = createAsyncThunk(
  'currentAvailability/update',
  async ({ id, formData }) => {
    try {
      const response = await axios.put(`${getAPIURL()}/update/business/current-availability/${id}`, formData);
      return response.data.availability; 
    } catch (error) {
      throw error; 
    }
  }
);
export const deleteCurrentAvailability = createAsyncThunk(
  'currentAvailability/delete',
  async (id) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/business/current-availability/${id}`);
      return id; 
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  availabilities: [],
  selectedAvailability: null,
};

const currentAvailabilitySlice = createSlice({
  name: 'currentAvailability',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCurrentAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCurrentAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Current availability created successfully";
        state.availabilities.push(action.payload.newAvailability); // Add the new availability to the list
      })
      .addCase(createCurrentAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create current availability";
      })
      .addCase(getAllCurrentAvailabilities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCurrentAvailabilities.fulfilled, (state, action) => {
        state.loading = false;
        state.availabilities = action.payload;
      })
      .addCase(getAllCurrentAvailabilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getCurrentAvailabilityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentAvailabilityById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAvailability = action.payload;
      })
      .addCase(getCurrentAvailabilityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCurrentAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurrentAvailability.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.availabilities.findIndex(availability => availability._id === action.payload._id);
        if (index !== -1) {
          state.availabilities[index] = action.payload; // Update the existing availability
        }
      })
      .addCase(updateCurrentAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(deleteCurrentAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCurrentAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availabilities = state.availabilities.filter(availability => availability._id !== action.payload); // Remove the deleted availability
      })
      .addCase(deleteCurrentAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default currentAvailabilitySlice.reducer;