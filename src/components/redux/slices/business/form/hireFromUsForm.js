import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

const initialState = {
  hiringApplications: [],
  selectedApplication: null,
  loading: false,
  error: null,
  isSuccess: false,
};

export const createHireFromUs = createAsyncThunk(
  "hireFromUs/create",
  async (formData) => {
    const response = await axios.post(
      `${getAPIURL()}/create/hire_from_us`,
      formData
    );
    return response.data;
  }
);

export const getAllHireFromUs = createAsyncThunk(
  "hireFromUs/fetchAll",
  async () => {
    const response = await axios.get(`${getAPIURL()}/getAll/hire_from_us`);
    return response.data.data; // Adjust based on your API response structure
  }
);

export const getHireFromUsById = createAsyncThunk(
  "hireFromUs/fetchById",
  async (applicationId) => {
    const response = await axios.get(
      `${getAPIURL()}/getById/hire_from_us/${applicationId}`
    );
    return response.data.data; // Adjust based on your API response structure
  }
);

export const deleteHireFromUs = createAsyncThunk(
  "hireFromUs/delete",
  async (deleteId) => {
    await axios.delete(`${getAPIURL()}/delete/hire_from_us/${deleteId}`);
    return deleteId;
  }
);

export const sendEmailToHireFromUsApplicants = createAsyncThunk(
  "hireFromUs/sendEmail",
  async ({ subject, message, applicationIds }) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/hire-from-us/response-mail/applicants`,
        {
          subject,
          message,
          applicationIds,
        }
      );
      return response.data; // Return the response data
    } catch (error) {
      throw error;
    }
  }
);

const hireFromUsSlice = createSlice({
  name: "hireFromUs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHireFromUs.pending, (state) => {
        state.loading = true;
      })
      .addCase(createHireFromUs.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.hiringApplications.push(action.payload);
      })
      .addCase(createHireFromUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isSuccess = false;
      })
      .addCase(getAllHireFromUs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllHireFromUs.fulfilled, (state, action) => {
        state.loading = false;
        state.hiringApplications = action.payload;
      })
      .addCase(getAllHireFromUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getHireFromUsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHireFromUsById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedApplication = action.payload;
      })
      .addCase(getHireFromUsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteHireFromUs.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHireFromUs.fulfilled, (state, action) => {
        state.loading = false;
        state.hiringApplications = state.hiringApplications.filter(
          (application) => application._id !== action.payload
        );
      })
      .addCase(deleteHireFromUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendEmailToHireFromUsApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendEmailToHireFromUsApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // You can handle any success message or state update here if needed
      })
      .addCase(sendEmailToHireFromUsApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = hireFromUsSlice.actions;
export default hireFromUsSlice.reducer;
