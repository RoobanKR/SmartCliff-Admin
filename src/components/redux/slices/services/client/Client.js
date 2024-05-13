import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

export const createClient = createAsyncThunk(
  "client/post",
  async (formData) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/client`,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || "Failed to add client");
    }
  }
);

export const getAllClient = createAsyncThunk("client/getAll", async () => {
  try {
    const response = await axios.get(`${getAPIURL()}/getAll/client`);
    return response.data.AllCompanyLogos;
  } catch (error) {
    throw error;
  }
});
export const getClientById = createAsyncThunk("client/getById", async (id) => {
  try {
    const response = await axios.get(
      `${getAPIURL()}/getById/client/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
});
export const updateClient = createAsyncThunk(
  "client/updateClient",
  async ({ clientId, formData }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/client/${clientId}`,
        formData
      );
      return response.data.client;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteClient = createAsyncThunk(
  "client/deleteClient",
  async (clientId) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/client/${clientId}`);
      return clientId;
    } catch (error) {
      throw error;
    }
  }
);
const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  clients: [],
  selectedClientById: null,
  serviceData: [],
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "client added successfully";
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add client";
      })
      .addCase(getAllClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.clients = action.payload;
      })
      .addCase(getAllClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedClientById = action.payload.companyLogoById;
      })
      .addCase(getClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.clients = action.payload;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default clientSlice.reducer;
