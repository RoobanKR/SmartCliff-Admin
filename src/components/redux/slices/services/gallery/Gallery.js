import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

export const createGallery = createAsyncThunk(
  "gallery/post",
  async (formData) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/service_gallery`,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response.data.message || "Failed to add gallery"
      );
    }
  }
);

export const getAllGallery = createAsyncThunk(
  "gallery/getAll",
  async () => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getAll/service_gallery`
      );
      return response.data.getAllGallery;
    } catch (error) {
      throw error;
    }
  }
);
export const getGalleryById = createAsyncThunk(
  "gallery/getById",
  async (id) => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getById/service_gallery/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
export const updateGallery = createAsyncThunk(
  "gallery/updateGallery",
  async ({ id, formData }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/service_gallery/${id}`,
        formData
      );
      return response.data.gallery;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteGallery = createAsyncThunk(
  "gallery/deleteGallery",
  async (id) => {
    try {
      await axios.delete(
        `${getAPIURL()}/delete/service_gallery/${id}`
      );
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
  galleries: [],
  selectedGallery: null,
  serviceData: [],
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "gallery added successfully";
      })
      .addCase(createGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add gallery";
      })
      .addCase(getAllGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.galleries = action.payload;
      })
      .addCase(getAllGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getGalleryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGalleryById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedGallery = action.payload.galleryById;
      })
      .addCase(getGalleryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.galleries = action.payload;
      })
      .addCase(updateGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default gallerySlice.reducer;
