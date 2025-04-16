import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

// Async Thunk to fetch placement training tracks
export const fetchPlacementTrainingTracks = createAsyncThunk(
  "placementTrainingTrack/fetchPlacementTrainingTracks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/service/placement-training-tracks`);
      return response.data.getAllPlacementtrainingtrack;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch training tracks");
    }
  }
);

// Async Thunk to create a new placement training track
export const createPlacementTrainingTrack = createAsyncThunk(
  "placementTrainingTrack/createPlacementTrainingTrack",
  async (trackData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/service/placement-training-track`,
        trackData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create training track");
    }
  }
);

// Async Thunk to delete a placement training track
export const deletePlacementTrainingTrack = createAsyncThunk(
  "placementTrainingTrack/deletePlacementTrainingTrack",
  async (trackId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${getAPIURL()}/delete/service/placement-training-track/${trackId}`
      );
      if (response.data.success) {
        return trackId; // Return deleted track ID for state update
      } else {
        return rejectWithValue("Failed to delete training track");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete training track");
    }
  }
);

export const fetchPlacementTrainingTrackById = createAsyncThunk(
    "placementTrainingTrack/fetchById",
    async (id, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${getAPIURL()}/getById/service/placement-training-track/${id}`
        );
        console.log("Fetched track data:", response.data);
        return response.data.placementtrainingtrackById; // Make sure this is the correct key
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch training track");
      }
    }
  );

  export const updatePlacementTrainingTrack = createAsyncThunk(
    "placementTrainingTrack/updatePlacementTrainingTrack",
    async ({ id, updatedData }, { rejectWithValue }) => {
      try {
        const response = await axios.put(
          `${getAPIURL()}/update/service/placement-training-track/${id}`,
          updatedData
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update training track");
      }
    }
  );
  

const placementTrainingTrackSlice = createSlice({
  name: "placementTrainingTrack",
  initialState: {
    tracks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlacementTrainingTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlacementTrainingTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.tracks = action.payload;
      })
      .addCase(fetchPlacementTrainingTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPlacementTrainingTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlacementTrainingTrack.fulfilled, (state, action) => {
        state.loading = false;
        state.tracks.push(action.payload);
      })
      .addCase(createPlacementTrainingTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePlacementTrainingTrack.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePlacementTrainingTrack.fulfilled, (state, action) => {
        state.loading = false;
        state.tracks = state.tracks.filter((track) => track._id !== action.payload);
      })
      .addCase(deletePlacementTrainingTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPlacementTrainingTrackById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlacementTrainingTrackById.fulfilled, (state, action) => {
        state.loading = false;
        const track = action.payload;
        const existingTrackIndex = state.tracks.findIndex(t => t._id === track._id);
      
        if (existingTrackIndex !== -1) {
          state.tracks[existingTrackIndex] = track; // Update existing track
        } else {
          state.tracks.push(track); // Add if it doesn't exist
        }
      })
      .addCase(fetchPlacementTrainingTrackById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePlacementTrainingTrack.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePlacementTrainingTrack.fulfilled, (state, action) => {
        state.loading = false;
        state.tracks = state.tracks.map((track) =>
          track._id === action.payload._id ? action.payload : track
        );
      })
      .addCase(updatePlacementTrainingTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
      
  },
});

export default placementTrainingTrackSlice.reducer;
