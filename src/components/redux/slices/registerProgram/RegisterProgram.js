import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../utils/utils";

// Async thunk for fetching all program applications
export const fetchAllProgramApplications = createAsyncThunk(
  "programApplications/fetchAllProgramApplications",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getAll/programapply`
      );
      return response.data; // Assuming the response contains relevant data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateProgramApplication = createAsyncThunk(
  "programApply/updateProgramApplication",
  async (programData, thunkAPI) => {
    try {
      const { id, ...formData } = programData;
      const response = await axios.put(
        `${getAPIURL()}/edit/programApply/${id}`,
        formData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting a program application by ID
export const getProgramApplicationById = createAsyncThunk(
  "programApply/getProgramApplicationById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getByid/programApply/${id}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting a program application by ID
export const deleteProgramApplicationById = createAsyncThunk(
  "programApply/deleteProgramApplicationById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${getAPIURL()}/delete/programApply/${id}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create slice for program applications
const programApplicationsSlice = createSlice({
  name: "programApplications",
  initialState: {
    isLoading: false,
    error: null,
    programApplications: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProgramApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProgramApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.programApplications = action.payload.programApplications; // Assuming API returns program applications
      })
      .addCase(fetchAllProgramApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? action.payload.error
          : "Error fetching program applications"; // Default error message
      })
      .addCase(updateProgramApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProgramApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(updateProgramApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? action.payload.error
          : "Error updating program application";
      })
      .addCase(getProgramApplicationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProgramApplicationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProgram = action.payload.programApplication;
      })
      .addCase(getProgramApplicationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? action.payload.error
          : "Error fetching program application";
      })
      .addCase(deleteProgramApplicationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProgramApplicationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteProgramApplicationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? action.payload.error
          : "Error deleting program application";
      });
  },
});

export default programApplicationsSlice.reducer;
