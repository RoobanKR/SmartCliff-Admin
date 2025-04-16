import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";


// Async thunks
export const getAllAboutUs = createAsyncThunk(
  "aboutUs/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/about/aboutus`);
      return response.data.getAllAboutUs || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  }
);

export const createAboutUs = createAsyncThunk(
  "aboutUs/create",
  async ({token, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${getAPIURL()}/create/about/aboutus`, formData, 
        {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
                });
      return response.data.newAboutUs;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create data");
    }
  }
);

export const deleteAboutUs = createAsyncThunk(
  "aboutUs/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/about/aboutus/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete");
    }
  }
);

export const updateAboutUs = createAsyncThunk(
  "aboutUs/update",
  async ({token, id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${getAPIURL()}/update/about/aboutus/${id}`, formData,  {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
            });
      return response.data.updatedAboutUs;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

const aboutUsSlice = createSlice({
  name: "aboutUs",
  initialState: {
    aboutUss: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAboutUs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAboutUs.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutUss = action.payload;
      })
      .addCase(getAllAboutUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAboutUs.fulfilled, (state, action) => {
        state.aboutUss.push(action.payload);
      })
      .addCase(deleteAboutUs.fulfilled, (state, action) => {
        state.aboutUss = state.aboutUss.filter((item) => item._id !== action.payload);
      })
      .addCase(updateAboutUs.fulfilled, (state, action) => {
        state.aboutUss = state.aboutUss.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      });
  },
});

export default aboutUsSlice.reducer;
