import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

const initialState = {
    trainingApplications: [],
    selectedApplication: null,
    loading: false,
    error: null,
    isSuccess: false,
};


export const getAllTrainFromUs = createAsyncThunk(
    'trainFromUs/fetchAll',
    async () => {
        const response = await axios.get(`${getAPIURL()}/getAll/train_from_us`);
        return response.data.data; 
    }
);

export const getTrainFromUsById = createAsyncThunk(
    'trainFromUs/fetchById',
    async (applicationId) => {
        const response = await axios.get(`${getAPIURL()}/getById/train_from_us/${applicationId}`);
        return response.data.data; // Adjust based on your API response structure
    }
);

export const deleteTrainFromUs = createAsyncThunk(
    'trainFromUs/delete',
    async (deleteId) => {
        await axios.delete(`${getAPIURL()}/delete/train_from_us/${deleteId}`);
        return deleteId;
    }
);

export const sendEmailToTrainFromUsApplicants = createAsyncThunk(
  "trainFromUs/sendEmail",
  async ({ subject, message, applicationIds }) => {
    try {
      const response = await axios.post(`${getAPIURL()}/train-from-us/response-mail/applicants`, {
        subject,
        message,
        applicationIds,
      });
      return response.data; // Return the response data
    } catch (error) {
      throw error;
    }
  }
);

const trainFromUsSlice = createSlice({
    name: 'trainFromUs',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllTrainFromUs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllTrainFromUs.fulfilled, (state, action) => {
                state.loading = false;
                state.trainingApplications = action.payload;
            })
            .addCase(getAllTrainFromUs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getTrainFromUsById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTrainFromUsById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedApplication = action.payload;
            })
            .addCase(getTrainFromUsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteTrainFromUs.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteTrainFromUs.fulfilled, (state, action) => {
                state.loading = false;
                state.trainingApplications = state.trainingApplications.filter(application => application._id !== action.payload);
            })
            .addCase(deleteTrainFromUs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
             .addCase(sendEmailToTrainFromUsApplicants.pending, (state) => {
                          state.loading = true;
                          state.error = null;
                        })
                        .addCase(sendEmailToTrainFromUsApplicants.fulfilled, (state, action) => {
                          state.loading = false;
                          state.error = null;
                          // You can handle any success message or state update here if needed
                        })
                        .addCase(sendEmailToTrainFromUsApplicants.rejected, (state, action) => {
                          state.loading = false;
                          state.error = action.error.message;
                        });
    },
});

export const { clearError } = trainFromUsSlice.actions;
export default trainFromUsSlice.reducer;