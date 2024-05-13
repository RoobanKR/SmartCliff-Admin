import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

export const createKeyElements = createAsyncThunk(
  "keyElements/post",
  async (formData) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/key_elements`,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response.data.message || "Failed to add keyElements"
      );
    }
  }
);
export const getAllKeyElements = createAsyncThunk(
  "keyElements/getAll",
  async () => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/key_elements`);
      return response.data.All_Key_Elements;
    } catch (error) {
      throw error;
    }
  }
);
export const getKeyElementsById = createAsyncThunk(
  "keyElements/getById",
  async (id) => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getById/key_elements/${id}`
      );
      return response.data.Key_Element_Id_Based;
    } catch (error) {
      throw error;
    }
  }
);
export const updateKeyElements = createAsyncThunk(
  "keyElements/updateKeyElements",
  async ({ id, formData }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/key_elements/${id}`,
        formData
      );
      return response.data.keyElements;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteKeyElements = createAsyncThunk(
  "keyElements/deleteKeyElements",
  async (id) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/key_elements/${id}`);
      return id;
    } catch (error) {
      throw error;
    }
  }
);
// Define the initial state
const initialState = {
  loading: false,
  error: null,
  successMessage: "",
  keyElements: [],
  Key_Element_Id_Based: null,
};

const keyElementsSlice = createSlice({
  name: "keyElements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createKeyElements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createKeyElements.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Key Elements added successfully";
      })
      .addCase(createKeyElements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add Key Elements";
      })
      .addCase(getAllKeyElements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllKeyElements.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.keyElements = action.payload;
      })
      .addCase(getAllKeyElements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getKeyElementsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKeyElementsById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.Key_Element_Id_Based = action.payload;
      })
      .addCase(getKeyElementsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateKeyElements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateKeyElements.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.keyElements = action.payload;
      })
      .addCase(updateKeyElements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteKeyElements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteKeyElements.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteKeyElements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default keyElementsSlice.reducer;
