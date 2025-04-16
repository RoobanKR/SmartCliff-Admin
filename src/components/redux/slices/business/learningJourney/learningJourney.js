import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

// Define the initial state
const initialState = {
  learningJourneys: [],
  selectedLearning: null,

  loading: false,
  error: null,
};

// Async thunk for creating a new learning journey
export const createLearningJourney = createAsyncThunk(
  'learningJourney/create',
  async (formData) => {
    const response = await axios.post(`${getAPIURL()}/create/business/learning-journey`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);
export const fetchLearningJourneyById = createAsyncThunk(
  'learningJourney/fetchById',
  async (id) => {
    const response = await axios.get(`${getAPIURL()}/getById/business/learning-journey/${id}`);
    return response.data.learningJourneyById;
  }
);

// Async thunk for fetching all learning journeys
export const fetchAllLearningJourneys = createAsyncThunk(
  'learningJourney/fetchAll',
  async () => {
    const response = await axios.get(`${getAPIURL()}/getAll/business/learning-journey`);
    return response.data.learningjourney;
  }
);

// Async thunk for updating a learning journey
export const updateLearningJourney = createAsyncThunk(
  'learningJourney/update',
  async ({ id, formData }) => {
    const response = await axios.put(`${getAPIURL()}/update/business/learning-journey/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.updatedLearningJourney;
  }
);

// Async thunk for deleting a learning journey
export const deleteLearningJourney = createAsyncThunk(
  'learningJourney/delete',
  async (id) => {
    await axios.delete(`${getAPIURL()}/delete/business/learning-journey/${id}`);
    return id; // Return the id of the deleted journey
  }
);

// Create the slice
const learningJourneySlice = createSlice({
  name: 'learningJourney',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLearningJourney.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLearningJourney.fulfilled, (state, action) => {
        state.loading = false;
        state.learningJourneys.push(action.payload);
      })
      .addCase(createLearningJourney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllLearningJourneys.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllLearningJourneys.fulfilled, (state, action) => {
        state.loading = false;
        state.learningJourneys = action.payload;
      })
      .addCase(fetchAllLearningJourneys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateLearningJourney.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLearningJourney.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.learningJourneys.findIndex(journey => journey._id === action.payload._id);
        if (index !== -1) {
          state.learningJourneys[index] = action.payload; // Update the journey in the state
        }
      })
      .addCase(updateLearningJourney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteLearningJourney.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLearningJourney.fulfilled, (state, action) => {
        state.loading = false;
        state.learningJourneys = state.learningJourneys.filter(journey => journey._id !== action.payload); // Remove the deleted journey
      })
      .addCase(deleteLearningJourney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
            .addCase(fetchLearningJourneyById.pending, (state) => {
              state.loading = true;
            })
            .addCase(fetchLearningJourneyById.fulfilled, (state, action) => {
              state.loading = false;
              state.selectedLearning = action.payload;
            })
            .addCase(fetchLearningJourneyById.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
            })
      
  },
});

// Export the actions and reducer
export const { clearError } = learningJourneySlice.actions;
export default learningJourneySlice.reducer;