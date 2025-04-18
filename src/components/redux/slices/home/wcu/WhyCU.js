import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

// Async Thunks
export const getAllWCU = createAsyncThunk("wcu/getAll", async () => {
  try {
    const response = await axios.get(`${getAPIURL()}/getAll/wcu`);
    return response.data.getAllWCU;
  } catch (error) {
    throw error;
  }
});

export const getWCUById = createAsyncThunk("wcu/getById", async (id) => {
  try {
    const response = await axios.get(`${getAPIURL()}/getById/wcu/${id}`);
    return response.data.wcuById;
  } catch (error) {
    throw error;
  }
});

export const createWCU = createAsyncThunk("wcu/create", async (wcuData) => {
  try {
    const response = await axios.post(`${getAPIURL()}/create/wcu`, wcuData);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const updateWCU = createAsyncThunk(
  "wcu/update",
  async ({ id, wcuData }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/wcu/${id}`,
        wcuData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteWCU = createAsyncThunk("wcu/delete", async (id) => {
  try {
    await axios.delete(`${getAPIURL()}/delete/wcu/${id}`);
    return id;
  } catch (error) {
    throw error;
  }
});

// Initial State
const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  wcuList: [],
  selectedWCU: null,
};

// WCU Slice
const wcuSlice = createSlice({
  name: "wcu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllWCU.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWCU.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.wcuList = action.payload;
      })
      .addCase(getAllWCU.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getWCUById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWCUById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedWCU = action.payload;
      })
      .addCase(getWCUById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createWCU.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWCU.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMessage = action.payload.message[0].value;
      })
      .addCase(createWCU.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateWCU.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWCU.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMessage = action.payload.message[0].value;
      })
      .addCase(updateWCU.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteWCU.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWCU.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.wcuList = state.wcuList.filter(
          (wcu) => wcu._id !== action.payload
        );
      })
      .addCase(deleteWCU.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default wcuSlice.reducer;
