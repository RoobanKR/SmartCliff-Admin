import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import { successToast, errorToast } from "../../../toaster"; // Adjust path as needed
import { getAPIURL } from "../../../../utils/utils"; // Adjust path as needed

// Register admin action
export const registerAdmin = createAsyncThunk(
  "admin/registerAdmin",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const response = await Axios.post(
        `${getAPIURL()}/admin/register`,
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
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: [{ key: "error", value: error.message }] });
    }
  }
);

// Admin slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    adminData: [],
    status: "idle",
    error: null,
    selectedAdmin: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  reducers: {
    resetAdminState: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register admin cases
      .addCase(registerAdmin.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.error = null;
        state.isSuccess = true;
        successToast("Admin registered successfully");
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        
        if (action.payload && action.payload.message) {
          const errorMessage = action.payload.message.find(msg => msg.key === "error");
          if (errorMessage) {
            state.error = errorMessage.value;
            errorToast(errorMessage.value, "bottom_right");
          } else {
            state.error = "Registration failed";
            errorToast("Registration failed", "bottom_right");
          }
        } else {
          state.error = action.error.message;
          errorToast(action.error.message, "bottom_right");
        }
      });
    // You can add more admin-related actions here (get all admins, update admin, delete admin, etc.)
  },
});

export const { resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;