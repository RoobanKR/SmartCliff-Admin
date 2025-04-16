import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import { getAPIURL } from "../../../../utils/utils";

// Create Admin
export const registerAdmin = createAsyncThunk(
  "admin/registerAdmin",
  async ({formData,token}, { rejectWithValue }) => {
    try {
      const response = await Axios.post(
        `${getAPIURL()}/create/admin`,
        formData,
        {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.data) return rejectWithValue(error.response.data);
      return rejectWithValue({
        message: [{ key: "error", value: "Error registering admin" }],
      });
    }
  }
);

// Get All Users
export const getAllUsers = createAsyncThunk(
    "admin/getAllUsers",
    async ({ token }, { rejectWithValue }) => {
      try {
        const response = await Axios.get(`${getAPIURL()}/getUsers`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.Users;
      } catch (error) {
        if (error.response?.data) return rejectWithValue(error.response.data);
        return rejectWithValue({
          message: [{ key: "error", value: "Error fetching users" }],
        });
      }
    }
  );
  
  export const getUserById = createAsyncThunk(
    "admin/getUserById",
    async ({ id, token }, { rejectWithValue }) => {
      try {
        const response = await Axios.get(`${getAPIURL()}/getUserById/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.user;
      } catch (error) {
        if (error.response?.data) return rejectWithValue(error.response.data);
        return rejectWithValue({
          message: [{ key: "error", value: "Error fetching user data" }],
        });
      }
    }
  );
  export const updateAdmin = createAsyncThunk(
    "admin/updateAdmin",
    async ({ id, formData, token }, { rejectWithValue }) => {
      try {
        const response = await Axios.put(
          `${getAPIURL()}/update/admin/${id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } catch (error) {
        if (error.response?.data) return rejectWithValue(error.response.data);
        return rejectWithValue({
          message: [{ key: "error", value: "Error updating admin" }],
        });
      }
    }
  );
    
// Delete User
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async ({ id, token }, { rejectWithValue }) => {
      try {
        const response = await Axios.delete(`${getAPIURL()}/delete/admin/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return { id, ...response.data };
      } catch (error) {
        if (error.response?.data) return rejectWithValue(error.response.data);
        return rejectWithValue({
          message: [{ key: "error", value: "Error deleting user" }],
        });
      }
    }
  );
  
// Admin Slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    success: false,
    error: null,
    admins: [],
    admin: null,
    users: [],
    token: null,
    successMessage: null,
  },
  reducers: {
    resetAdminState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Register Admin
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload?.token) state.token = action.payload.token;
        const msg = action.payload.message?.find(m => m.key === "success");
        if (msg) state.successMessage = msg.value;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        const msg = action.payload?.message?.find(m => m.key === "error");
        state.error = msg?.value || action.error.message || "Error registering admin";
      });

    // Get All Users
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        const msg = action.payload?.message?.find(m => m.key === "error");
        state.error = msg?.value || action.error.message || "Error fetching users";
      });

    // Delete User
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;
        state.users = state.users.filter(user => user._id !== deletedId);
        const msg = action.payload.message?.find(m => m.key === "success");
        if (msg) state.successMessage = msg.value;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        const msg = action.payload?.message?.find(m => m.key === "error");
        state.error = msg?.value || action.error.message || "Error deleting user";
      });
          // Get User By ID
    builder
    .addCase(getUserById.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.admin = null;
    })
    .addCase(getUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.admin = action.payload;
    })
    .addCase(getUserById.rejected, (state, action) => {
      state.loading = false;
      const msg = action.payload?.message?.find(m => m.key === "error");
      state.error = msg?.value || action.error.message || "Error fetching user";
    });

  // Update Admin
  builder
    .addCase(updateAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.admin = action.payload.admin;
      const msg = action.payload.message;
      if (msg) state.successMessage = msg;
    })
    .addCase(updateAdmin.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      const msg = action.payload?.message?.find(m => m.key === "error");
      state.error = msg?.value || action.error.message || "Error updating admin";
    });

  },
});

export const { resetAdminState } = adminSlice.actions;

export default adminSlice.reducer;
