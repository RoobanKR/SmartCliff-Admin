import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../utils/utils";

// Async thunk to create a new address
export const createAddress = createAsyncThunk(
  "address/create",
  async (formData) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/address`, // Adjust the endpoint as necessary
        formData
      );
      return response.data; // Adjust based on your API response structure
    } catch (error) {
      throw new Error(error.response.data.message || "Failed to create address");
    }
  }
);

// Async thunk to get all addresses
export const getAllAddresses = createAsyncThunk(
  "address/getAll",
  async () => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/address`);
      return response.data.address; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to get an address by ID
export const getAddressById = createAsyncThunk(
  "address/getById",
  async (id) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getById/address/${id}`);
      return response.data.addressById; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to update an address
export const updateAddress = createAsyncThunk(
  "address/update",
  async ({ id, formData }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/address/${id}`,
        formData
      );
      return response.data; // Adjust based on your API response structure
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to delete an address
export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (id) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/address/${id}`);
      return id; // Return the ID of the deleted address
    } catch (error) {
      throw error;
    }
  }
);

// Initial state for the slice
const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  addresses: [],
  selectedAddress: null,
};

// Create the slice
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Address created successfully";
        state.addresses.push(action.payload.address); // Assuming the response contains the created address
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create address";
      })
      .addCase(getAllAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(getAllAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAddressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddressById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAddress = action.payload;
      })
      .addCase(getAddressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(address => address._id === action.payload.address._id);
        if (index !== -1) {
          state.addresses[index] = action.payload.address; // Update the address in the list
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(address => address._id !== action.payload); // Remove the deleted address
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default addressSlice.reducer;
