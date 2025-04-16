import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../utils/utils";


export const createGallery = createAsyncThunk("gallery/createGallery", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${getAPIURL()}/create/gallery`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to upload gallery");
  }
});

export const getAllGallery = createAsyncThunk("gallery/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${getAPIURL()}/getAll/gallery`);
    return response.data.Gallery;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteGallery = createAsyncThunk("gallery/delete", async ({ galleryId, token }, { rejectWithValue }) => {
  try {
    await axios.delete(`${getAPIURL()}/delete/gallery/${galleryId}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return galleryId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getGalleryById = createAsyncThunk("gallery/getGalleryById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${getAPIURL()}/getById/gallery/${id}`);
    return response.data.galleryById;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error fetching gallery");
  }
});

export const updateGallery = createAsyncThunk("gallery/updateGallery", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${getAPIURL()}/update/gallery/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.updated_gallery;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error updating gallery");
  }
});


const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    loading: false,
    success: false,
    error: null,
    gallery:[] ,
    updateSuccess: false, // Add updateSuccess state

  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.updateSuccess = false; // Reset update success state
    },
    clearUpdateStatus: (state) => {
      state.updateSuccess = false; // Reset updateSuccess after showing the toaster
    },
    },
  extraReducers: (builder) => {
    builder
      .addCase(createGallery.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createGallery.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(createGallery.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(getAllGallery.fulfilled, (state, action) => {
        state.gallery = action.payload;
        state.status = "success";
      })
      .addCase(getAllGallery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getGalleryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGalleryById.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery = action.payload; // Store the fetched gallery object correctly
      })
      .addCase(getGalleryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.gallery = state.gallery.filter((item) => item._id !== action.payload);
      })
      .addCase(updateGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateGallery.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true; // Set updateSuccess to true
      })
      .addCase(updateGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      });
  },
  
});

export const { resetState, clearUpdateStatus } = gallerySlice.actions;
export default gallerySlice.reducer;
