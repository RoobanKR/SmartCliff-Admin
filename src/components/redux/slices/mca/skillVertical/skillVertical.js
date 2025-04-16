import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils'; // Adjust the import path as necessary

// Async thunk to create a new skill vertical
export const createSkillVertical = createAsyncThunk(
  'skillVertical/create',
  async (formData) => {
    try {
      const response = await axios.post(`${getAPIURL()}/create/degreeprogram/skill-vertical`, formData);
      return response.data; // Adjust based on your API response structure
    } catch (error) {
      throw new Error(error.response.data.message || 'Failed to create skill vertical');
    }
  }
);

// Async thunk to get all skill verticals
export const getAllSkillVerticals = createAsyncThunk(
  'skillVertical/getAll',
  async () => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/degreeprogram/skill-vertical`);
      return response.data.skillVerticals; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to get a skill vertical by ID
export const getSkillVerticalById = createAsyncThunk(
  'skillVertical/getById',
  async (id) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getById/degreeprogram/skill-vertical/${id}`);
      return response.data.skillVertical; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to update a skill vertical
export const updateSkillVertical = createAsyncThunk(
  'skillVertical/update',
  async ({ id, formData }) => {
    try {
      const response = await axios.put(`${getAPIURL()}/update/degreeprogram/skill-vertical/${id}`, formData);
      return response.data.skillVertical; // Adjust based on your API response structure
    } catch (error) {
      throw error; // This will be caught in the slice
    }
  }
);
// Async thunk to delete a skill vertical
export const deleteSkillVertical = createAsyncThunk(
  'skillVertical/delete',
  async (id) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/degreeprogram/skill-vertical/${id}`);
      return id; // Return the ID of the deleted skill vertical
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
  skillVerticals: [],
  selectedSkillVertical: null,
};

// Create the slice
const skillVerticalSlice = createSlice({
  name: 'skillVertical',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSkillVertical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSkillVertical.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Skill vertical created successfully";
        state.skillVerticals.push(action.payload.newSkillVertical); // Add the new skill vertical to the list
      })
      .addCase(createSkillVertical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create skill vertical";
      })
      .addCase(getAllSkillVerticals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSkillVerticals.fulfilled, (state, action) => {
        state.loading = false;
        state.skillVerticals = action.payload;
      })
      .addCase(getAllSkillVerticals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getSkillVerticalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSkillVerticalById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSkillVertical = action.payload;
      })
      .addCase(getSkillVerticalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSkillVertical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSkillVertical.fulfilled, (state, action) => {
        state.loading = false;
       
        if (action.payload && action.payload._id) {
          const index = state.skillVerticals.findIndex(student => student._id === action.payload._id);
          if (index !== -1) {
            state.skillVerticals[index] = action.payload; // Update the target student in the list
          }
        }
      })
      .addCase(updateSkillVertical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteSkillVertical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSkillVertical.fulfilled, (state, action) => {
        state.loading = false;
        state.skillVerticals = state.skillVerticals.filter(skill => skill._id !== action.payload); // Remove the deleted skill vertical
      })
      .addCase(deleteSkillVertical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default skillVerticalSlice.reducer;