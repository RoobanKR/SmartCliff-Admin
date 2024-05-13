import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

const initialState = {
    loading: false,
    error: null,
    admissions: [], // Include the admissions property in the initial state
    admissionById: null, 
    admissionById: null,
  successMessage: null,
  };

export const createAdmissionProcess = createAsyncThunk(
  "admission/post",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/admission`,
        formData,
        
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllAdmissionProcess = createAsyncThunk(
    'admission/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${getAPIURL()}/getAll/admission`);
        return response.data.admission;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );
  export const getAdmissionProcessById = createAsyncThunk(
    "admission/getById",
    async (admissionId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${getAPIURL()}/getById/admission/${admissionId}`);
        const admissionData = response.data.admissionById;
  
        // Modify the data structure if needed to match your Redux store
        const formattedData = {
          _id: admissionData._id,
          heading: admissionData.admission.map((item) => item.heading),
          degree_program: admissionData.degree_program._id,
        };
  
        return formattedData;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );
  
  export const updateAdmission = createAsyncThunk(
    "admission/update",
    async ({ admissionId, admissionData }, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${getAPIURL()}/update/admission/${admissionId}`, admissionData);
        return response.data.admission;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );
  
  export const deleteAdmission = createAsyncThunk(
    "admission/delete",
    async (admissionId, { rejectWithValue }) => {
      try {
        const response = await axios.delete(`http://localhost:5353/delete/admission/${admissionId}`);
        return response.data.message;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );

const admissionProcessSlice = createSlice({
  name: "admission",
  initialState,
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },  extraReducers: (builder) => {
    builder
      .addCase(createAdmissionProcess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdmissionProcess.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createAdmissionProcess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllAdmissionProcess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAdmissionProcess.fulfilled, (state, action) => {
        state.loading = false;
        state.admissions = action.payload;
      })
      .addCase(getAllAdmissionProcess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAdmissionProcessById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdmissionProcessById.fulfilled, (state, action) => {
        state.loading = false;
        state.admissionById = action.payload;
      })
      .addCase(getAdmissionProcessById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAdmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdmission.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Admission updated successfully";
        state.admissionById = action.payload;
      })
      .addCase(updateAdmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAdmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdmission.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
        state.admissionById = null; // Assuming you clear the admissionById after deletion
      })
      .addCase(deleteAdmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearSuccessMessage } = admissionProcessSlice.actions;

export default admissionProcessSlice.reducer;
