import { configureStore } from '@reduxjs/toolkit';
import { tmdbApi } from '@/app/_services/fetchquerry';
import watchReducer from "@/app/_lib/watchSlice"

export const store = configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    watch: watchReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbApi.middleware),
});
