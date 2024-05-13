import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../utils/utils';

const initialState = {
    batches: [],
    loading: false,
  error: null,
  selectedBatch: null,

};

export const createBatch = createAsyncThunk(
  'batches/createBatch',
  async ({formData,token}, thunkAPI) => {
    try {
      const response = await axios.post(`${getAPIURL()}/create/batches`, formData,
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchBatches = createAsyncThunk(
    "batches/fetchBatches",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${getAPIURL()}/getAll/batches`);
        return response.data.All_batches;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const fetchBatchById = createAsyncThunk(
    "batch/fetchBatchById",
    async (batchId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${getAPIURL()}/getById/batches/${batchId}`);
        return response.data.batch_Id_Base;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const updateBatch = createAsyncThunk(
    "batch/updateBatch",
    async ({token, batchId, formData }, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${getAPIURL()}/update/batches/${batchId}`, formData,
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
  
  export const deleteBatch = createAsyncThunk(
    "batch/deleteBatch",
    async ({token,batchId}, { rejectWithValue }) => {
      try {
        const response = await axios.delete(`${getAPIURL()}/delete/batches/${batchId}`,
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
const batchesSlice = createSlice({
  name: 'batches',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.batches.push(action.payload);
      })
      .addCase(createBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload;
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchBatchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBatch = action.payload;
      })
      .addCase(fetchBatchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBatch.fulfilled, (state) => {
        state.loading = false;
        // Optionally, you can update state to reflect the successful update
      })
      .addCase(updateBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBatch.fulfilled, (state) => {
        state.loading = false;
        // Optionally, you can update state to reflect the successful deletion
      })
      .addCase(deleteBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default batchesSlice.reducer;
