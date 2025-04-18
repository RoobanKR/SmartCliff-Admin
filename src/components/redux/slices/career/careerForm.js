import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../utils/utils";

export const getAllCareerForm = createAsyncThunk("career/getAll", async () => {
  try {
    const response = await axios.get(`${getAPIURL()}/getAll/career-form`);
    return response.data.allCareersForm;
  } catch (error) {
    throw error;
  }
});
export const getCareerFormById = createAsyncThunk(
  "career/getById",
  async (id) => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getById/career-form/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteCareerForm = createAsyncThunk(
  "career/deleteCareerForm",
  async (careerId) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/career-form/${careerId}`);
      return careerId;
    } catch (error) {
      throw error;
    }
  }
);

export const sendEmailToApplicants = createAsyncThunk(
  "career/sendEmail",
  async ({ subject, message, applicationIds }) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/response-mail-send/applicants`,
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
const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  careeries: [],
  selectedCareerById: null,
  serviceData: [],
};

const careerSlice = createSlice({
  name: "careerForm",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCareerForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCareerForm.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.careeries = action.payload;
      })
      .addCase(getAllCareerForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getCareerFormById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCareerFormById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedCareerById = action.payload.careerById;
      })
      .addCase(getCareerFormById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCareerForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCareerForm.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteCareerForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendEmailToApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendEmailToApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // You can handle any success message or state update here if needed
      })
      .addCase(sendEmailToApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default careerSlice.reducer;
