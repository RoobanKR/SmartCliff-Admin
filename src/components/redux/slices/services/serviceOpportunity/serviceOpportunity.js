import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

export const createServiceOpportunity = createAsyncThunk(
  "serviceOpportunities/createServiceOpportunity",
  async ({formData,token}) => {
    try {
      const response = await Axios.post(
        `${getAPIURL()}/create/service/opportunities`,
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
      throw error.response ? error.response.data : error;
    }
  }
);

export const getAllServiceOpportunities = createAsyncThunk(
    "serviceOpportunities/getAll",
    async () => {
      try {
        const response = await Axios.get(`${getAPIURL()}/getAll/service/opportunities`);
        return response.data.getAllServiceOpportunity;
      } catch (error) {
        throw error;
      }
    }
  );
  
export const getServiceOpportunityById = createAsyncThunk(
    "serviceOpportunities/fetchById",
    async (serviceOpportunityId, { rejectWithValue }) => {
      try {
        const response = await Axios.get(
          `${getAPIURL()}/getById/service/opportunities/${serviceOpportunityId}`,
        );
        
        if (response.data && response.data.ServiceOpportunityById) {
          return response.data.ServiceOpportunityById;
        } else {
          return rejectWithValue("Service opportunity data not found");
        }
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || 
          "Error fetching service opportunity details"
        );
      }
    }
  );
  
export const updateServiceOpportunity = createAsyncThunk(
  "serviceOpportunities/update",
  async ({ serviceOpportunityId, formData }) => {
    try {
      const response = await Axios.put(
        `${getAPIURL()}/update/service/opportunities/${serviceOpportunityId}`,
        formData
      );
      return response.data;
    } catch (error) {
      throw Error("Error updating ServiceOpportunities");
    }
  }
);

export const deleteServiceOpportunity = createAsyncThunk(
    "serviceOpportunities/delete",
    async (id) => {
      try {
        await Axios.delete(`${getAPIURL()}/delete/service/opportunities/${id}`);
        return id;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    }
  );
  
const serviceOpportunitiesSlice = createSlice({
  name: "serviceOpportunities",
  initialState: {
    loading: false,
    error: null,
    successMessage: "",
    serviceOpportunities: [],
    serviceOpportunity: {},
    ServiceOpportunityById: null,
    updateSuccess: false,
    updateError: null
  },
  reducers: {
    clearUpdateStatus: (state) => {
        state.updateSuccess = false;
        state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createServiceOpportunity.pending, (state) => {
      state.loading = true;
      state.isSuccess = false;
      state.error = false;
    });
    builder.addCase(createServiceOpportunity.fulfilled, (state) => {
      state.loading = false;
      state.isSuccess = true;
      state.error = false;
    });
    builder.addCase(createServiceOpportunity.rejected, (state, action) => {
      state.loading = false;
      state.isSuccess = false;
      state.error = true;
      state.error = action.payload
        ? action.payload.errorMessage
        : action.error.message;
    });
    builder.addCase(getAllServiceOpportunities.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(getAllServiceOpportunities.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceOpportunities = action.payload;
    });
    builder.addCase(getAllServiceOpportunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
    });
    builder.addCase(getServiceOpportunityById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getServiceOpportunityById.fulfilled, (state, action) => {
        state.loading = false;
        state.ServiceOpportunityById = action.payload;
        state.error = null;
      });
    builder.addCase(getServiceOpportunityById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateServiceOpportunity.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.updateSuccess = false;
    });
    builder.addCase(updateServiceOpportunity.fulfilled, (state, action) => {
      state.loading = false;
      state.serviceOpportunity = action.payload;  // Store updated opportunity data
      state.updateSuccess = true;
      state.successMessage = action.payload.message || "Update successful";
    });
    builder.addCase(updateServiceOpportunity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.updateSuccess = false;
    });
    builder.addCase(deleteServiceOpportunity.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(deleteServiceOpportunity.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceOpportunities = state.serviceOpportunities.filter(
          (item) => item._id !== action.payload
        );
    });
    builder.addCase(deleteServiceOpportunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
    });
  },
});

export const { clearUpdateStatus } = serviceOpportunitiesSlice.actions;

export const selectServiceOpportunitiesState = (state) =>
    state.serviceOpportunity;
  
export default serviceOpportunitiesSlice.reducer;