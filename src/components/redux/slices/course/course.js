import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from '../../../../utils/utils';


export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (formDataToSend, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${getAPIURL()}/create/course`, formDataToSend,
      // {
      //   withCredentials: true,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCourse = createAsyncThunk(
  "course/fetchCcourses",
  async () => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/course`
      );
      return response.data.courses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  }
);
export const fetchCourseById = createAsyncThunk(
  "course/fetchCourseById",
  async (courseId) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getById/course/${courseId}`
      );
      return response.data.courses; // Adjust the key based on your API response
    } catch (error) {
      console.error(`Error fetching course by ID ${courseId}:`, error);
      throw error;
    }
  }
);

export const updateCourse = createAsyncThunk(
  'course/updateCourse',
  async ({ courseId, courseFormData,token }) => {
    const response = await axios.put(
      `${getAPIURL()}/update/course/${courseId}`,
      courseFormData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);
export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async ({courseId,token}) => {
    try {
      const response = await axios.delete(`${getAPIURL()}/delete/course/${courseId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
      );
      return response.data.message;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  }
);

const courseReducer = createSlice({
  name: "courses", 
  initialState: {
    courses: [],
    status: "idle",
    error: null,
    selectedCourse: null,
    deleteMessage: "",

  },
  reducers: {
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createCourse.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createCourse.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.courses.push(action.payload.course);
    })
    .addCase(createCourse.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to create course!";
    })
     .addCase(fetchCourse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courses = action.payload; // Fix the property name
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        const payload = action.payload;
        if (Array.isArray(payload)) {
          // If payload is an array, update courses accordingly
          state.courses = payload;
        } else if (payload instanceof Object) {
          // If payload is a single course object, handle it appropriately
          // For example, you can push it into the courses array:
          state.courses.push(payload);
        }
      })
      
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCourse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        if (action.payload) {
          console.log("Update course payload:", action.payload);
          state.status = "succeeded";
          state.courses = state.courses.map((course) =>
            course._id === action.payload._id ? action.payload : course
          );
          state.selectedCourse = null; // Reset selectedCourse after updating
        } else {
          state.status = "failed";
          state.error = "Failed to update course. Please try again later.";
        }
      })
      
      .addCase(updateCourse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteCourse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deleteMessage = action.payload;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer, actions, and selector
export const { setSelectedCourse } = courseReducer.actions;
export const selectCourses = (state) => state.course.courses;
export const selectAddCourseError = (state) => state.course.error;
export const selectSelectedCourse = (state) => state.course.selectedCourse;

export default courseReducer.reducer;
