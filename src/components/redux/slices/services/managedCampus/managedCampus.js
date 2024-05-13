import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

export const createManagedCampus = createAsyncThunk(
  "managedCampus/post",
  async (formData) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/managed_campus`,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response.data.message || "Failed to add managed Campus"
      );
    }
  }
);

export const getAllManagedCampuses = createAsyncThunk(
    'managedCampus/fetchAll',
    async (_, thunkAPI) => {
      try {
        const response = await axios.get(`${getAPIURL()}/getAll/managed_campus`);
        return response.data.getAllManagedCampus;
      } catch (error) {
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
  );
  export const getManagedCampusById = createAsyncThunk(
    'managedCampus/fetchById',
    async (id, thunkAPI) => {
      try {
        const response = await axios.get(`${getAPIURL()}/getById/managed_campus/${id}`);
        return response.data.managedCampusById;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
    }
  );
  // Define the async thunk for updating a managed campus
  export const updateManagedCampus = createAsyncThunk(
    'managedCampus/update',
    async ({ id, formData }, thunkAPI) => {
      try {
        const response = await axios.put(`${getAPIURL()}/update/managed_campus/${id}`, formData);
        return response.data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
    }
  );
  
  // Define the async thunk for deleting a managed campus
  export const deleteManagedCampus = createAsyncThunk(
    'managedCampus/delete',
    async (id, thunkAPI) => {
      try {
        const response = await axios.delete(`${getAPIURL()}/delete/managed_campus/${id}`);
        return response.data.deletedManagedCampus;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
    }
  );
  
const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  managedCampuses: [],
  managedCampusById: null,

};

const managedCampusSlice = createSlice({
  name: "managedCampus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createManagedCampus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createManagedCampus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Managed campus added successfully";
      })
      .addCase(createManagedCampus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add Managed campus";
      })
      .addCase(getAllManagedCampuses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllManagedCampuses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.managedCampuses = action.payload;
      })
      .addCase(getAllManagedCampuses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error;
      })
        .addCase(getManagedCampusById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getManagedCampusById.fulfilled, (state, action) => {
          state.loading = false;
          state.managedCampusById = action.payload;
        })
        .addCase(getManagedCampusById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })  
      .addCase(updateManagedCampus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateManagedCampus.fulfilled, (state, action) => {
        state.loading = false;
        state.managedCampusByid = action.payload;
      })
      .addCase(updateManagedCampus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteManagedCampus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteManagedCampus.fulfilled, (state, action) => {
        state.loading = false;
        state.managedCampusByid = null; 
      })
      .addCase(deleteManagedCampus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default managedCampusSlice.reducer;
