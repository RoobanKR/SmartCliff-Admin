import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../utils/utils";

export const addSoftwareTools = createAsyncThunk(
  "softwareTools/addSoftwareTools",
  async (
    { token,softwareTools, description, selectedCategories, images },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("software_name", softwareTools);
      formData.append("description", description);

      // Assuming that the server expects an array of category IDs
      const categoryString = selectedCategories
        .map((category) => category._id)
        .join(",");
      formData.append("category", categoryString);
      for (const image of images) {
        formData.append("image", image);
      }

      const response = await axios.post(
        `${getAPIURL()}/create/toolSoftware`,
        formData,
        
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.too_software; // Adjust the key based on your server response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSoftwareTools = createAsyncThunk(
  "softwareTools/fetchSoftwareTools",
  async () => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getAll/toolSoftware`
      );
      return response.data.toolSoftware;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchToolSoftwareById = createAsyncThunk(
  "toolSoftware/fetchById",
  async (toolsId) => {
    try {
      const response = await axios.get(
        `${getAPIURL()}/getById/toolSoftware/${toolsId}`
      );
      return response.data.toolSoftware;
    } catch (error) {
      throw Error("Error fetching tool software details");
    }
  }
);

export const updateToolSoftware = createAsyncThunk(
  "toolSoftware/update",
  async ({ token,toolsId, formData }) => {
    try {
      const response = await axios.put(
        `${getAPIURL()}/update/toolSoftware/${toolsId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.toolSoftware;
    } catch (error) {
      throw Error("Error updating tool software");
    }
  }
);
export const deleteToolSoftware = createAsyncThunk(
  "toolSoftware/delete",
  async ({token,toolsId}) => {
    try {
      const response = await axios.delete(
        `${getAPIURL()}/delete/toolSoftware/${toolsId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Adjust based on your server response
    } catch (error) {
      throw Error("Error deleting tool software");
    }
  }
);

const initialState = {
  status: "idle",
  error: null,
  softwareToolsData: null,
  softwareTools: [],
  toolSoftware: {},
};

const softwareToolsSlice = createSlice({
  name: "softwareTools",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSoftwareTools.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addSoftwareTools.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.softwareToolsData = action.payload;
      })
      .addCase(addSoftwareTools.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSoftwareTools.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSoftwareTools.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.softwareTools = action.payload;
      })
      .addCase(fetchSoftwareTools.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchToolSoftwareById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToolSoftwareById.fulfilled, (state, action) => {
        state.loading = false;
        state.toolSoftware = action.payload;
      })
      .addCase(fetchToolSoftwareById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateToolSoftware.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateToolSoftware.fulfilled, (state, action) => {
        state.loading = false;
        state.toolSoftware = action.payload;
      })
      .addCase(updateToolSoftware.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteToolSoftware.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteToolSoftware.fulfilled, (state) => {
        state.status = "succeeded";
        // Optionally, you can update state or perform other actions upon successful deletion
      })
      .addCase(deleteToolSoftware.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default softwareToolsSlice.reducer;
export const selectSoftwareTools = (state) => state.softwareTools.softwareTools;
export const selectSoftwareToolsStatus = (state) => state.softwareTools.status;
export const selectSoftwareToolsError = (state) => state.softwareTools.error;
export const selectSoftwareToolsData = (state) =>
  state.softwareTools.softwareToolsData;
