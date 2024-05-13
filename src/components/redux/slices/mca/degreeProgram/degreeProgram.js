import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAPIURL } from '../../../../../utils/utils';

export const createDegreeProgram = createAsyncThunk(
  'degreeProgram/create',
  async ({token,formData}) => {
    const response = await axios.post(`${getAPIURL()}/create/degree_Program`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

export const fetchDegreeProgramData = createAsyncThunk(
  'degreeProgram/fetchData',
  async () => {
    try {
      const response = await axios.get(`${getAPIURL()}/getAll/degree_Program`);
      return response.data.Degree_Program;
    } catch (error) {
      throw new Error('Error fetching data');
    }
  }
);

export const fetchDegreeProgramById = createAsyncThunk(
  "degreeProgram/fetchById",
  async (degreeProgramId) => {
    try {
      const response = await axios.get(`${getAPIURL()}/getById/degree_Program/${degreeProgramId}`
      );
      return response.data.Degree_Program;
    } catch (error) {
      throw Error("Error fetching Degree Program details");
    }
  }
);

export const updateDegreeProgram = createAsyncThunk(
  "degreeProgram/update",
  async ({token, degreeProgramId, formData }) => {
    try {
      const response = await axios.put(`${getAPIURL()}/update/degree_Program/${degreeProgramId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.Degree_Program;
    } catch (error) {
      throw Error("Error updating career Degree Program");
    }
  }
);

export const deleteDegreeProgram = createAsyncThunk(
  'degreeProgram/delete',
  async ({ token, degreeProgramId }, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${getAPIURL()}/delete/degree_Program/${degreeProgramId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return degreeProgramId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const degreeProgramSlice = createSlice({
  name: 'degreeProgram',
  initialState: {
    loading: false,
    error: null,
    success: false,
    degreeProgramData: [],
    status: 'idle',
    selectedDegreeProgram: null,
  },
  reducers: {
    setSelectedDegreeProgram: (state, action) => {
      state.selectedDegreeProgram = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDegreeProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDegreeProgram.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(createDegreeProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.success = false;
      })
      .addCase(fetchDegreeProgramData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDegreeProgramData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.degreeProgramData = action.payload;
      })
      .addCase(fetchDegreeProgramData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchDegreeProgramById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDegreeProgramById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDegreeProgram = action.payload;
      })
      .addCase(fetchDegreeProgramById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateDegreeProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDegreeProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.Degree_Program = action.payload;
      })
      .addCase(updateDegreeProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteDegreeProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDegreeProgram.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted Degree Program from the state
        state.degreeProgramData = state.degreeProgramData.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteDegreeProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { setSelectedDegreeProgram } = degreeProgramSlice.actions;
export default degreeProgramSlice.reducer;
