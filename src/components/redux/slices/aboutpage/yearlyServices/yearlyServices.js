import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils"; // Adjust the import path as necessary

// Async thunk to create a new yearly service
export const createYearlyService = createAsyncThunk(
  "yearlyService/create",
  async (formData) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/about/yearly-services`, // Adjust the endpoint as necessary
        formData
      );
      return response.data; // Adjust based on your API response structure
    } catch (error) {
      throw new Error(error.response.data.message || "Failed to create yearly service");
    }
  }
);

// Async thunk to get all yearly services
export const getAllYearlyServices = createAsyncThunk(
  "yearlyService/getAll",
  async () => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/about/yearly-services`);
      return response.data.services; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to get a yearly service by ID
export const getYearlyServiceById = createAsyncThunk(
  "yearlyService/getById",
  async (id) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getById/about/yearly-services/${id}`);
      return response.data.service; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to update a yearly service
export const updateYearlyService = createAsyncThunk(
  "yearlyService/update",
  async ({ id, formData }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/about/yearly-services/${id}`,
        formData
      );
      return response.data.service; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to delete a yearly service
export const deleteYearlyService = createAsyncThunk(
  "yearlyService/delete",
  async (id) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/about/yearly-services/${id}`);
      return id; // Return the ID of the deleted service
    } catch (error) {
      throw error;
    }
  }
);

// Initial state for the slice
const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  services: [],
  selectedService: null,
};

// Create the slice
const yearlyServiceSlice = createSlice({
  name: "yearlyService",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createYearlyService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createYearlyService.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Yearly service created successfully";
      })
      .addCase(createYearlyService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create yearly service";
      })
      .addCase(getAllYearlyServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllYearlyServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(getAllYearlyServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getYearlyServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getYearlyServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedService = action.payload;
      })
      .addCase(getYearlyServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateYearlyService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateYearlyService.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.services.findIndex(service => service._id === action.payload._id);
        if (index !== -1) {
          state.services[index] = action.payload; // Update the service in the list
        }
      })
      .addCase(updateYearlyService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteYearlyService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteYearlyService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(service => service._id !== action.payload); // Remove the deleted service
      })
      .addCase(deleteYearlyService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default yearlyServiceSlice.reducer;