import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTopFavoriteActivities, getUsers } from "../../services/api";

export const fetchUsers = createAsyncThunk(
  "stats/fetchUsers",
  async () => {
    const res = await getUsers();
    return res.users || [];
  }
);

export const fetchTopFavorites = createAsyncThunk(
  "stats/fetchTopFavorites",
  async (_, { getState }) => {
    const { activities } = getState().activities;
    const topFavs = await getTopFavoriteActivities();

    const merged = topFavs
      .map((fav) => {
        const activity = activities.find(a => a.id === fav.activity_id);
        if (!activity) return null;
        return {
          ...activity,
          favorites_count: fav.favorites_count,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.favorites_count - a.favorites_count);

    return merged;
  }
);

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    users: [],
    topFavorites: [],
    topUsers: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

      .addCase(fetchTopFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopFavorites.fulfilled, (state, action) => {
        state.topFavorites = action.payload;
        state.loading = false;

        const activities = action.payload.filter(
          act => act.visibility === "public"
        );

        const userCounts = state.users.map(user => {
          const count = activities.filter(act => act.user_id === user.id).length;
          return { ...user, publicActivitiesCount: count };
        });

        state.topUsers = userCounts
          .sort((a, b) => b.publicActivitiesCount - a.publicActivitiesCount)
          .slice(0, 5);
      })
      .addCase(fetchTopFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default statsSlice.reducer;
