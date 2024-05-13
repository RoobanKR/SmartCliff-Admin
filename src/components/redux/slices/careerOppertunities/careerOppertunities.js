import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import { getAPIURL } from '../../../../utils/utils';

// Define the async thunk to add career opportunities
export const addCareerOpportunities = createAsyncThunk(
  "careerOpportunities/addCareerOpportunities",
  async ({formData,token}) => {
    try {
      const response = await Axios.post(`${getAPIURL()}/create/careeroppertunities`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Assuming the API returns data
    } catch (error) {
      throw error;
    }
  }
);

export const fetchCareerOpportunities = createAsyncThunk(
  "careerOpportunities/fetchCareerOpportunities",
  async () => {
    try {
      const response = await Axios.get(`${getAPIURL()}/getAll/careeroppertunities`
      );
      return response.data.careerOpportunities;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchCareerOpportunityById = createAsyncThunk(
  "careerOpportunities/fetchById",
  async (careeroppId) => {
    try {
      const response = await Axios.get(`${getAPIURL()}/getById/careeroppertunities/${careeroppId}`
      );
      return response.data.careerOpportunity;
    } catch (error) {
      throw Error("Error fetching career opportunity details");
    }
  }
);

export const updateCareerOpportunity = createAsyncThunk(
  "careerOpportunities/update",
  async ({token, careeroppId, formData }) => {
    try {
      const response = await Axios.put(`${getAPIURL()}/update/careeroppertunities/${careeroppId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.careerOpportunity;
    } catch (error) {
      throw Error("Error updating career opportunity");
    }
  }
);
export const deleteCareerOpportunity = createAsyncThunk(
  "careerOpportunities/deleteCareerOpportunity",
  async ({ opportunityId, token }) => {
    try {
      const response = await Axios.delete(
        `${getAPIURL()}/delete/careeroppertunities/${opportunityId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return opportunityId; // Return the deleted career opportunity ID
    } catch (error) {
      throw new Error("Error deleting career opportunity"); // Use 'new Error' instead of 'throw Error'
    }
  }
);

// Create the career opportunities slice
const careerOpportunitiesSlice = createSlice({
  name: "careerOpportunities",
  initialState: {
    status: "idle",
    error: null,
    opportunitiesData: [],
    careerOpportunity: {}, // Provide a default empty object
  },
  reducers: {
    // You can add other reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCareerOpportunities.pending, (state) => {
        state.status = "loading";
        state.error = null; // Reset error when starting to fetch
      })
      .addCase(addCareerOpportunities.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addCareerOpportunities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCareerOpportunities.pending, (state) => {
        state.status = "loading";
        state.error = null; // Reset error when starting to fetch
      })
      .addCase(fetchCareerOpportunities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.opportunitiesData = action.payload;
      })
      .addCase(fetchCareerOpportunities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCareerOpportunityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      .addCase(fetchCareerOpportunityById.fulfilled, (state, action) => {
        state.loading = false;
        state.careerOpportunity = action.payload;
      })
      .addCase(fetchCareerOpportunityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCareerOpportunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCareerOpportunity.fulfilled, (state, action) => {
        state.loading = false;
        state.careerOpportunity = action.payload;
      })
      .addCase(updateCareerOpportunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCareerOpportunity.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCareerOpportunity.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Remove the deleted career opportunity from the state
        state.opportunitiesData = state.opportunitiesData.filter(
          (opp) => opp.id !== action.payload
        );
      })
      .addCase(deleteCareerOpportunity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer, actions, and selector
export const {
  /* Other reducers if needed */
} = careerOpportunitiesSlice.actions;
export const selectCareerOpportunitiesError = (state) =>
  state.careerOpportunities.error;
export const selectCareerOpportunities = (state) =>
  state.careerOpportunities.opportunitiesData;

export default careerOpportunitiesSlice.reducer;
