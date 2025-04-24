import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../utils/utils';

const initialState = {
  contactPages: [],
  selectedContactPage: null,
  loading: false,
  error: null,
};

// Create a new contact page
export const createContactPage = createAsyncThunk(
  'contactPage/create',
  async (formData) => {
    const response = await axios.post(`${getAPIURL()}/create/contact-page`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// Get all contact pages
export const getAllContactPages = createAsyncThunk(
  'contactPage/fetchAll',
  async () => {
    const response = await axios.get(`${getAPIURL()}/getAll/contact-page`);
    return response.data.getAllContactPages;
  }
);

// Get a contact page by ID
export const getContactPageById = createAsyncThunk(
  'contactPage/fetchById',
  async (id) => {
    const response = await axios.get(`${getAPIURL()}/getById/contact-page/${id}`);
    return response.data.contactPageById;
  }
);

// Update a contact page
export const updateContactPage = createAsyncThunk(
  'contactPage/update',
  async ({ id, formData }) => {
    const response = await axios.put(`${getAPIURL()}/update/contact-page/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// Delete a contact page
export const deleteContactPage = createAsyncThunk(
  'contactPage/delete',
  async (id) => {
    await axios.delete(`${getAPIURL()}/delete/contact-page/${id}`);
    return id; 
  }
);

const contactPageSlice = createSlice({
  name: 'contactPage',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContactPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContactPage.fulfilled, (state, action) => {
        state.loading = false;
        state.contactPages.push(action.payload);
      })
      .addCase(createContactPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllContactPages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllContactPages.fulfilled, (state, action) => {
        state.loading = false;
        state.contactPages = action.payload;
      })
      .addCase(getAllContactPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getContactPageById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContactPageById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedContactPage = action.payload;
      })
      .addCase(getContactPageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateContactPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateContactPage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contactPages.findIndex(contactPage => contactPage._id === action.payload._id);
        if (index !== -1) {
          state.contactPages[index] = action.payload;
        }
      })
      .addCase(updateContactPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteContactPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContactPage.fulfilled, (state, action) => {
        state.loading = false;
        state.contactPages = state.contactPages.filter(contactPage => contactPage._id !== action.payload);
      })
      .addCase(deleteContactPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = contactPageSlice.actions;
export default contactPageSlice.reducer;