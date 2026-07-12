import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Movie,
  MovieDetails,
  PaginatedResponse,
  Series,
  Video,
} from "@/app/_types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3/";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

interface VideoResponse {
  results: Video[];
}

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${ACCESS_TOKEN}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchTrendingMovies: builder.query<PaginatedResponse<Movie>, "day" | "week" | void>({
      query: (timeWindow = "day") => `trending/movie/${timeWindow}`,
    }),
    fetchUpComing: builder.query<PaginatedResponse<Movie>, void>({
      query: () => `movie/upcoming`,
    }),
    fetchSeries: builder.query<PaginatedResponse<Series>, void>({
      query: () => `tv/top_rated`,
    }),
    fetchAnimatedMovies: builder.query<PaginatedResponse<Movie>, void>({
      query: () => `discover/movie?with_genres=16`,
    }),
    fetchMovieById: builder.query<MovieDetails, string | string[]>({
      query: (id) => `movie/${id}`,
    }),
    fetchMovieVideo: builder.query<VideoResponse, string | string[]>({
      query: (id) => `movie/${id}/videos`,
    }),
    fetchSimilarMovies: builder.query<PaginatedResponse<Movie>, string | string[]>({
      query: (id) => `movie/${id}/similar`,
    }),
    fetchSearchMovies: builder.query<PaginatedResponse<Movie>, string>({
      query: (title) => `search/movie?query=${encodeURIComponent(title)}`,
    }),
  }),
});

export const {
  useFetchTrendingMoviesQuery,
  useFetchUpComingQuery,
  useFetchSeriesQuery,
  useFetchAnimatedMoviesQuery,
  useFetchMovieByIdQuery,
  useFetchMovieVideoQuery,
  useFetchSimilarMoviesQuery,
  useFetchSearchMoviesQuery,
} = tmdbApi;
