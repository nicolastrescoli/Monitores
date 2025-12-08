import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getActivities,
  showActivity,
  getTypes,
  getPending,
  approveActivity,
  rejectActivity,
  getFormData,
  storeActivity,
  updateActivity,
} from "../../services/api.js";
import {
  cancelSubmission,
  deleteActivity,
  submitPublic,
} from "../../services/api.js";

// Fetch de actividades
export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
  async () => {
    const [activities, types] = await Promise.all([
      getActivities(),
      getTypes()
    ]);
    return { activities, types };
  }
);


// Fetch de una actividad por ID
export const fetchActivityById = createAsyncThunk(
  "activities/fetchById",
  async (id) => {
    const res = await showActivity(id);
    return res;
  }
);

// Cambiar visibilidad a "pending"
export const requestPublication = createAsyncThunk(
  "activities/requestPublication",
  async (activityId, { rejectWithValue }) => {
    try {
      await submitPublic(activityId);
      return { activityId, visibility: "pending" };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error solicitando publicación"
      );
    }
  }
);

// Cambiar visibilidad a "private"
export const cancelPublication = createAsyncThunk(
  "activities/cancelPublication",
  async (activityId, { rejectWithValue }) => {
    try {
      await cancelSubmission(activityId);
      return { activityId, visibility: "private" };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error cancelando envío"
      );
    }
  }
);

// Crear actividades
export const createActivity = createAsyncThunk(
  "activities/createActivity",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await storeActivity(payload);
      return res.activity ?? res;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Actualizar actividades
export const updateActivityAction = createAsyncThunk(
  "activities/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updatedActivity = await updateActivity(id, data);
      return updatedActivity;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Eliminar
export const deleteActivityAction = createAsyncThunk(
  "activities/delete",
  async (activityId, { rejectWithValue }) => {
    try {
      await deleteActivity(activityId);
      return { activityId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error al eliminar actividad"
      );
    }
  }
);

// Actividades pendientes de aprobación
export const fetchPendingActivities = createAsyncThunk(
  "activities/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getPending();
      return res.activities;
    } catch {
      return rejectWithValue("Error cargando actividades pendientes");
    }
  }
);

export const approveActivityAction = createAsyncThunk(
  "activities/approve",
  async (id, { rejectWithValue }) => {
    try {
      await approveActivity(id);
      return id;
    } catch {
      return rejectWithValue("Error aprobando actividad");
    }
  }
);

export const rejectActivityAction = createAsyncThunk(
  "activities/reject",
  async (id, { rejectWithValue }) => {
    try {
      await rejectActivity(id);
      return id;
    } catch {
      return rejectWithValue("Error rechazando actividad");
    }
  }
);

// Carga de datos para formulario de creación y edición
export const fetchFormData = createAsyncThunk(
  "activities/fetchFormData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getFormData();
      return res; // { types, materials, risks }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error cargando datos del formulario"
      );
    }
  }
);

const activitySlice = createSlice({
  name: "activities",
  initialState: {
    activities: [],
    typeNames: {},
    loading: true,
    loadingActivity: false,
    currentActivity: null,
    error: null,
    pendingActivities: [],
    pendingLoading: false,
    // Campos complementarios
    types: [],
    materials: [],
    risks: [],
  },
  reducers: {
    clearCurrentActivity(state) {
      state.currentActivity = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Obtener actividades
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.activities = action.payload.activities;
        state.typeNames = action.payload.types;
        state.loading = false;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Obtener por ID
      .addCase(fetchActivityById.pending, (state) => {
        state.loadingActivity = true;
      })
      .addCase(fetchActivityById.fulfilled, (state, action) => {
        state.loadingActivity = false;
        const { activity, creator, materials, risks } = action.payload;
        state.currentActivity = { activity, creator, materials, risks };
      })
      .addCase(fetchActivityById.rejected, (state) => {
        state.loadingActivity = false;
        state.currentActivity = null;
      })

      // Crear
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities.push(action.payload);
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Actualizar
      .addCase(updateActivityAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateActivityAction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentActivity = action.payload;
        state.activities = state.activities.map((a) =>
          a.id === action.payload.id ? action.payload : a
        );
      })
      .addCase(updateActivityAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Solicitar publicación
      .addCase(requestPublication.fulfilled, (state, action) => {
        const act = state.activities.find(
          (a) => a.id === action.payload.activityId
        );
        if (act) act.visibility = action.payload.visibility;
      })

      // Cancelar publicación
      .addCase(cancelPublication.fulfilled, (state, action) => {
        const act = state.activities.find(
          (a) => a.id === action.payload.activityId
        );
        if (act) act.visibility = action.payload.visibility;
      })

      // Eliminar
      .addCase(deleteActivityAction.fulfilled, (state, action) => {
        state.activities = state.activities.filter(
          (a) => a.id !== action.payload.activityId
        );
        // Si estábamos viendo la actividad que se eliminó limpiamos currentActivity
        if (state.currentActivity?.activity?.id === action.payload.activityId) {
          state.currentActivity = null;
        }
      })

      // Admin activities
      .addCase(fetchPendingActivities.pending, (state) => {
        state.pendingLoading = true;
      })
      .addCase(fetchPendingActivities.fulfilled, (state, action) => {
        state.pendingLoading = false;
        state.pendingActivities = action.payload;
      })
      .addCase(fetchPendingActivities.rejected, (state) => {
        state.pendingLoading = false;
      })

      .addCase(approveActivityAction.fulfilled, (state, action) => {
        state.pendingActivities = state.pendingActivities.filter(
          (a) => a.id !== action.payload
        );
        const act = state.activities.find((a) => a.id === action.payload);
        if (act) act.visibility = "public";
      })

      .addCase(rejectActivityAction.fulfilled, (state, action) => {
        state.pendingActivities = state.pendingActivities.filter(
          (a) => a.id !== action.payload
        );
        const act = state.activities.find((a) => a.id === action.payload);
        if (act) act.visibility = "private";
      })

      // Fetch formData
      .addCase(fetchFormData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormData.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload.types;
        state.materials = action.payload.materials;
        state.risks = action.payload.risks;
      })
      .addCase(fetchFormData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentActivity } = activitySlice.actions;

export default activitySlice.reducer;
