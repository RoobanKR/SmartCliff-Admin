import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

// Async thunk to create eligibility criteria
export const createEligibilityCriteria = createAsyncThunk(
  'eligibilityCriteria/post',
  async ({token,formData}) => {
    try {
      const response = await axios.post(`${getAPIURL()}/create/eligibility`,
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
      throw new Error(error.response.data.message || 'Failed to add eligibility criteria');
    }
  }
);

// Async thunk to fetch all eligibility criteria
export const getAllEligibilityCriteria = createAsyncThunk(
    'eligibilityCriteria/getAll',
    async () => {
      try {
        const response = await axios.get(`${getAPIURL()}/getAll/eligibility`);
        return response.data.allEligibilityCriteria;
      } catch (error) {
        throw error;
      }
    }
  );

// Async thunk to fetch eligibility criteria by ID
export const getEligibilityCriteriaById = createAsyncThunk(
  'eligibilityCriteria/getByid',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getById/eligibility/${id}`);
      return response.data; // Return the entire response data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Async thunk to update eligibility criteria
export const updateEligibilityCriteria = createAsyncThunk(
  'eligibilityCriteria/updateEligibilityCriteria',
  async ({ id,token, formData }) => {
    try {
      const response = await axios.put(`${getAPIURL()}/update/eligibility/${id}`, formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
      );
      return response.data.eligibilityCriteria;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to delete eligibility criteria
export const deleteEligibilityCriteria = createAsyncThunk(
  'eligibilityCriteria/deleteEligibilityCriteria',
  async ({token,id}) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/eligibility/${id}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }

      );
      return id;
    } catch (error) {
      throw error;
    }
  }
);

// Define the initial state
const initialState = {
  loading: false,
  error: null,
  successMessage: '',
  eligibilityCriteria: [], // Updated key name
  selectedEligibilityCriteria: null, // Corrected spelling
};

// Create an eligibilityCriteria slice
const eligibilityCriteriaSlice = createSlice({
  name: 'eligibilityCriteria',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEligibilityCriteria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEligibilityCriteria.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Eligibility criteria added successfully';
      })
      .addCase(createEligibilityCriteria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add eligibility criteria';
      })
      .addCase(getAllEligibilityCriteria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEligibilityCriteria.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.eligibilityCriteria = action.payload; // Updated state key
      })
      .addCase(getAllEligibilityCriteria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getEligibilityCriteriaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEligibilityCriteriaById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedEligibilityCriteria = action.payload.eligibilityCriteriaById; // Update state correctly
      })
      .addCase(getEligibilityCriteriaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateEligibilityCriteria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEligibilityCriteria.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.eligibilityCriteria = action.payload;
      })
      .addCase(updateEligibilityCriteria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteEligibilityCriteria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEligibilityCriteria.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Remove the deleted eligibility criteria from the state if needed
      })
      .addCase(deleteEligibilityCriteria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default eligibilityCriteriaSlice.reducer;
