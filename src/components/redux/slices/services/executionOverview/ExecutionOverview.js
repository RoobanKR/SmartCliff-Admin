import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

export const fetchExecutionOverview = createAsyncThunk(
  "executionOverview/fetchExecutionOverview",
  async () => {
    try {
      const response = await Axios.get(
        `${getAPIURL()}/getAll/execution_overview`
      );
      return response.data.getAllExecutionOverviews;
    } catch (error) {
      throw error;
    }
  }
);

export const createExecutionOverview = createAsyncThunk(
  "executionOverview/createExecutionOverview",
  async (executionOverviewData) => {
    try {
      const response = await Axios.post(
        `${getAPIURL()}/create/execution_overview`,
        executionOverviewData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
);

export const deleteExecutionOverview = createAsyncThunk(
  "executionOverview/deleteExecutionOverview",
  async (id) => {
    try {
      const response = await Axios.delete(
        `${getAPIURL()}/delete/execution_overview/${id}`
      );

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
);

export const fetchExecutionOverviewById = createAsyncThunk(
  "executionOverview/fetchExecutionOverviewById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getById/execution_overview/${id}`
      );
      return response.data.getExecutionOverviewById;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateExecutionOverview = createAsyncThunk(
  "executionOverview/updateExecutionOverview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/execution_overview/${data.id}`,
        data.payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const executionOverviewSlice = createSlice({
  name: "executionOverview",
  initialState: {
    loading: false,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    executionOverviews: [],
    executionOverview: null,
    serviceById: null,
  },
  reducers: {
    resetExecutionOverview: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExecutionOverview.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(fetchExecutionOverview.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.executionOverviews = action.payload;
    });
    builder.addCase(fetchExecutionOverview.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(createExecutionOverview.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(createExecutionOverview.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(createExecutionOverview.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.error = action.payload
        ? action.payload.errorMessage
        : action.error.message;
    });
    builder.addCase(deleteExecutionOverview.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(deleteExecutionOverview.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(deleteExecutionOverview.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.error = action.payload
        ? action.payload.errorMessage
        : action.error.message;
    });
    builder.addCase(fetchExecutionOverviewById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchExecutionOverviewById.fulfilled, (state, action) => {
      state.loading = false;
      state.executionOverview = action.payload;
    });
    builder.addCase(fetchExecutionOverviewById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateExecutionOverview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateExecutionOverview.fulfilled, (state, action) => {
      state.loading = false;
      // handle update success if needed
    });
    builder.addCase(updateExecutionOverview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetExecutionOverview } = executionOverviewSlice.actions;

export const selectExecutionOverviewState = (state) => state.executionOverview;

export default executionOverviewSlice.reducer;
