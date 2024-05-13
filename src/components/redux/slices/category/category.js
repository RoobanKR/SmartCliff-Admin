import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import { successToast, errorToast } from "../../../toaster/index";
import { getAPIURL } from '../../../../utils/utils';

// Define the async thunk to fetch category data
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async () => {
    try {
      const response = await Axios.get(`${getAPIURL()}/getAll/category`);
      return response.data.Category;
    } catch (error) {
      throw error;
    }
  }
);

// Define the async thunk to add a new category
export const addCategory = createAsyncThunk(
  "category/addCategory",
  async ({ formData, token }) => {
    try {
      const response = await Axios.post(`${getAPIURL()}/create/category`,
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
      throw error;
    }
  }
);
export const fetchCategoryById = createAsyncThunk(
  "category/fetchById",
  async (categoryId) => {
    try {
      const response = await Axios.get(`${getAPIURL()}/getById/category/${categoryId}`
      );
      return response.data.Category;
    } catch (error) {
      throw Error("Error fetching category details");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ categoryId, formData,token }) => {
    try {
      const response = await Axios.put(`${getAPIURL()}/update/category/${categoryId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.Category;
    } catch (error) {
      throw Error("Error updating category");
    }
  }
);
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async ({categoryId,token}) => {
    try {
      const response = await Axios.delete(`${getAPIURL()}/delete/category/${categoryId}`,
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
      throw Error("Error deleting category");
    }
  }
);

const categoryReducer = createSlice({
  name: "category",
  initialState: {
    categoryData: [],
    status: "idle",
    error: "",
    category: {},
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  reducers: {
    resetCategory: (state, action) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "isLoading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categoryData = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.error = null;
        state.isSuccess = true;
        successToast("Added successfully", );
      })

      .addCase(addCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload
          ? action.payload.errorMessage
          : action.error.message;
        if (action.payload) {
          state.error = action.payload.errorMessage;
          console.log("error", action.payload.message[0].value);
          errorToast(action.payload.message[0].value, "bottom_right");
        } else {
          state.error = action.error.message;
          console.log("error", action);
          errorToast(action.error.message, "bottom_right");
        }
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.category = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.category = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer, actions, and selector
export const { resetCategory } = categoryReducer.actions;
export const selectCategories = (state) => state.category.categoryData;
export const selectAddCategoryError = (state) => state.category.error;
export default categoryReducer.reducer;
