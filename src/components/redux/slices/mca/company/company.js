import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

const initialState = {
  companies: [],
  selectedCompany: null,
  loading: false,
  error: null,
  isSuccess: false, // Add this line

};

export const createCompany = createAsyncThunk(
  'companies/create',
  async (formData) => {
    const response = await axios.post(`${getAPIURL()}/create/degreeprogram/company`, formData);
    return response.data;
  }
);
export const getAllCompanies = createAsyncThunk(
  'companies/fetchAll',
  async () => {
    const response = await axios.get(`${getAPIURL()}/getAll/degreeprogram/company`);
    return response.data.companys; // Adjust based on your API response structure
  }
);

export const getCompanyById = createAsyncThunk(
  'companies/fetchById',
  async (companyId) => {
    const response = await axios.get(`${getAPIURL()}/getById/degreeprogram/company/${companyId}`);
    return response.data.companyById; // Adjust based on your API response structure
  }
);

export const updateCompany = createAsyncThunk(
  'companies/update',
  async ({ id, formData }) => {
    const response = await axios.put(`${getAPIURL()}/update/degreeprogram/company/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

export const deleteCompany = createAsyncThunk(
  'companies/delete',
  async (deleteId) => {
    await axios.delete(`${getAPIURL()}/delete/degreeprogram/company/${deleteId}`);
    return deleteId; 
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true; // Add this line
        state.companies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isSuccess = false; // Add this line
      })
      .addCase(getAllCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(getAllCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getCompanyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCompany = action.payload;
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.companies.findIndex(company => company._id === action.payload._id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(company => company._id !== action.payload);
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = companiesSlice.actions;
export default companiesSlice.reducer;