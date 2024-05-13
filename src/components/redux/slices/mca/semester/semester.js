import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

const initialState = {
    loading: false,
    error: null,
    semesters: [], 
    semesterById: null,
    semesterData: null,
    deleting: false,
  deleted: false,

  };

export const createSemester = createAsyncThunk(
  "semester/createSemester",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/semester`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllSemesters = createAsyncThunk(
    "semester/getAllSemesters",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${getAPIURL()}/getAll/semester`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );


  export const fetchSemesterById = createAsyncThunk(
    "semester/fetchSemesterById",
    async (semesterId) => {
      try {
        const response = await axios.get(
          `${getAPIURL()}/getById/semester/${semesterId}`
        );
        return response.data.semesterById;
      } catch (error) {
        throw Error("Error fetching semester details");
      }
    }
  );
  
  // Define the async thunk to update semester details
  export const updateSemester = createAsyncThunk(
    "semester/updateSemester",
    async ({ semesterId, formData }) => {
      try {
        const response = await axios.put(
          `${getAPIURL()}/update/semester/${semesterId}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data.updatedSemester; // Assuming the API returns updated semester data
      } catch (error) {
        throw Error("Error updating semester");
      }
    }
  );
  export const deleteSemester = createAsyncThunk(
    'semester/delete',
    async (id, thunkAPI) => {
      try {
        const response = await axios.delete(`${getAPIURL()}/delete/semester/${id}`);
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  );

const semesterSlice = createSlice({
  name: "semester",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSemester.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllSemesters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSemesters.fulfilled, (state, action) => {
        state.loading = false;
        state.semesters = action.payload.semester; 
      })
      .addCase(getAllSemesters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSemesterById.pending, (state) => {
        state.status = "loading";
        state.error = null; // Reset error when starting to fetch
      })
      .addCase(fetchSemesterById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.semesterData = action.payload;
      })
      .addCase(fetchSemesterById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateSemester.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSemester.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.semesterData = action.payload;
      })
      .addCase(updateSemester.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteSemester.pending, (state) => {
        state.deleting = true;
        state.deleted = false;
        state.error = null;
      })
      .addCase(deleteSemester.fulfilled, (state) => {
        state.deleting = false;
        state.deleted = true;
        state.error = null;
      })
      .addCase(deleteSemester.rejected, (state, action) => {
        state.deleting = false;
        state.deleted = false;
        state.error = action.payload.message;
      });

  },
});
export const selectSemesterError = (state) => state.semester.error;
export const selectSemesterData = (state) => state.semester.semesterData;
export default semesterSlice.reducer;
