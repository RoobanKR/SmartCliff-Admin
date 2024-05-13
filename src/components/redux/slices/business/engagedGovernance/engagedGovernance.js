import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

export const createEngagedGovernance = createAsyncThunk(
  "engagedGovernance/post",
  async (formData) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/engaged_govermence`,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response.data.message || "Failed to add engaged governance"
      );
    }
  }
);

export const getAlEngagedGovernance = createAsyncThunk(
  "engagedGovernance/getAll",
  async () => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getAll/engaged_govermence`
      );
      return response.data.All_EngagedGovermence;
    } catch (error) {
      throw error;
    }
  }
);

export const getByEngagedGovernanceId = createAsyncThunk(
  "engagedGovernance/getById",
  async (id) => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getById/engaged_govermence/${id}`
      );
      return response.data.EngagedGovermence_Id_Based
      ;
    } catch (error) {
      throw error;
    }
  }
);

export const updateEngagedGovernance = createAsyncThunk(
  "engagedGovernance/update",
  async ({ id, formData }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/engaged_govermence/${id}`,
        formData
      );
      return response.data.message;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteEngagedGovernance = createAsyncThunk(
  "engagedGovernance/delete",
  async (id) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/engaged_govermence/${id}`);
      return id;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  testimonials: [],
  selectedEngagedGovernanceById: null,
  engagedGovernance: [],
};

const engagedGovernanceSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEngagedGovernance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEngagedGovernance.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "testimonial added successfully";
      })
      .addCase(createEngagedGovernance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add testimonial";
      })
      .addCase(getAlEngagedGovernance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAlEngagedGovernance.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.engagedGovernance = action.payload;
      })
      .addCase(getAlEngagedGovernance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getByEngagedGovernanceId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getByEngagedGovernanceId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedEngagedGovernanceById = action.payload;
      })
      .addCase(getByEngagedGovernanceId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateEngagedGovernance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEngagedGovernance.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMessage = action.payload;
      })
      .addCase(updateEngagedGovernance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteEngagedGovernance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEngagedGovernance.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMessage = action.payload;
      })
      .addCase(deleteEngagedGovernance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default engagedGovernanceSlice.reducer;
