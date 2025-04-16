import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils'; // Adjust the import path as necessary

// Async thunk to create a new college
export const createCollege = createAsyncThunk(
  'college/create',
  async (formData) => {
    try {
      const response = await axios.post(`${getAPIURL()}/create/degreeprogram/college`, formData);
      return response.data; // Adjust based on your API response structure
    } catch (error) {
      throw new Error(error.response.data.message || 'Failed to create college');
    }
  }
);

// Async thunk to get all colleges
export const getAllColleges = createAsyncThunk(
  'college/getAll',
  async () => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/degreeprogram/college`);
      return response.data.colleges; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to get a college by ID
export const getCollegeById = createAsyncThunk(
  'college/getById',
  async (id) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getById/degreeprogram/college/${id}`);
      return response.data.college; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to update a college
export const updateCollege = createAsyncThunk(
  'college/update',
  async ({ id, formData }) => {
    try {
      const response = await axios.put(`${getAPIURL()}/update/degreeprogram/college/${id}`, formData);
      return response.data.college; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to delete a college
export const deleteCollege = createAsyncThunk(
  'college/delete',
  async (id) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/degreeprogram/college/${id}`);
      return id; // Return the ID of the deleted college
    } catch (error) {
      throw error;
    }
  }
);

// Initial state for the slice
const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  colleges: [],
  selectedCollege: null,
};

// Create the slice
const collegeSlice = createSlice({
  name: 'college',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCollege.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCollege.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "College created successfully";
        state.colleges.push(action.payload.newCollege); // Add the new college to the list
      })
      .addCase(createCollege.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create college";
      })
      .addCase(getAllColleges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllColleges.fulfilled, (state, action) => {
        state.loading = false;
        state.colleges = action.payload;
      })
      .addCase(getAllColleges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getCollegeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCollegeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCollege = action.payload;
      })
      .addCase(getCollegeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCollege.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCollege.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.colleges.findIndex(college => college._id === action.payload._id);
        if (index !== -1) {
          state.colleges[index] = action.payload; // Update the college in the list
        }
      })
      .addCase(updateCollege.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCollege.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCollege.fulfilled, (state, action) => {
        state.loading = false;
        state.colleges = state.colleges.filter(college => college._id !== action.payload); // Remove the deleted college
      })
      .addCase(deleteCollege.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default collegeSlice.reducer;