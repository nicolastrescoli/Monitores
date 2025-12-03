import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import authReducer from "./features/authSlice";
import communityReducer from "./features/communitySlice";
import activitiesReducer from "./features/activitySlice";
import statsSlice from "./features/statsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    community: communityReducer,
    activities: activitiesReducer,
    stats: statsSlice
  },
});
