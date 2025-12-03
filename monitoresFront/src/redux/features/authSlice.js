import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toggleFavorite } from "../../services/api";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Configurar token inicial desde localStorage
const token = localStorage.getItem("authToken");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// ---------------- LOGIN ----------------
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const token = res.data.token;

      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return res.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error en el login"
      );
    }
  }
);

// ---------------- REGISTER ----------------
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
        role: data.role,
      });

      const token = res.data.token;
      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return res.data.user;
    } catch {
      return thunkAPI.rejectWithValue("Error en el registro");
    }
  }
);

// ---------------- LOGGED USER PROFILE ----------------
export const fetchLoggedUser = createAsyncThunk(
  "user/fetchLoggedUser",
  async (_, thunkAPI) => {
    try {
      const {data} = await axios.get(`${API_URL}/profile`);
      return data.user;
    } catch {
      return thunkAPI.rejectWithValue("No se pudo cargar el perfil del usuario autenticado");
    }
  }
);

// ---------------- UPDATE LOGGED USER ----------------
export const updateLoggedUser = createAsyncThunk(
  "user/updateLoggedUser",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/user/${formData.id}`, formData);
      return res.data.user;
    } catch {
      return thunkAPI.rejectWithValue("Error actualizando datos del usuario");
    }
  }
);

// ---------------- DELETE ACCOUNT ----------------
export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/user/${id}`);
      return true;
    } catch {
      return thunkAPI.rejectWithValue("Error eliminando cuenta");
    }
  }
);


// ACTIVIDADES FAVORITAS
export const toggleFavoriteActivity = createAsyncThunk(
  "activities/toggleFavorite",
  async (activityId, { rejectWithValue }) => {
    try {
      await toggleFavorite(activityId);
      return { activityId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al guardar favorito");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedUser: null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
      state.loggedUser = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedUser = action.payload;  // usuario loggeado
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH LOGGED PROFILE
      .addCase(fetchLoggedUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoggedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedUser = action.payload;
      })
      .addCase(fetchLoggedUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })

      // UPDATE LOGGED USER
      .addCase(updateLoggedUser.fulfilled, (state, action) => {
        state.loggedUser = action.payload; // solo se actualiza el loggeado
      })

      // DELETE ACCOUNT
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loggedUser = null;
        state.isAuthenticated = false;
      })

      // Favoritos
      .addCase(toggleFavoriteActivity.fulfilled, (state, action) => {
        const { activityId } = action.payload;
        const favs = state.loggedUser.favoriteActivities ?? [];
        const exists = favs.some(f => f.id === activityId);
        if (exists) {
          state.loggedUser.favoriteActivities = favs.filter(f => f.id !== activityId);
        } else {
          state.loggedUser.favoriteActivities = [...favs, { id: activityId }];
        }
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
