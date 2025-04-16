import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

export const createServiceAbout = createAsyncThunk(
  "serviceAbout/createServiceAbout",
  async ({ formData, token }) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/service-about`,
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
      throw new Error(
        error.response.data.message || "Failed to add serviceAbout"
      );
    }
  }
);

export const getAllServiceAbout = createAsyncThunk(
  "serviceAbout/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/service-about`);
      return response.data.get_all_services_about;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getServiceAboutById = createAsyncThunk(
  "serviceAbout/getById",
  async (id) => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getById/service-about/${id}`
      );
      return response.data.serviceAboutById; // Updated to match the response structure
    } catch (error) {
      throw error;
    }
  }
);

export const updateServiceAbout = createAsyncThunk(
  "serviceAbout/updateServiceAbout",
  async ({ id, formData,token }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/service-about/${id}`,
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
      throw error;
    }
  }
);

export const deleteServiceAbout = createAsyncThunk(
  "serviceAbout/deleteServiceAbout",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/service-about/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  serviceAbouts: [],
  selectedServiceAbout: null, // For storing the service being edited
  serviceAboutData: [],
};

const ServiceAboutSlice = createSlice({
  name: "serviceAbout",
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    }
  },
    extraReducers: (builder) => {
    builder
      .addCase(createServiceAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServiceAbout.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
        state.successMessage = action.payload.message?.[0]?.value || "serviceAbout added successfully";
      })
      .addCase(createServiceAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add serviceAbout";
      })
      .addCase(getAllServiceAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllServiceAbout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.serviceAbouts = action.payload;
      })
      .addCase(getAllServiceAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getServiceAboutById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceAboutById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedServiceAbout = action.payload;
      })
      .addCase(getServiceAboutById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateServiceAbout.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateServiceAbout.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;
        state.updateSuccess = true;
        state.successMessage = action.payload.message?.[0]?.value || "Update successful";
      })
      .addCase(updateServiceAbout.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.error.message;
        state.updateSuccess = false;
      })
      .addCase(deleteServiceAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteServiceAbout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.serviceAbouts = state.serviceAbouts.filter(
          (service) => service._id !== action.payload
        );
      })
      .addCase(deleteServiceAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
      },
});
export const { clearUpdateStatus } = ServiceAboutSlice.actions;

export default ServiceAboutSlice.reducer;
