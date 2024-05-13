import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from '../../../../utils/utils';

// Async Thunk for submitting course modules
export const submitCourseModules = createAsyncThunk(
  "courseModule/submitCourseModules",
  async ({ modules, course,token }) => {
    const formData = new FormData();
    formData.append("course", course);
    try {
      const response = await axios.post(`${getAPIURL()}/create/coursemodules`,
        {
          modules,
          course,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const getAllCourseModules = createAsyncThunk(
  "courseModule/getAllCourseModules",
  async () => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/coursemodules`
      );
      return response.data.course_Module;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const getCourseModuleById = createAsyncThunk(
  "courseModule/getCourseModuleById",
  async (moduleId) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getById/coursemodules/${moduleId}`
      );
      return response.data.course_Module;
    } catch (error) {
      throw error.response.data;
    }
  }
);
export const updateCourseModule = createAsyncThunk(
  "courseModule/updateCourseModule",
  async ({ moduleId, updatedData,token }) => {
    try {
      const response = await axios.put(`${getAPIURL()}/update/coursemodules/${moduleId}`,
        updatedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.updatedCourseModule;
    } catch (error) {
      throw error.response.data;
    }
  }
);
export const deleteCourseModule = createAsyncThunk(
  "courseModule/deleteCourseModule",
  async ({moduleId,token}, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${getAPIURL()}/delete/coursemodules/${moduleId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Initial state
const initialState = {
  status: "idle",
  error: null,
  successMessage: null,
  courseModules: [], // Add a property to store the fetched course modules
  selectedModule: null, // Add a property to store the selected module
};

// Create slice
const courseModuleSlice = createSlice({
  name: "courseModule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitCourseModules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitCourseModules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload; // Log the entire payload
        console.log("API Response:", action.payload); // Log the response
        console.log("Success Message:", state.successMessage); // Log the success message
      })

      .addCase(submitCourseModules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getAllCourseModules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllCourseModules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courseModules = action.payload;
      })
      .addCase(getAllCourseModules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getCourseModuleById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCourseModuleById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedModule = action.payload;
      })
      .addCase(getCourseModuleById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCourseModule.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCourseModule.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedModule = action.payload;
      })
      .addCase(updateCourseModule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteCourseModule.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCourseModule.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
        // Remove the deleted module from the state
        state.courseModules = state.courseModules.filter(
          (module) => module._id !== action.payload.deleted_module._id
        );
      })
      .addCase(deleteCourseModule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default courseModuleSlice.reducer;
