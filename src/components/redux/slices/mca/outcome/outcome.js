import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

export const createOutcome = createAsyncThunk(
  'outcome/post',
  async ({token,formData}) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/outcome`,
        formData,
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
      throw new Error(error.response.data.message || 'Failed to add Outcome');
    }
  }
);

export const getAllOutcomes = createAsyncThunk(
    'outcome/getAll',
    async () => {
      try {
        const response = await axios.get(`${getAPIURL()}/getAll/outcome`);
        return response.data.AllOutcomes;
      } catch (error) {
        throw error;
      }
    }
  );
  export const getOutcomeById = createAsyncThunk(
    'outcome/getById',
    async (outcomeId) => {
      try {
        const response = await axios.get(`${getAPIURL()}/getById/outcome/${outcomeId}`);
        return response.data.outcomeById;
      } catch (error) {
        throw error;
      }
    }
  )
  export const updateOutcome = createAsyncThunk(
    'outcome/updateOutcome',
    async ({token, outcomeId, formData }) => {
      try {
        const response = await axios.put(`${getAPIURL()}/update/outcome/${outcomeId}`, formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.outcome;
      } catch (error) {
        throw error;
      }
    }
  );
  
  export const deleteOutcome = createAsyncThunk(
    'outcome/deleteOutcome',
    async ({token,outcomeId}) => {
      try {
        await axios.delete(`${getAPIURL()}/delete/outcome/${outcomeId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        return outcomeId;
      } catch (error) {
        throw error;
      }
    }
  );
const initialState = {
    loading: false,
    error: null,
    successMessage: '',  
    outcomes: [],
    outcomeById:null
};
  
  const outcomeSlice = createSlice({
    name: 'outcome',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(createOutcome.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createOutcome.fulfilled, (state, action) => {
          state.loading = false;
          state.successMessage = action.payload.message || 'Outcome added successfully';
        })
        .addCase(createOutcome.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to add Outcome';
        })
        .addCase(getAllOutcomes.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getAllOutcomes.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.outcomes = action.payload;
          })
          .addCase(getAllOutcomes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(getOutcomeById.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getOutcomeById.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.outcomeById = action.payload;
          })
          .addCase(getOutcomeById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(updateOutcome.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(updateOutcome.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.outcomes = action.payload;
          })
          .addCase(updateOutcome.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(deleteOutcome.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteOutcome.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            // Remove the deleted program fees from the state if needed
          })
          .addCase(deleteOutcome.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    },
  });
  
  export default outcomeSlice.reducer;
  