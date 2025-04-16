import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

// Define the initial state
const initialState = {
  ourPartners: [],
  selectedPartner: null,
  loading: false,
  error: null,
};

// Async thunk for creating a new partner
export const createOurPartners = createAsyncThunk(
  'ourPartners/create',
  async (formData) => {
    const response = await axios.post(`${getAPIURL()}/create/our-partners`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// Async thunk for fetching all partners
export const fetchAllOurPartners = createAsyncThunk(
  'ourPartners/fetchAll',
  async () => {
    const response = await axios.get(`${getAPIURL()}/getAll/our-partners`);
    return response.data.our_partners;
  }
);

// Async thunk for fetching a partner by ID
export const fetchOurPartnerById = createAsyncThunk(
  'ourPartners/fetchById',
  async (id) => {
    const response = await axios.get(`${getAPIURL()}/getById/our-partners/${id}`);
    return response.data.our_PartnersById;
  }
);

// Async thunk for updating a partner
export const updateOurPartners = createAsyncThunk(
  'ourPartners/update',
  async ({ id, formData }) => {
    const response = await axios.put(`${getAPIURL()}/update/our-partners/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.ourPartner;
  }
);

// Async thunk for deleting a partner
export const deleteOurPartners = createAsyncThunk(
  'ourPartners/delete',
  async (id) => {
    await axios.delete(`${getAPIURL()}/delete/our-partners/${id}`);
    return id; // Return the ID of the deleted partner
  }
);

// Create the slice
const ourPartnersSlice = createSlice({
  name: 'ourPartners',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOurPartners.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOurPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.ourPartners.push(action.payload);
      })
      .addCase(createOurPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllOurPartners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOurPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.ourPartners = action.payload;
      })
      .addCase(fetchAllOurPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOurPartnerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOurPartnerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPartner = action.payload;
      })
      .addCase(fetchOurPartnerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOurPartners.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOurPartners.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.ourPartners.findIndex(partner => partner._id === action.payload._id);
        if (index !== -1) {
          state.ourPartners[index] = action.payload;
        }
      })
      .addCase(updateOurPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteOurPartners.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOurPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.ourPartners = state.ourPartners.filter(partner => partner._id !== action.payload);
      })
      .addCase(deleteOurPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the actions and reducer
export const { clearError } = ourPartnersSlice.actions;
export default ourPartnersSlice.reducer;