import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

export const fetchOurPrograms = createAsyncThunk(
  'ourProgram/fetchOurPrograms',
  async () => {
    const response = await axios.get(`${getAPIURL()}/getAll/our_program`);
    return response.data.our_Programs;
  }
);

export const fetchOurProgramById = createAsyncThunk(
  'ourProgram/fetchOurProgramById',
  async (programId) => {
    const response = await axios.get(`${getAPIURL()}/getById/our_program/${programId}`);
    return response.data.our_ProgramsById;
  }
);

export const addOurProgram = createAsyncThunk(
  'ourProgram/addOurProgram',
  async ({ title, description, icon,selectedProgram }) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('icon', icon);
    formData.append("degree_program", selectedProgram._id);

    const response = await axios.post(`${getAPIURL()}/create/our_program`, formData);

    return response.data;
  }
);

export const updateOurProgram = createAsyncThunk(
  'ourProgram/updateOurProgram',
  async ({ programId, formData }) => {
    const response = await axios.put(`${getAPIURL()}/update/our_program/${programId}`, formData);
    return response.data.our_Programs;
  }
);
export const deleteOurProgram = createAsyncThunk(
  'ourProgram/deleteOurProgram',
  async (programId) => {
    const response = await axios.delete(`${getAPIURL()}/delete/our_program/${programId}`);
    return response.data;
  }
);
const ourProgramSlice = createSlice({
  name: 'ourProgram',
  initialState: {
    ourProgram: [], // This should hold all programs when fetching
    loading: false,
    error: null,
    selectedProgram: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOurPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOurPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.ourProgram = action.payload; // Update ourProgram with all programs
      })
      .addCase(fetchOurPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOurProgramById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOurProgramById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedProgram = action.payload; // Update selectedProgram with the fetched program
      })
      .addCase(fetchOurProgramById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      .addCase(addOurProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOurProgram.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addOurProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOurProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOurProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProgram = action.payload;
      })
      .addCase(updateOurProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteOurProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOurProgram.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteOurProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ourProgramSlice.reducer;
