import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../utils/utils";


export const getAllEnquiry = createAsyncThunk("enquiry/getAll", async () => {
  try {
    const response = await axios.get(`${getAPIURL()}/getAll/enquiry`);
    return response.data.allEnquiry;
  } catch (error) {
    throw error;
  }
});
export const getEnquiryById = createAsyncThunk("enquiry/getById", async (id) => {
  try {
    const response = await axios.get(
      `${getAPIURL()}/getById/enquiry/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const deleteEnquiry = createAsyncThunk(
  "enquiry/deleteEnquiry",
  async (enquiryId) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/enquiry/${enquiryId}`);
      return enquiryId;
    } catch (error) {
      throw error;
    }
  }
);
const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  enquires: [],
  selectedEnquiryById: null,
  serviceData: [],
};

const enquirySlice = createSlice({
  name: "enquiry",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.enquires = action.payload;
      })
      .addCase(getAllEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getEnquiryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEnquiryById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedEnquiryById = action.payload.enquiryById;
      })
      .addCase(getEnquiryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default enquirySlice.reducer;
