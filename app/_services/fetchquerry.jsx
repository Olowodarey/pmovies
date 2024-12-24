import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = '8452b73599d162bf3f2a5b911e2849e9';
const BASE_URL = 'https://api.themoviedb.org/3/';

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NDUyYjczNTk5ZDE2MmJmM2YyYTViOTExZTI4NDllOSIsIm5iZiI6MTczNDYzMzQwNS43MTI5OTk4LCJzdWIiOiI2NzY0NjdiZGU1NDEzM2ZjOGFhNGZjNjAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.aDSDj83dRSLrbiAILtX-6K9jKTaTQyKd8Zj5zPn79Hk';

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${ACCESS_TOKEN}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchTrendingMovies: builder.query({
      query: (timeWindow = 'day') => `trending/movie/${timeWindow}`,
    }),
    fetchUpComing: builder.query({
      query: () => `movie/upcoming`
    }),
    fetchSeries: builder.query({
      query: () => `tv/top_rated`
    }),
    fetchAnimatedMovies: builder.query({ 
      query: () => `discover/movie?with_genres=16`,
     }),
     fetchMovieById: builder.query({ 
      query: (id) => `movie/${id}` 
    }),
    fetchMovieVideo: builder.query({
      query: (id) => `movie/${id}/videos`
    }),
    fetchSimilarMovies: builder.query({
      query: (id) => `movie/${id}/similar`
    })
  }),
});

export const { 
  useFetchTrendingMoviesQuery,
  useFetchUpComingQuery, 
  useFetchSeriesQuery, 
  useFetchAnimatedMoviesQuery, 
  useFetchMovieByIdQuery, 
  useFetchMovieVideoQuery, 
  useFetchSimilarMoviesQuery 
} = tmdbApi;
