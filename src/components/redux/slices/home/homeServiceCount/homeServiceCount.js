import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

// Create home service
export const createHomeServiceCount = createAsyncThunk(
    "homeServices/createHomeServiceCount",
    async (formData) => { 
        try {
            const response = await Axios.post(
                `${getAPIURL()}/create/home/services-count`,
                formData
            );
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
);
// Get all home services
export const getAllHomeServicesCount = createAsyncThunk(
    "homeServices/getAllHomeServicesCount",
    async () => {
        try {
            const response = await Axios.get(`${getAPIURL()}/getAll/home/services-count`);
            return response.data.get_all_home_service;
        } catch (error) {
            throw error;
        }
    }
);

// Get home service by ID
export const getHomeServiceCountById = createAsyncThunk(
    "homeServices/fetchById",
    async (id) => {
        try {
            const response = await Axios.get(
                `${getAPIURL()}/getById/home/services-count/${id}`
            );
            return response.data.homeServiceById;
        } catch (error) {
            throw Error("Error fetching Home Service details");
        }
    }
);

// Update home service
// Update home service
export const updateHomeServiceCount = createAsyncThunk(
    "homeServices/update",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await Axios.put(
                `${getAPIURL()}/update/home/services-count/${id}`,
                formData
            );
            return response.data; // Return the full data object
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: [{ key: "error", value: "Error updating Home Service" }] });
        }
    }
);
// Delete home service
export const deleteHomeServiceCount = createAsyncThunk(
    "homeServices/deleteHomeServiceCount",
    async (serviceId) => {
        try {
            const response = await Axios.delete(
                `${getAPIURL()}/delete/home/services-count/${serviceId}`
            );
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
);

// Create the home service slice
const homeServiceSlice = createSlice({
    name: "homeServices",
    initialState: {
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: "",
        homeServices: [],
        homeService: {},
        homeServiceById: null,
    },
    reducers: {
        resetHomeService: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.error = "";
        },
        clearUpdateStatus: (state) => {
            state.updateSuccess = false;
            state.updateError = null;
        },
    },
    extraReducers: (builder) => {
        // Create home service cases
        builder.addCase(createHomeServiceCount.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        });
        builder.addCase(createHomeServiceCount.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
        });
        builder.addCase(createHomeServiceCount.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.error = action.payload
                ? action.payload.errorMessage
                : action.error.message;
        });

        // Get all home services cases
        builder.addCase(getAllHomeServicesCount.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        });
        builder.addCase(getAllHomeServicesCount.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.homeServices = action.payload;
        });
        builder.addCase(getAllHomeServicesCount.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });

        // Get home service by ID cases
        builder.addCase(getHomeServiceCountById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getHomeServiceCountById.fulfilled, (state, action) => {
            state.isLoading = false;
            if (Array.isArray(action.payload)) {
              state.homeServiceById = action.payload[0];
            } else {
              state.homeServiceById = action.payload;
            }
          });
        builder.addCase(getHomeServiceCountById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        // Update home service cases
        builder.addCase(updateHomeServiceCount.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.updateSuccess = false;
        });
        builder.addCase(updateHomeServiceCount.fulfilled, (state, action) => {
            state.isLoading = false;
            state.homeService = action.payload.updatedHomeService; // Note: using updatedHomeService not homeService
            state.updateSuccess = true;
            state.isSuccess = true;
            
            // Extract message from the array format
            if (action.payload.message && Array.isArray(action.payload.message) && action.payload.message.length > 0) {
                const successMsg = action.payload.message.find(msg => msg.key === "success");
                state.successMessage = successMsg ? successMsg.value : "Home Service Updated successfully";
            } else {
                state.successMessage = "Home Service Updated successfully";
            }
        });
        builder.addCase(updateHomeServiceCount.rejected, (state, action) => {
            state.isLoading = false;
            state.updateSuccess = false;
            
            // Extract error message from the array format if available
            if (action.payload && action.payload.message && Array.isArray(action.payload.message)) {
                const errorMsg = action.payload.message.find(msg => msg.key === "error");
                state.error = errorMsg ? errorMsg.value : "Error updating Home Service";
            } else if (action.error && action.error.message) {
                state.error = action.error.message;
            } else {
                state.error = "Error updating Home Service";
            }
        });
        // Delete home service cases
        builder.addCase(deleteHomeServiceCount.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        });
        builder.addCase(deleteHomeServiceCount.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
        });
// For the delete operation in the extraReducers:
builder.addCase(deleteHomeServiceCount.rejected, (state, action) => {
    state.isLoading = false;
    state.isSuccess = false;
    state.isError = true;
    
    // Handle the error message more carefully
    if (action.payload) {
        if (typeof action.payload === 'string') {
            state.error = action.payload;
        } else if (typeof action.payload === 'object') {
            if (action.payload.errorMessage && typeof action.payload.errorMessage === 'string') {
                state.error = action.payload.errorMessage;
            } else if (action.payload.message && typeof action.payload.message === 'string') {
                state.error = action.payload.message;
            } else {
                state.error = 'An error occurred during deletion';
            }
        } else {
            state.error = 'An error occurred during deletion';
        }
    } else if (action.error && action.error.message) {
        state.error = action.error.message;
    } else {
        state.error = 'An error occurred during deletion';
    }
});    },
});

export const { resetHomeService, clearUpdateStatus } = homeServiceSlice.actions;

export const selectHomeServiceState = (state) => state.homeService;

export default homeServiceSlice.reducer;