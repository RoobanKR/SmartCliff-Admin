import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

export const createTestimonial = createAsyncThunk(
  "testimonial/post",
  async (formData) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/bussiness_placements`,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response.data.message || "Failed to add testimonial"
      );
    }
  }
);

export const getAllTestimonials = createAsyncThunk(
  "testimonials/getAll",
  async () => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getAll/bussiness_placements`
      );
      return response.data.getAllPlacements;
    } catch (error) {
      throw error;
    }
  }
);

export const getTestimonialById = createAsyncThunk(
  "testimonials/getById",
  async (id) => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getById/bussiness_placements/${id}`
      );
      return response.data.placement_ById;
    } catch (error) {
      throw error;
    }
  }
);

export const updateTestimonial = createAsyncThunk(
  "testimonials/update",
  async ({ id, formData }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/bussiness_placements/${id}`,
        formData
      );
      return response.data.message;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteTestimonial = createAsyncThunk(
  "testimonials/delete",
  async (id) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/bussiness_placements/${id}`);
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
  testimonials: [],
  selectedTestimonialById: null,
  placementTestimonials: [],
};

const placementTestimonialSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "testimonial added successfully";
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add testimonial";
      })
      .addCase(getAllTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.placementTestimonials = action.payload;
      })
      .addCase(getAllTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getTestimonialById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTestimonialById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedTestimonialById = action.payload;
      })
      .addCase(getTestimonialById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMessage = action.payload;
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMessage = action.payload;
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default placementTestimonialSlice.reducer;
