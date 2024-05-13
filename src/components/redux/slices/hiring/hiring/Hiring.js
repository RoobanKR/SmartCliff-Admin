import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

export const getAllHiring = createAsyncThunk("hiring/getAll", async () => {
  try {
    const response = await axios.get(`${getAPIURL()}/getAll/hiring`);
    return response.data.All_hiring;
  } catch (error) {
    throw error;
  }
});



export const fetchHiringById = createAsyncThunk(
  "hiring/fetchById",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5353/getById/hiring/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.hiring_Id_Base;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for updating hiring data
export const updateHiring = createAsyncThunk(
  "hiring/update",
  async ({ id, formData, token }, thunkAPI) => {
    try {
      const response = await axios.put(`http://localhost:5353/update/hiring/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteHiring = createAsyncThunk(
  "hiring/deleteHiring",
  async ({ token, id }) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/eligibility/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
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
  hiring: [], // Ensure this matches the structure of data returned by getAllHiring
  selectedHiring: null,
};

const hiringSlice = createSlice({
  name: "hiring",
  initialState,
  reducers: {
    resetHiringData(state) {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllHiring.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHiring.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.hiring = action.payload;
      })
      .addCase(getAllHiring.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchHiringById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHiringById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchHiringById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateHiring.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateHiring.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateHiring.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteHiring.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHiring.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteHiring.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { resetHiringData } = hiringSlice.actions;

export default hiringSlice.reducer;
