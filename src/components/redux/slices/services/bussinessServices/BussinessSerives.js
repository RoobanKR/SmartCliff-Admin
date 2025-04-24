import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import { successToast, errorToast } from "../../../../toaster";
import { getAPIURL } from "../../../../../utils/utils";

export const getAllBussinessServices = createAsyncThunk(
  "businessService/getAllBussinessServices",
  async () => {
    try {
      const response = await Axios.get(`${getAPIURL()}/getAll/business-services`);
      return response.data.get_all_businessservices;
    } catch (error) {
      throw error;
    }
  }
);

export const createBussinessService = createAsyncThunk(
  "businessService/createBussinessService",
  async ({ formData, token }) => {
    try {
      const response = await Axios.post(
        `${getAPIURL()}/create/business-services`,
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
export const getByIdBussinessService = createAsyncThunk(
    "businessService/getByIdBussinessService",
    async (businessServiceId) => { // ✅ Expecting a string, not an object
      try {
        const response = await Axios.get(
          `${getAPIURL()}/getById/business-services/${businessServiceId}`
        );
        return response.data.businessserviceById;
      } catch (error) {
        throw Error("Error fetching businessService details");
      }
    }
  );
  
export const updateBussinessService = createAsyncThunk(
  "businessService/update",
  async ({ businessServiceId, formData, token }) => {
    try {
      const response = await Axios.put(
        `${getAPIURL()}/update/business-service/${businessServiceId}`,
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
      throw Error("Error updating businessService");
    }
  }
);
export const deleteBussinessService = createAsyncThunk(
  "businessService/deleteBussinessService",
  async ({ businessServiceId, token }) => {
    try {
      const response = await Axios.delete(
        `${getAPIURL()}/delete/business-service/${businessServiceId}`,
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
      throw Error("Error deleting businessService");
    }
  }
);
// Create the category reducer
const businessServiceReducer = createSlice({
  name: "businessService",
  initialState: {
    businessServiceData: [],
    status: "idle",
    error: "",
    businessService: {},
    isLoading: false,
    isSuccess: false,
    isError: false,
    selectedService: null,
  },
  reducers: {
    resetBussinessService: (state, action) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBussinessServices.pending, (state) => {
        state.status = "isLoading";
      })
      .addCase(getAllBussinessServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.businessServiceData = action.payload;
      })
      .addCase(getAllBussinessServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createBussinessService.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(createBussinessService.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.error = null;
        state.isSuccess = true;
      })

      .addCase(createBussinessService.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload
          ? action.payload.errorMessage
          : action.error.message;
        if (action.payload) {
          state.error = action.payload.errorMessage;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(getByIdBussinessService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getByIdBussinessService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedService = action.payload;
        state.existingImages = action.payload.image
          ? [action.payload.image]
          : [];
      })

      .addCase(getByIdBussinessService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateBussinessService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBussinessService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businessService = action.payload;
      })
      .addCase(updateBussinessService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteBussinessService.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBussinessService.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteBussinessService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetBussinessService } = businessServiceReducer.actions;
export const selectBussinessServices = (state) => state.businessService.businessServiceData;
export const selectAddBussinessServiceError = (state) => state.businessService.error;
export default businessServiceReducer.reducer;
