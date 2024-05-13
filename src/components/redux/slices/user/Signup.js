// signup.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { errorToast, successToast } from "../../../toaster";
import { getAPIURL } from "../../../../utils/utils";

export const postSignUp = createAsyncThunk(
  "signup/postSignUp",
  async (values, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Append profile_pic to formData
      if (values.profile_pic) {
        formData.append("profile_pic", values.profile_pic);
      }

      // Append other form values to formData
      for (const key in values) {
        if (key !== "profile_pic") {
          formData.append(key, values[key]);
        }
      }

      const response = await axios.post(
        `${getAPIURL()}/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set Content-Type to multipart/form-data
          },
        }
      );

      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const signupSlice = createSlice({
  name: "signup",
  initialState: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: "",
  },
  reducers: {
    resetSignUp: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postSignUp.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(postSignUp.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      successToast("Signed up successfully", "bottom_right");
    });
    builder.addCase(postSignUp.rejected, (state, action) => {
      state.isLoading = false
      state.isError = true
      if (action.payload) {
        state.error = action.payload.errorMessage
        console.log("error",action.payload.message[0].value)
        errorToast(action.payload.message[0].value, "bottom_right");
      } else {
        state.error = action.error.message
        console.log("error",action)
        errorToast(action.error.message, "bottom_right");
      }
      
    })
  },
})
export const { resetSignUp } = signupSlice.actions;

export const selectSignUpState = (state) => state.signup;

export default signupSlice.reducer;
