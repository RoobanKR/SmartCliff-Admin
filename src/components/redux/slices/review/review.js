import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import { getAPIURL } from "../../../../utils/utils";

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async ({formData,token}) => {
    try {
      const response = await Axios.post(
        `${getAPIURL()}/create/review`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
);

export const getAllReview = createAsyncThunk(
  "reviews/getAllReview",
  async () => {
    try {
      const response = await Axios.get(
        `${getAPIURL()}/getAll/review`
      );
      return response.data.getAllReview;
    } catch (error) {
      throw error;
    }
  }
);

export const getReviewById = createAsyncThunk(
  "reviews/fetchById",
  async (reviewId) => {
    try {
      const response = await Axios.get(
        `${getAPIURL()}/getById/review/${reviewId}`
      );
      return response.data.reviewById;
    } catch (error) {
      throw Error("Error fetching Review details");
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/update",
  async ({ reviewId, formData,token }) => {
    try {
      const response = await Axios.put(
        `${getAPIURL()}/update/review/${reviewId}`,
        formData,
        {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
      );
      return response.data.review;
    } catch (error) {
      throw Error("Error updating Review");
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async ({ reviewId, token }) => {
    try {
      const response = await Axios.delete(
        `${getAPIURL()}/delete/review/${reviewId}`,
        {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
      );

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: "",
    reviews: [],
    allReview: {},
    reviewById: null,
  },
  reducers: {
    resetReview: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = "";
    },
    clearUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createReview.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(createReview.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(createReview.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.error = action.payload
        ? action.payload.errorMessage
        : action.error.message;
    });
    builder.addCase(getAllReview.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(getAllReview.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.reviews = action.payload;
    });
    builder.addCase(getAllReview.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(getReviewById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getReviewById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reviewById = action.payload;
    });
    builder.addCase(getReviewById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateReview.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.updateSuccess = false;

    });
    builder.addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.review = action.payload;
        state.updateSuccess = true;
        state.isSuccess = true; // Add this line
        state.successMessage = action.payload.message || "Review Updated successfully";
      });
              builder.addCase(updateReview.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
      state.updateSuccess = false;

    });
    builder.addCase(deleteReview.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(deleteReview.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(deleteReview.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.error = action.payload
        ? action.payload.errorMessage
        : action.error.message;
    });
  },
});

export const { resetReview,clearUpdateStatus } = reviewSlice.actions;

export const selectReviewState = (state) =>
  state.allReview;

export default reviewSlice.reducer;
