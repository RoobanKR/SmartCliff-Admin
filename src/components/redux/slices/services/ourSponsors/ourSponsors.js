import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

const initialState = {
  ourSponsors: [],
  selectedSponsor: null,
  loading: false,
  error: null,
};

export const createOurSponsors = createAsyncThunk(
  'ourSponsors/create',
  async (formData) => {
    const response = await axios.post(`${getAPIURL()}/create/our-sponsors`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

export const fetchAllOurSponsors = createAsyncThunk(
  'ourSponsors/fetchAll',
  async () => {
    const response = await axios.get(`${getAPIURL()}/getAll/our-sponsors`);
    return response.data.our_sponsors;
  }
);

export const fetchOurSponsorById = createAsyncThunk(
  'ourSponsors/fetchById',
  async (id) => {
    const response = await axios.get(`${getAPIURL()}/getById/our-sponsors/${id}`);
    return response.data.our_SponosorsById;
  }
);

export const updateOurSponsors = createAsyncThunk(
  'ourSponsors/update',
  async ({ id, formData }) => {
    const response = await axios.put(`${getAPIURL()}/update/our-sponsors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.ourSponsor;
  }
);

export const deleteOurSponsors = createAsyncThunk(
  'ourSponsors/delete',
  async (id) => {
    await axios.delete(`${getAPIURL()}/delete/our-sponsors/${id}`);
    return id; 
  }
);

const ourSponsorsSlice = createSlice({
  name: 'ourSponsors',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOurSponsors.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOurSponsors.fulfilled, (state, action) => {
        state.loading = false;
        state.ourSponsors.push(action.payload);
      })
      .addCase(createOurSponsors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllOurSponsors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOurSponsors.fulfilled, (state, action) => {
        state.loading = false;
        state.ourSponsors = action.payload;
      })
      .addCase(fetchAllOurSponsors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOurSponsorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOurSponsorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSponsor = action.payload;
      })
      .addCase(fetchOurSponsorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOurSponsors.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOurSponsors.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.ourSponsors.findIndex(sponsor => sponsor._id === action.payload._id);
        if (index !== -1) {
          state.ourSponsors[index] = action.payload;
        }
      })
      .addCase(updateOurSponsors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteOurSponsors.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOurSponsors.fulfilled, (state, action) => {
        state.loading = false;
        state.ourSponsors = state.ourSponsors.filter(sponsor => sponsor._id !== action.payload);
      })
      .addCase(deleteOurSponsors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = ourSponsorsSlice.actions;
export default ourSponsorsSlice.reducer;