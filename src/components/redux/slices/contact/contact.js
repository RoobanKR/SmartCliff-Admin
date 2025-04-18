import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../utils/utils";


export const getAllContact = createAsyncThunk("contact/getAll", async () => {
  try {
    const response = await axios.get(`${getAPIURL()}/getAll/contact`);
    return response.data.allContact;
  } catch (error) {
    throw error;
  }
});
export const getContactById = createAsyncThunk("contact/getById", async (id) => {
  try {
    const response = await axios.get(
      `${getAPIURL()}/getById/contact/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const deleteContact = createAsyncThunk(
  "contact/deleteContact",
  async (contactId) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/contact/${contactId}`);
      return contactId;
    } catch (error) {
      throw error;
    }
  }
);


export const sendEmailToContactApplicants = createAsyncThunk(
  "contact/sendEmail",
  async ({ subject, message, contactIds }) => {
    try {
      const response = await axios.post(`${getAPIURL()}/contact/response-mail/applicants`, {
        subject,
        message,
        contactIds,
      });
      return response.data; // Return the response data
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  contacts: [],
  selectedContactById: null,
  serviceData: [],
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllContact.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.contacts = action.payload;
      })
      .addCase(getAllContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedContactById = action.payload.contactById;
      })
      .addCase(getContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendEmailToContactApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendEmailToContactApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // You can handle any success message or state update here if needed
      })
      .addCase(sendEmailToContactApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

  },
});

export default contactSlice.reducer;

