export type MediaType = "MOVIE" | "TV";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
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
  rating: number | null;
  watchedAt: string;
}

export interface TrackableMovie {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
}
