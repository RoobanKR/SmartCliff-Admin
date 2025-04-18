import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

const initialState = {
    instituteApplications: [],
    selectedApplication: null,
    loading: false,
    error: null,
    isSuccess: false,
};


export const getAllInstitute = createAsyncThunk(
    'institute/fetchAll',
    async () => {
        const response = await axios.get(`${getAPIURL()}/getAll/institute`);
        return response.data.data; 
    }
);

export const getInstituteById = createAsyncThunk(
    'institute/fetchById',
    async (applicationId) => {
        const response = await axios.get(`${getAPIURL()}/getById/institute/${applicationId}`);
        return response.data.data; // Adjust based on your API response structure
    }
);

export const deleteInstitute = createAsyncThunk(
    'institute/delete',
    async (deleteId) => {
        await axios.delete(`${getAPIURL()}/delete/institute/${deleteId}`);
        return deleteId;
    }
);

export const sendResponseEmailInstituteForm = createAsyncThunk(
  "institute/sendEmail",
  async ({ subject, message, applicationIds }) => {
    try {
      const response = await axios.post(`${getAPIURL()}/institute/response-mail/applicants`, {
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

const instituteSlice = createSlice({
    name: 'institute',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllInstitute.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllInstitute.fulfilled, (state, action) => {
                state.loading = false;
                state.instituteApplications = action.payload;
            })
            .addCase(getAllInstitute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getInstituteById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getInstituteById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedApplication = action.payload;
            })
            .addCase(getInstituteById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteInstitute.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteInstitute.fulfilled, (state, action) => {
                state.loading = false;
                state.instituteApplications = state.instituteApplications.filter(application => application._id !== action.payload);
            })
            .addCase(deleteInstitute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
             .addCase(sendResponseEmailInstituteForm.pending, (state) => {
                          state.loading = true;
                          state.error = null;
                        })
                        .addCase(sendResponseEmailInstituteForm.fulfilled, (state, action) => {
                          state.loading = false;
                          state.error = null;
                          // You can handle any success message or state update here if needed
                        })
                        .addCase(sendResponseEmailInstituteForm.rejected, (state, action) => {
                          state.loading = false;
                          state.error = action.error.message;
                        });
    },
});

export const { clearError } = instituteSlice.actions;
export default instituteSlice.reducer;