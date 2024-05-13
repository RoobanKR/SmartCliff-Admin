import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

export const createTestimonial = createAsyncThunk(
  "testimonial/post",
  async (formData) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/service_testimonial`,
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

export const getAllTestimonial = createAsyncThunk(
  "testimonial/getAll",
  async () => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getAll/service_testimonial`
      );
      return response.data.getAllTestimonial;
    } catch (error) {
      throw error;
    }
  }
);
export const getTestimonialById = createAsyncThunk(
  "testimonial/getById",
  async (id) => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getById/service_testimonial/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
export const updateTestimonial = createAsyncThunk(
  "testimonial/updateTestimonial",
  async ({ id, formData }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/service_testimonial/${id}`,
        formData
      );
      return response.data.testimonial;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteTestimonial = createAsyncThunk(
  "testimonial/deleteTestimonial",
  async (id) => {
    try {
      await axios.delete(
        `${getAPIURL()}/delete/service_testimonial/${id}`
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
  testimonials: [],
  selectedTestimonialById: null,
  serviceData: [],
};

const TestimonialSlice = createSlice({
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
      .addCase(getAllTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.testimonials = action.payload;
      })
      .addCase(getAllTestimonial.rejected, (state, action) => {
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
        state.selectedTestimonialById = action.payload.testimonialById;
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
        state.testimonials = action.payload;
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
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default TestimonialSlice.reducer;
