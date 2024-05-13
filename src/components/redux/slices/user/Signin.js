import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { errorToast, successToast } from "../../../toaster";
import { getAPIURL } from "../../../../utils/utils";

export const postSignIn = createAsyncThunk(
  "postSignIn",
  async (values, { rejectWithValue }) => {
    let data = {
      email: values.email,
      password: values.password,
    };
    try {
      const res = await axios.post(
        `${getAPIURL()}/Signin`,
        data,
        {
          withCredentials: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
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

export const userVerify = createAsyncThunk(
  "userVerify",
  async ({ token }, { rejectWithValue }) => {
    try {
      console.log(`token=${token}`);
      const res = await axios.get(
        `${getAPIURL()}/userVerify`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("res", res);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const signInSlice = createSlice({
  initialState: {
    isLoading: false,
    user: null,
    token: "",
    isError: false,
    error: "",
  },
  name: "signin",
  reducers: {
    resetSignIn: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
  
    builder.addCase(postSignIn.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(postSignIn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      successToast("Logged in successfully"); // Remove "bottom_right" argument
    });
       

    builder.addCase(postSignIn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      if (action.payload) {
        state.error = action.payload.errorMessage;
        console.log("error", action.payload.message[0].value);
        errorToast(action.payload.message[0].value, "bottom_right");
      } else {
        state.error = action.error.message;
        console.log("error", action);
        errorToast(action.error.message, "bottom_right");
      }
    });

  

    builder.addCase(userVerify.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(userVerify.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
    });

    builder.addCase(userVerify.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.user = null;
      if (action.payload) {
        state.error = action.payload.errorMessage;
        console.log("error", action.payload.message[0].value);
        errorToast(action.payload.message[0].value, "bottom_right");
      } else {
        state.error = action.error.message;
        console.log("error", action);
        errorToast(action.error.message, "bottom_right");
      }
    });
  },
});

export default signInSlice.reducer;
export const { resetSignIn } = signInSlice.actions;
