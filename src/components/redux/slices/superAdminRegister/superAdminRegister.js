import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const superAdminPostSignUp = createAsyncThunk(
  "supersuperAdminPostSignUp",
  async ({ values, token }, { rejectWithValue }) => {
    let data = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      address: {
        city: values.city,
        state: values.state,
        country: values.country,
      },
      password: values.password,
    };
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_API + "/create/superAdmin",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const superAdminSignUpSlice = createSlice({
  initialState: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: "",
  },
  name: "superAdminSignup",
  reducers: {
    resetSignUp: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(superAdminPostSignUp.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(superAdminPostSignUp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
    });

    builder.addCase(superAdminPostSignUp.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      if (action.payload) {
        state.error = action.payload.errorMessage;
        console.log("error", action.payload.message[0].value);
      } else {
        state.error = action.error.message;
        console.log("error", action);
      }
    });
  },
});

export const { resetSignUp } = superAdminSignUpSlice.actions;

export default superAdminSignUpSlice.reducer;
