export type MediaType = "MOVIE" | "TV";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  addedAt: string;
}

export interface WatchedItem {
  id: string;
  userId: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  genreIds: number[];
  rating: number | null;
  watchedAt: string;
}

export interface TrackableMovie {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  genreIds?: number[];
}

export interface GenreStat {
  id: number;
  name: string;
  count: number;
}

export interface UserStats {
  totalWatched: number;
  totalWatchlist: number;
  thisMonth: number;
  thisYear: number;
  moviesCount: number;
  tvCount: number;
  avgRating: number | null;
  topGenres: GenreStat[];
}
