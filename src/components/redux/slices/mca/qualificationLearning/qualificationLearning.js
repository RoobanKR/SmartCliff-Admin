import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

export const addQualificationLearning = createAsyncThunk(
  '/addQualificationLearning',
  async (formData) => {
    const response = await axios.post(
      `${getAPIURL()}/create/qualification_learning`,
      formData
    );
    return response.data;
  }
);
export const getAllQualificationLearning = createAsyncThunk(
    'qualificationLearning/getAll',
    async () => {
      try {
        const response = await axios.get(`${getAPIURL()}/getAll/qualification_learning`);
        return response.data.qualificatioLearning;
      } catch (error) {
        throw Error(error.response.data.message); // Throw error to be caught by rejected action
      }
    }
  );
  export const getQualificationLearningById = createAsyncThunk(
    'qualificationLearning/getById',
    async (qualifylearnId) => {
      try {
        const response = await axios.get(`${getAPIURL()}/getById/qualification_learning/${qualifylearnId}`);
        return response.data.qualificatioLearning;
      } catch (error) {
        throw Error(error.response.data.message);
      }
    }
  );

  export const updateQualificationLearning = createAsyncThunk(
    "qualificationLearning/update",
    async ({ qualifylearnId, formData }) => {
      try {
        const response = await axios.put(
          `${getAPIURL()}/update/qualification_learning/${qualifylearnId}`,
          formData
        );
        return response.data.qualificatioLearning;
      } catch (error) {
        throw Error("Error updating career qualification Learning");
      }
    }
  );


  export const deleteQualificationLearning = createAsyncThunk(
    "qualificationLearning/delete",
    async (qualifylearnId) => {
      try {
        const response = await axios.delete(
          `${getAPIURL()}/delete/qualification_learning/${qualifylearnId}`
        );
        return response.data;
      } catch (error) {
        throw Error("Error deleting qualification Learning");
      }
    }
  );
const initialState = {
  loading: false,
  error: null,
  qualifyLearn: null,
  data: [],
  selectedQualificationLearning: null,
};

const qualificationLearningSlice = createSlice({
  name: 'qualificationLearning',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addQualificationLearning.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.qualifyLearn = null;
      })
      .addCase(addQualificationLearning.fulfilled, (state, action) => {
        state.loading = false;
        state.qualifyLearn = action.payload.message;
      })
      .addCase(addQualificationLearning.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllQualificationLearning.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllQualificationLearning.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllQualificationLearning.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getQualificationLearningById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQualificationLearningById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQualificationLearning = action.payload;
      })
      .addCase(getQualificationLearningById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateQualificationLearning.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQualificationLearning.fulfilled, (state, action) => {
        state.loading = false;
        state.qualificatioLearning = action.payload;
      })
      .addCase(updateQualificationLearning.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteQualificationLearning.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteQualificationLearning.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteQualificationLearning.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default qualificationLearningSlice.reducer;
