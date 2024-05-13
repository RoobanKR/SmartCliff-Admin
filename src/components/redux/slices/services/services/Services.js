import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import { successToast, errorToast } from "../../../../toaster";
import { getAPIURL } from "../../../../../utils/utils";

export const fetchServices = createAsyncThunk(
  "service/fetchServices",
  async () => {
    try {
      const response = await Axios.get(`${getAPIURL()}/getAll/service`);
      return response.data.get_all_services;
    } catch (error) {
      throw error;
    }
  }
);

export const addService = createAsyncThunk(
  "service/addService",
  async ({ formData, token }) => {
    try {
      const response = await Axios.post(
        `${getAPIURL()}/create/service`,
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
export const fetchServiceById = createAsyncThunk(
  "service/fetchById",
  async (serviceId) => {
    try {
      const response = await Axios.get(
        `${getAPIURL()}/getById/service/${serviceId}`
      );
      return response.data.serviceById;
    } catch (error) {
      throw Error("Error fetching service details");
    }
  }
);

export const updateService = createAsyncThunk(
  "service/update",
  async ({ serviceId, formData, token }) => {
    try {
      const response = await Axios.put(
        `${getAPIURL()}/update/service/${serviceId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.service;
    } catch (error) {
      throw Error("Error updating service");
    }
  }
);
export const deleteService = createAsyncThunk(
  "service/deleteService",
  async ({ serviceId, token }) => {
    try {
      const response = await Axios.delete(
        `${getAPIURL()}/delete/service/${serviceId}`,
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
      throw Error("Error deleting service");
    }
  }
);
// Create the category reducer
const serviceReducer = createSlice({
  name: "service",
  initialState: {
    serviceData: [],
    status: "idle",
    error: "",
    service: {},
    isLoading: false,
    isSuccess: false,
    isError: false,
    selectedService: null,
  },
  reducers: {
    resetService: (state, action) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = "isLoading";
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.serviceData = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addService.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(addService.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.error = null;
        state.isSuccess = true;
        successToast("Added successfully");
      })

      .addCase(addService.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload
          ? action.payload.errorMessage
          : action.error.message;
        if (action.payload) {
          state.error = action.payload.errorMessage;
          console.log("error", action.payload.message[0].value);
          errorToast(action.payload.message[0].value, "bottom_right");
        } else {
          state.error = action.error.message;
          console.log("error", action);
          errorToast(action.error.message, "bottom_right");
        }
      })
      .addCase(fetchServiceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedService = action.payload;
        state.existingImages = action.payload.image
          ? [action.payload.image]
          : [];
      })

      .addCase(fetchServiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.service = action.payload;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteService.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteService.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetService } = serviceReducer.actions;
export const selectServices = (state) => state.service.serviceData;
export const selectAddServiceError = (state) => state.service.error;
export default serviceReducer.reducer;
