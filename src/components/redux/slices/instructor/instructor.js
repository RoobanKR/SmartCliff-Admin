import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import { getAPIURL } from '../../../../utils/utils';

// Async thunk for adding an instructor
export const addInstructor = createAsyncThunk(
  "instructor/addInstructor",
  async ({formData,token}) => {
    try {
      // Make a POST request to the backend API endpoint
      const response = await Axios.post(`${getAPIURL()}/create/instructor`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Return the response data
      return response.data;
    } catch (error) {
      // Throw an error with the response data if available
      throw error.response ? error.response.data : error;
    }
  }
);

export const fetchInstructors = createAsyncThunk(
  "instructors/fetchInstructors",
  async () => {
    try {
      const response = await Axios.get(`${getAPIURL()}/getAll/instructor`
      );
      return response.data.Instructor;
    } catch (error) {
      throw error;
    }
  }
);
export const fetchInstructorById = createAsyncThunk(
  "instructor/fetchById",
  async (instructorId) => {
    try {
      const response = await Axios.get(`${getAPIURL()}/getById/instructor/${instructorId}`
      );
      return response.data.instructor;
    } catch (error) {
      throw Error("Error fetching instructor details");
    }
  }
);

export const updateInstructor = createAsyncThunk(
  "instructor/update",
  async ({token, instructorId, formData }) => {
    try {
      const response = await Axios.put(`${getAPIURL()}/update/instructor/${instructorId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.instructor;
    } catch (error) {
      throw Error("Error updating instructor");
    }
  }
);

export const deleteInstructor = createAsyncThunk(
  "instructor/deleteInstructor",
  async ({token,instructorId}) => {
    try {
      const response = await Axios.delete(`${getAPIURL()}/delete/instructor/${instructorId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Return the response data
      return response.data;
    } catch (error) {
      // Throw an error with the response data if available
      throw error.response ? error.response.data : error;
    }
  }
);

// Instructor slice with initial state and reducers
const instructorSlice = createSlice({
  name: "instructor",
  initialState: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: "",
    instructors: [],  // Ensure this property is defined
    instructor: {},
  },
  reducers: {
    resetInstructor: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addInstructor.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(addInstructor.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(addInstructor.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.error = action.payload
        ? action.payload.errorMessage
        : action.error.message;
    });
    builder.addCase(fetchInstructors.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(fetchInstructors.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.instructors = action.payload;
    });
    builder.addCase(fetchInstructors.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(fetchInstructorById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchInstructorById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.instructor = action.payload;
    });
    builder.addCase(fetchInstructorById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateInstructor.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateInstructor.fulfilled, (state, action) => {
      state.isLoading = false;
      state.instructor = action.payload;
    });
    builder.addCase(updateInstructor.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(deleteInstructor.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(deleteInstructor.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(deleteInstructor.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.error = action.payload
        ? action.payload.errorMessage
        : action.error.message;
    });
  },
});

export const { resetInstructor } = instructorSlice.actions;

// Selector function to get the instructor state
export const selectInstructorState = (state) => state.instructor;

// Export the reducer
export default instructorSlice.reducer;
