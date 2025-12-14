import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, getProfile, updateUser, deleteUser, toggleFavorite } from "../../services/api";
import axios from "axios";

const token = localStorage.getItem("authToken");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// ---------------- LOGIN ----------------
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const { token, user } = await login(credentials);

      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error en el login"
      );
    }
  }
);

// ---------------- REGISTER ----------------
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, thunkAPI) => {
    try {
      const { token, user } = await register(data);

      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return user;
    } catch {
      return thunkAPI.rejectWithValue("Error en el registro");
    }
  }
);

// ---------------- LOGGED USER PROFILE ----------------
export const fetchLoggedUser = createAsyncThunk(
  "auth/fetchLoggedUser",
  async (_, thunkAPI) => {
    try {
      const data = await getProfile();
      return data.user;
    } catch {
      return thunkAPI.rejectWithValue("No se pudo cargar el perfil del usuario autenticado");
    }
  }
);

// ---------------- UPDATE LOGGED USER ----------------
export const updateLoggedUser = createAsyncThunk(
  "auth/updateLoggedUser",
  async (formData, thunkAPI) => {
    try {
      const data = await updateUser(formData);
      return data.user;
    } catch {
      return thunkAPI.rejectWithValue("Error actualizando datos del usuario");
    }
  }
);


// ---------------- DELETE ACCOUNT ----------------
export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (id, thunkAPI) => {
    try {
      await deleteUser(id);
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
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
      state.loggedUser = null;
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
      })

      // UPDATE LOGGED USER
      .addCase(updateLoggedUser.fulfilled, (state, action) => {
        state.loggedUser = action.payload; // solo se actualiza el loggeado
      })

      // DELETE ACCOUNT
      .addCase(deleteAccount.fulfilled, (state) => {
        localStorage.removeItem("authToken");
        delete axios.defaults.headers.common["Authorization"];
        state.loggedUser = null;
      })

      // Favoritos
      .addCase(toggleFavoriteActivity.fulfilled, (state, action) => {
        const { activityId } = action.payload;
        if (!state.loggedUser) return;
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
