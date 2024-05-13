import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

export const createProgramFees = createAsyncThunk(
  'programFees/post',
  async (formData) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/program_fees`,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || 'Failed to add program fees');
    }
  }
);
export const getAllProgramFees = createAsyncThunk(
    'programFees/getAll',
    async () => {
      try {
        const response = await axios.get(`${getAPIURL()}/getAll/program_fees`);
        return response.data.program_feess;
      } catch (error) {
        throw error;
      }
    }
  );
  export const getProgramFeesById = createAsyncThunk(
    'programFees/getById',
    async (feesId) => {
      try {
        const response = await axios.get(`${getAPIURL()}/getById/program_fees/${feesId}`);
        return response.data.programFeesById;
      } catch (error) {
        throw error;
      }
    }
  )
  export const updateProgramFees = createAsyncThunk(
    'programFees/updateProgramFees',
    async ({ feesId, formData }) => {
      try {
        const response = await axios.put(`${getAPIURL()}/update/program_fees/${feesId}`, formData);
        return response.data.programFees;
      } catch (error) {
        throw error;
      }
    }
  );
  
  export const deleteProgramFees = createAsyncThunk(
    'programFees/deleteProgramFees',
    async (feesId) => {
      try {
        await axios.delete(`${getAPIURL()}/delete/program_fees/${feesId}`);
        return feesId;
      } catch (error) {
        throw error;
      }
    }
  );
// Define the initial state
const initialState = {
  loading: false,
  error: null,
  successMessage: '',
  programFees: [],
  programFeesById:null,

};

const programFeesSlice = createSlice({
  name: 'programFees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProgramFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProgramFees.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Program fees added successfully';
      })
      .addCase(createProgramFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add program fees';
      })
      .addCase(getAllProgramFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProgramFees.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.programFees = action.payload;
      })
      .addCase(getAllProgramFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getProgramFeesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgramFeesById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.programFeesById = action.payload;
      })
      .addCase(getProgramFeesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProgramFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgramFees.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.programFees = action.payload;
      })
      .addCase(updateProgramFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProgramFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProgramFees.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Remove the deleted program fees from the state if needed
      })
      .addCase(deleteProgramFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default programFeesSlice.reducer;
