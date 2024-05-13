import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

export const createProgramMentor = createAsyncThunk(
  'programMentor/createProgramMentor',
  async (formData) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/program_mentor`,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || 'Failed to add program mentor');
    }
  }
);
export const getAllProgramMentors = createAsyncThunk(
    'programMentors/getAll',
    async () => {
      try {
        const response = await axios.get(`${getAPIURL()}/getAll/program_mentor`);
        return response.data.programMentor;
      } catch (error) {
        throw error;
      }
    }
  );

  export const getProgramMentorById = createAsyncThunk(
    'programMentor/getById',
    async (mentorId) => {
      try {
        const response = await axios.get(`${getAPIURL()}/getById/program_mentor/${mentorId}`);
        return response.data.programMentorById;
      } catch (error) {
        throw error;
      }
    }
  );
  
  // Action to update a program mentor
  export const updateProgramMentor = createAsyncThunk(
    'programMentor/update',
    async ({ mentorId, formData }) => {
      try {
        const response = await axios.put(`${getAPIURL()}/update/program_mentor/${mentorId}`, formData);
        return response.data.updatedProgramMentor;
      } catch (error) {
        throw error;
      }
    }
  );
  
  // Action to delete a program mentor
  export const deleteProgramMentor = createAsyncThunk(
    'programMentor/delete',
    async (mentorId) => {
      try {
        await axios.delete(`${getAPIURL()}/delete/program_mentor/${mentorId}`);
        return mentorId;
      } catch (error) {
        throw error;
      }
    }
  );
  

  const initialState = {
  loading: false,
  error: null,
  successMessage: '',
  programMentor: [],
  programMentorById: null,


};

const programMentorSlice = createSlice({
  name: 'programMentor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProgramMentor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProgramMentor.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Program mentor added successfully';
      })
      .addCase(createProgramMentor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add program mentor';
      })
      .addCase(getAllProgramMentors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProgramMentors.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.programMentor = action.payload;
      })
      .addCase(getAllProgramMentors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch program mentors';
      })
      .addCase(getProgramMentorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgramMentorById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.programMentorById = action.payload;
      })
      .addCase(getProgramMentorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get program mentor';
      })
      .addCase(updateProgramMentor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgramMentor.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMessage = 'Program mentor updated successfully';
        // Update the program mentor in the state if needed
      })
      .addCase(updateProgramMentor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update program mentor';
      })
      .addCase(deleteProgramMentor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProgramMentor.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMessage = 'Program mentor deleted successfully';
      })
      .addCase(deleteProgramMentor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete program mentor';
      });
  },
});

export default programMentorSlice.reducer;
