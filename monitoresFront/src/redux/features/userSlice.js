import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/profile/${id}`);
      return res.data.user;
    } catch {
      return thunkAPI.rejectWithValue("Error cargando perfil del usuario");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserProfile: (state) => { // CREO QUE YA NO SIRVE
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
