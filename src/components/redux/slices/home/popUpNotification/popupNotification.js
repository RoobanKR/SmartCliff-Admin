import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

// Async thunk to create a pop-up notification
export const createPopUpNotification = createAsyncThunk(
  'popUpNotification/create',
  async (formData) => {
    try {
      const response = await axios.post(`${getAPIURL()}/create/home/popup-notification`, formData);
      return response.data; // Adjust based on your API response structure
    } catch (error) {
      throw new Error(error.response.data.message || 'Failed to create pop-up notification');
    }
  }
);

// Async thunk to get all pop-up notifications
export const getAllPopUpNotifications = createAsyncThunk(
  'popUpNotification/getAll',
  async () => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/home/popup-notification`);
      return response.data.getAllPopUpNotification; 
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk to get a pop-up notification by ID
export const getPopUpNotificationById = createAsyncThunk(
  'popUpNotification/getById',
  async (id) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getById/home/popup-notification/${id}`);
      return response.data.PopUpNotificationById;
    } catch (error) {
      throw error;
    }
  }
);

export const togglePopUpStatus = createAsyncThunk(
    'popUpNotification/toggleStatus',
    async (id) => {
      try {
        const response = await axios.put(`${getAPIURL()}/popup-notification/isopen/${id}`);
        return response.data.popUp; // Return the updated pop-up notification
      } catch (error) {
        throw new Error(error.response.data.message || 'Failed to toggle pop-up status');
      }
    }
  );

// Async thunk to update a pop-up notification
export const updatePopUpNotification = createAsyncThunk(
  'popUpNotification/update',
  async ({ id, formData }) => {
    try {
      const response = await axios.put(`${getAPIURL()}/update/home/popup-notification/${id}`, formData);
      return response.data; 
    } catch (error) {
      throw error; 
    }
  }
);

// Async thunk to delete a pop-up notification
export const deletePopUpNotification = createAsyncThunk(
  'popUpNotification/delete',
  async (id) => {
    try {
      await axios.delete(`${getAPIURL()}/delete/home/popup-notification/${id}`);
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
  notifications: [],
  selectedNotification: null,
};

const popUpNotificationSlice = createSlice({
  name: 'popUpNotification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },  extraReducers: (builder) => {
    builder
      .addCase(createPopUpNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPopUpNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Pop-up notification created successfully";
        state.notifications.push(action.payload.newPopUpNotification); // Add the new notification to the list
      })
      .addCase(createPopUpNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create pop-up notification";
      })
      .addCase(getAllPopUpNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPopUpNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getAllPopUpNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getPopUpNotificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPopUpNotificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNotification = action.payload;
      })
      .addCase(getPopUpNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePopUpNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePopUpNotification.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notifications.findIndex(notification => notification._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index] = action.payload; // Update the existing notification
        }
      })
      .addCase(updatePopUpNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(deletePopUpNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePopUpNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.filter(notification => notification._id !== action.payload); // Remove the deleted notification
      })
      .addCase(deletePopUpNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(togglePopUpStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePopUpStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notifications.findIndex(notification => notification._id === action.payload.id);
        if (index !== -1) {
          state.notifications[index].isOpen = action.payload.isOpen; // Update the isOpen status
        }
      })
      .addCase(togglePopUpStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
  },
});
export const { clearError } = popUpNotificationSlice.actions;

export default popUpNotificationSlice.reducer;