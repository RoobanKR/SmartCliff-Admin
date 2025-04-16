import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

const initialState = {
  homeExecutionHighlights: [],
  selectedHighlight: null,
  loading: false,
  error: null,
};

export const createHomeExecutionHighlight = createAsyncThunk(
  'homeExecutionHighlights/create',
  async (formData) => {
    const response = await axios.post(`${getAPIURL()}/create/home/execution-highlights`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

export const getAllHomeExecutionHighlights = createAsyncThunk(
  'homeExecutionHighlights/fetchAll',
  async () => {
    const response = await axios.get(`${getAPIURL()}/getAll/home/execution-highlights`);
    return response.data.getAllHomeExecutionHighlight;
  }
);

export const getHomeExecutionHighlightById = createAsyncThunk(
  'homeExecutionHighlights/fetchById',
  async (id) => {
    const response = await axios.get(`${getAPIURL()}/getById/home/execution-highlights/${id}`);
    return response.data.homeExecutionHighlightById;
  }
);

export const updateHomeExecutionHighlight = createAsyncThunk(
  'homeExecutionHighlights/update',
  async ({ id, formData }) => {
    const response = await axios.put(`${getAPIURL()}/update/home/execution-highlights/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

export const deleteHomeExecutionHighlight = createAsyncThunk(
  'homeExecutionHighlights/delete',
  async (id) => {
    await axios.delete(`${getAPIURL()}/delete/home/execution-highlights/${id}`);
    return id; 
  }
);

const homeExecutionHighlightsSlice = createSlice({
  name: 'homeExecutionHighlights',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHomeExecutionHighlight.pending, (state) => {
        state.loading = true;
      })
      .addCase(createHomeExecutionHighlight.fulfilled, (state, action) => {
        state.loading = false;
        state.homeExecutionHighlights.push(action.payload);
      })
      .addCase(createHomeExecutionHighlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllHomeExecutionHighlights.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllHomeExecutionHighlights.fulfilled, (state, action) => {
        state.loading = false;
        state.homeExecutionHighlights = action.payload;
      })
      .addCase(getAllHomeExecutionHighlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getHomeExecutionHighlightById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHomeExecutionHighlightById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedHighlight = action.payload;
      })
      .addCase(getHomeExecutionHighlightById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateHomeExecutionHighlight.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHomeExecutionHighlight.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.homeExecutionHighlights.findIndex(highlight => highlight._id === action.payload._id);
        if (index !== -1) {
          state.homeExecutionHighlights[index] = action.payload;
        }
      })
      .addCase(updateHomeExecutionHighlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteHomeExecutionHighlight.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHomeExecutionHighlight.fulfilled, (state, action) => {
        state.loading = false;
        state.homeExecutionHighlights = state.homeExecutionHighlights.filter(highlight => highlight._id !== action.payload);
      })
      .addCase(deleteHomeExecutionHighlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = homeExecutionHighlightsSlice.actions;
export default homeExecutionHighlightsSlice.reducer;