import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../utils/utils";

export const adminPostSignUp = createAsyncThunk(
  "adminPostSignUp",
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
        `${getAPIURL()}/create/admin`,
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

export const adminSignUpSlice = createSlice({
  initialState: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: "",
  },
  name: "adminSignup",
  reducers: {
    resetSignUp: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(adminPostSignUp.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(adminPostSignUp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
    });

    builder.addCase(adminPostSignUp.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });
  },
});

export const { resetSignUp } = adminSignUpSlice.actions;

export default adminSignUpSlice.reducer;
