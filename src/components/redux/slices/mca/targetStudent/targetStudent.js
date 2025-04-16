import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils'; // Adjust the import path as necessary

// Async thunk to create a new target student
export const createTargetStudent = createAsyncThunk(
  'targetStudent/create',
  async (formData) => {
    try {
      const response = await axios.post(`${getAPIURL()}/create/degreeprogram/target-student`, formData);
      return response.data; // Adjust based on your API response structure
    } catch (error) {
      throw new Error(error.response.data.message || 'Failed to create target student');
    }
  }
);

// Async thunk to get all target students
export const getAllTargetStudents = createAsyncThunk(
  'targetStudent/getAll',
  async () => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/degreeprogram/target-student`);
      return response.data.target_Student; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to get a target student by ID
export const getTargetStudentById = createAsyncThunk(
  'targetStudent/getById',
  async (id) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getById/degreeprogram/target-student/${id}`);
      return response.data.targetstudentById; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to update a target student
export const updateTargetStudent = createAsyncThunk(
  'targetStudent/update',
  async ({ id, formData }) => {
    try {
      const response = await axios.put(`${getAPIURL()}/update/degreeprogram/target-student/${id}`, formData);
      return response.data.targetstudent; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to delete a target student
export const deleteTargetStudent = createAsyncThunk(
  'targetStudent/delete',
  async (id) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/degreeprogram/target-student/${id}`);
      return id; // Return the ID of the deleted target student
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
  targetStudents: [],
  selectedTargetStudent: null,
};

// Create the slice
const targetStudentSlice = createSlice({
  name: 'targetStudent',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTargetStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTargetStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Target student created successfully";
        state.targetStudents.push(action.payload.newTargetStudent); // Add the new target student to the list
      })
      .addCase(createTargetStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create target student";
      })
      .addCase(getAllTargetStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTargetStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.targetStudents = action.payload;
      })
      .addCase(getAllTargetStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getTargetStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTargetStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTargetStudent = action.payload;
      })
      .addCase(getTargetStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTargetStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTargetStudent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload._id) {
          const index = state.targetStudents.findIndex(student => student._id === action.payload._id);
          if (index !== -1) {
            state.targetStudents[index] = action.payload; // Update the target student in the list
          }
        }
      })
      .addCase(updateTargetStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTargetStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTargetStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.targetStudents = state.targetStudents.filter(student => student._id !== action.payload); // Remove the deleted target student
      })
      .addCase(deleteTargetStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default targetStudentSlice.reducer;