// src/redux/features/business/howItWorks/howItWorksSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAPIURL } from "../../../../../utils/utils";

// Async Thunks
export const getAllHowItWorks = createAsyncThunk("howItWorks/getAll", async () => {
    try {
        const response = await axios.get(`${getAPIURL()}/getAll/business/how-it-works`);
        return response.data.howitworks;
    } catch (error) {
        throw error;
    }
});

export const getHowItWorksById = createAsyncThunk("howItWorks/getById", async (id) => {
    try {
        const response = await axios.get(`${getAPIURL()}/getById/business/how-it-works/${id}`);
        return response.data.howitwork;
    } catch (error) {
        throw error;
    }
});

export const createHowItWorks = createAsyncThunk("howItWorks/create", async (formData) => {
    try {
        const response = await axios.post(`${getAPIURL()}/create/business/how-it-works`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const updateHowItWorks = createAsyncThunk("howItWorks/update", async ({ id, formData }) => {
    try {
        const response = await axios.put(`${getAPIURL()}/update/business/how-it-works/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const deleteHowItWorks = createAsyncThunk("howItWorks/delete", async (id) => {
    try {
        await axios.delete(`${getAPIURL()}/delete/business/how-it-works/${id}`);
        return id;
    } catch (error) {
        throw error;
    }
});

// Initial State
const initialState = {
    loading: false,
    error: null,
    successMessage: "",
    howItWorksList: [],
    selectedHowItWork: null,
};

// HowItWorks Slice
const howItWorksSlice = createSlice({
    name: "howItWorks",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.successMessage = "";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All HowItWorks
            .addCase(getAllHowItWorks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllHowItWorks.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.howItWorksList = action.payload;
            })
            .addCase(getAllHowItWorks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Get HowItWorks By Id
            .addCase(getHowItWorksById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHowItWorksById.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.selectedHowItWork = action.payload;
            })
            .addCase(getHowItWorksById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create HowItWorks
            .addCase(createHowItWorks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createHowItWorks.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.successMessage = action.payload.message[0].value;
            })
            .addCase(createHowItWorks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update HowItWorks
            .addCase(updateHowItWorks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateHowItWorks.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.successMessage = action.payload.message[0].value;
            })
            .addCase(updateHowItWorks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete HowItWorks
            .addCase(deleteHowItWorks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteHowItWorks.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.howItWorksList = state.howItWorksList.filter((item) => item._id !== action.payload);
                state.successMessage = "How It Work item deleted successfully";
            })
            .addCase(deleteHowItWorks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearMessages } = howItWorksSlice.actions;
export default howItWorksSlice.reducer;
