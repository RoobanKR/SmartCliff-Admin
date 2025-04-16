import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

export const createServiceProcess = createAsyncThunk(
  "serviceProcess/createServiceProcess",
  async ({ formData, token }) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/service-process`,
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
        error.response.data.message || "Failed to add serviceProcess"
      );
    }
  }
);

export const getAllServiceProcess = createAsyncThunk(
  "serviceProcess/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5353/getAll/service-process');
      return response.data.get_all_services_process;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getServiceProcessById = createAsyncThunk(
  "serviceProcess/getById",
  async (id) => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getById/service-process/${id}`
      );
      return response.data.service_processById; // Updated to match the response structure
    } catch (error) {
      throw error;
    }
  }
);

export const updateServiceProcess = createAsyncThunk(
  "serviceProcess/updateServiceProcess",
  async ({ id, formData,token }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/service-process/${id}`,
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

export const deleteServiceProcess = createAsyncThunk(
  "serviceProcess/deleteServiceProcess",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5353/delete/service-process/${id}`);
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
  serviceProcesss: [],
  selectedServiceProcess: null, // For storing the service being edited
  serviceProcessData: [],
};

const ServiceProcessSlice = createSlice({
  name: "serviceProcess",
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    }
  },
    extraReducers: (builder) => {
    builder
      .addCase(createServiceProcess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServiceProcess.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
        state.successMessage = action.payload.message?.[0]?.value || "serviceProcess added successfully";
      })
      .addCase(createServiceProcess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add serviceProcess";
      })
      .addCase(getAllServiceProcess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllServiceProcess.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.serviceProcesss = action.payload;
      })
      .addCase(getAllServiceProcess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getServiceProcessById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceProcessById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedServiceProcess = action.payload;
      })
      .addCase(getServiceProcessById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateServiceProcess.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateServiceProcess.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;
        state.updateSuccess = true;
        state.successMessage = action.payload.message?.[0]?.value || "Update successful";
      })
      .addCase(updateServiceProcess.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.error.message;
        state.updateSuccess = false;
      })
      .addCase(deleteServiceProcess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteServiceProcess.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.serviceProcesss = state.serviceProcesss.filter(
          (service) => service._id !== action.payload
        );
      })
      .addCase(deleteServiceProcess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
      },
});
export const { clearUpdateStatus } = ServiceProcessSlice.actions;

export default ServiceProcessSlice.reducer;
