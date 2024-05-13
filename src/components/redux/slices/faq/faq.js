import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
 
export const fetchCategories = createAsyncThunk(
  "faq/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5353/categories");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
 
export const createFAQ = createAsyncThunk(
  "faq/createFAQ",
  async (
    { faqItems, selectedCourse, selectedDegreeProgram,selectedService },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("http://localhost:5353/create/faq", {
        faqItems,
        course: selectedCourse !== null ? selectedCourse._id : null,
        degree_program:
          selectedDegreeProgram !== null ? selectedDegreeProgram._id : null,
          service:selectedService !== null ? selectedService._id:null,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
 
export const fetchAllFAQs = createAsyncThunk(
  "faq/fetchAllFAQs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5353/getAll/faq");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
 
export const fetchFAQById = createAsyncThunk(
  "faq/fetchFAQById",
  async (faqId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5353/get/faq/${faqId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
 
export const deleteFAQById = createAsyncThunk(
  "faq/deleteFAQById",
  async (faqId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5353/delete/faq/${faqId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
 
export const updateFAQ = createAsyncThunk(
  "faq/updateFAQ",
  async ({ faqId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5353/faq/update/${faqId}`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
 
const initialState = {
  categories: [],
  faq: [], // Ensure this is an array
  status: "idle", // Change the state name to 'status'
  selectedCourse: null,
};
 
const faqSlice = createSlice({
  name: "faq",
  initialState: {
    selectedCourse: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createFAQ.pending, (state) => {
      state.faqCreationStatus = "loading";
    });
    builder.addCase(createFAQ.fulfilled, (state) => {
      state.faqCreationStatus = "succeeded";
    });
    builder.addCase(createFAQ.rejected, (state) => {
      state.faqCreationStatus = "failed";
    });
    builder.addCase(fetchAllFAQs.pending, (state) => {
      state.faq = [];
      state.status = "loading";
    });
    builder.addCase(fetchAllFAQs.fulfilled, (state, action) => {
      state.faq = action.payload;
      state.status = "idle";
    });
    builder.addCase(fetchAllFAQs.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(fetchFAQById.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(fetchFAQById.fulfilled, (state, action) => {
      state.faq = [action.payload]; // Store the single FAQ in an array
      state.status = "idle";
    });
    builder.addCase(deleteFAQById.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(deleteFAQById.fulfilled, (state) => {
      state.status = "succeeded";
    });
    builder.addCase(deleteFAQById.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(updateFAQ.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateFAQ.fulfilled, (state) => {
      state.status = "succeeded";
    });
    builder.addCase(updateFAQ.rejected, (state) => {
      state.status = "failed";
    });
  },
});
 
export const { setSelectedCourse } = faqSlice.actions;
export const selectCategories = (state) => state.faq.categories;
export const selectSelectedCourse = (state) => state.faq.selectedCourse;
export const selectFAQs = (state) => state.faq.faq;
export const selectStatus = (state) => state.faq.status;
export default faqSlice.reducer;
 