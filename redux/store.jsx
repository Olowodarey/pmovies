import { configureStore } from '@reduxjs/toolkit';
import { tmdbApi } from '@/app/_services/fetchquerry';

export const store = configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbApi.middleware),
});
