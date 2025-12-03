import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers, acceptRequest, rejectRequest, sendRequest,
  cancelRequest,
  removeFriend, } from "../../services/api";

// Obtener usuarios
export const fetchUsers = createAsyncThunk(
  "community/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const res = await getUsers();
      return res.users || [];
    } catch {
      return thunkAPI.rejectWithValue("Error al cargar usuarios");
    }
  }
);

// Enviar solicitud
export const sendFriendRequest = createAsyncThunk(
  "community/sendRequest",
  async (otherUserId, { rejectWithValue }) => {
    try {
      await sendRequest(otherUserId);
      return { id: otherUserId, status: "pending_sent" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error enviando solicitud");
    }
  }
);

// Cancelar solicitud
export const cancelFriendRequest = createAsyncThunk(
  "community/cancelRequest",
  async (otherUserId, { rejectWithValue }) => {
    try {
      await cancelRequest(otherUserId);
      return { id: otherUserId, status: "none" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error cancelando solicitud");
    }
  }
);

// Aceptar solicitud
export const acceptFriendRequest = createAsyncThunk(
  "community/acceptFriendRequest",
  async (otherUserId, thunkAPI) => {
    try {
      await acceptRequest(otherUserId);
      return otherUserId;
    } catch {
      return thunkAPI.rejectWithValue("Error al aceptar solicitud");
    }
  }
);

// Rechazar solicitud
export const rejectFriendRequest = createAsyncThunk(
  "community/rejectFriendRequest",
  async (otherUserId, thunkAPI) => {
    try {
      await rejectRequest(otherUserId);
      return otherUserId;
    } catch {
      return thunkAPI.rejectWithValue("Error al rechazar solicitud");
    }
  }
);

// Eliminar amistad
export const removeFriendAction = createAsyncThunk(
  "community/removeFriend",
  async (otherUserId, { rejectWithValue }) => {
    try {
      await removeFriend(otherUserId);
      return { id: otherUserId, status: "none" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error eliminando amistad");
    }
  }
);

const communitySlice = createSlice({
  name: "community",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {    
    setUsers(state, action) {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET USERS
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Enviar solicitud
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        const user = state.users.find(u => u.id === action.payload.id);
        if (user) user.friend_status = action.payload.status;
      })
      // Cancelar solicitud
      .addCase(cancelFriendRequest.fulfilled, (state, action) => {
        const user = state.users.find(u => u.id === action.payload.id);
        if (user) user.friend_status = action.payload.status;
      })

      // ACCEPT REQUEST
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        const id = action.payload;
        state.users = state.users.map((user) =>
          user.id === id
            ? { ...user, friend_status: "accepted" }
            : user
        );
      })

      // REJECT REQUEST
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        const id = action.payload;
        state.users = state.users.map((user) =>
          user.id === id
            ? { ...user, friend_status: "none" }
            : user
        );
      })

      // Eliminar amistad      
      .addCase(removeFriendAction.fulfilled, (state, action) => {
        const user = state.users.find(u => u.id === action.payload.id);
        if (user) user.friend_status = action.payload.status;
      });
  },
});

export const { setUsers } = communitySlice.actions;
export default communitySlice.reducer;