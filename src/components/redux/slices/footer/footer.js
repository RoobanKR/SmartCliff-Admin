import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../utils/utils';

// Async thunk to create a footer
export const createFooter = createAsyncThunk(
  'footer/create',
  async (formData) => {
    try {
      const response = await axios.post(`${getAPIURL()}/create/footer`, formData);
      return response.data; 
    } catch (error) {
      throw new Error(error.response.data.message || 'Failed to create footer');
    }
  }
);

export const getAllFooters = createAsyncThunk(
  'footer/getAll',
  async () => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/footer`);
      return response.data.getAllFooter; 
    } catch (error) {
      throw error;
    }
  }
);

export const getFooterById = createAsyncThunk(
  'footer/getById',
  async (id) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getById/footer/${id}`);
      return response.data.footer;
    } catch (error) {
      throw error;
    }
  }
);

export const updateFooter = createAsyncThunk(
  'footer/update',
  async ({ id, formData }) => {
    try {
      const response = await axios.put(`${getAPIURL()}/update/footer/${id}`, formData);
      return response.data.data; 
    } catch (error) {
      throw error; 
    }
  }
);

export const deleteFooter = createAsyncThunk(
  'footer/delete',
  async (id) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/footer/${id}`);
      return id; 
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  footers: [],
  selectedFooter: null,
};

const footerSlice = createSlice({
  name: 'footer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createFooter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFooter.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Footer created successfully";
        state.footers.push(action.payload.data);
      })
      .addCase(createFooter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create footer";
      })
      .addCase(getAllFooters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFooters.fulfilled, (state, action) => {
        state.loading = false;
        state.footers = action.payload;
      })
      .addCase(getAllFooters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getFooterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFooterById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFooter = action.payload;
      })
      .addCase(getFooterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateFooter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFooter.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.footers.findIndex(footer => footer._id === action.payload._id);
        if (index !== -1) {
          state.footers[index] = action.payload;
        }
      })
      .addCase(updateFooter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; 
      })
      .addCase(deleteFooter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFooter .fulfilled, (state, action) => {
        state.loading = false;
        state.footers = state.footers.filter(footer => footer._id !== action.payload); 
      })
      .addCase(deleteFooter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default footerSlice.reducer;