import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AuthUser,
  TrackableMovie,
  UserStats,
  WatchedItem,
  WatchlistItem,
} from "@/app/_types/backend";

// Route all API calls through /api/backend so the session cookie stays first-party.
// In dev, Next's rewrites hit http://localhost:4000; in prod, they hit the Railway URL.
// Direct-origin fallback for early dev before rewrites are wired.
const BASE_URL =
  typeof window !== "undefined"
    ? "/api/backend"
    : process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

interface SignupBody {
  email: string;
  password: string;
  name?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface MarkWatchedBody extends TrackableMovie {
  rating?: number;
}

export const backendApi = createApi({
  reducerPath: "backendApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Me", "Watchlist", "Watched", "Stats"],
  endpoints: (builder) => ({
    signup: builder.mutation<AuthUser, SignupBody>({
      query: (body) => ({ url: "auth/signup", method: "POST", body }),
      invalidatesTags: ["Me"],
    }),
    login: builder.mutation<AuthUser, LoginBody>({
      query: (body) => ({ url: "auth/login", method: "POST", body }),
      invalidatesTags: ["Me"],
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: "auth/logout", method: "POST" }),
      invalidatesTags: ["Me", "Watchlist", "Watched", "Stats"],
    }),
    getMe: builder.query<AuthUser, void>({
      query: () => "auth/me",
      providesTags: ["Me"],
    }),
    getWatchlist: builder.query<WatchlistItem[], void>({
      query: () => "watchlist",
      providesTags: ["Watchlist"],
    }),
    addToWatchlist: builder.mutation<WatchlistItem, TrackableMovie>({
      query: (body) => ({ url: "watchlist", method: "POST", body }),
      invalidatesTags: ["Watchlist"],
    }),
    removeFromWatchlist: builder.mutation<
      { success: boolean },
      { tmdbId: number; mediaType: TrackableMovie["mediaType"] }
    >({
      query: ({ tmdbId, mediaType }) => ({
        url: `watchlist/${tmdbId}?mediaType=${mediaType}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Watchlist"],
    }),
    getWatched: builder.query<WatchedItem[], void>({
      query: () => "watched",
      providesTags: ["Watched"],
    }),
    markAsWatched: builder.mutation<WatchedItem, MarkWatchedBody>({
      query: (body) => ({ url: "watched", method: "POST", body }),
      invalidatesTags: ["Watched", "Watchlist", "Stats"],
    }),
    updateWatchedRating: builder.mutation<
      WatchedItem,
      { id: string; rating: number }
    >({
      query: ({ id, rating }) => ({
        url: `watched/${id}`,
        method: "PATCH",
        body: { rating },
      }),
      invalidatesTags: ["Watched", "Stats"],
    }),
    removeWatched: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `watched/${id}`, method: "DELETE" }),
      invalidatesTags: ["Watched", "Stats"],
    }),
    getUserStats: builder.query<UserStats, void>({
      query: () => "watched/stats",
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useGetWatchedQuery,
  useMarkAsWatchedMutation,
  useUpdateWatchedRatingMutation,
  useRemoveWatchedMutation,
  useGetUserStatsQuery,
} = backendApi;
