import { pgTable, text, varchar, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for app users
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  email: text("email"),
  imageUrl: text("image_url"),
  country: text("country"),
  subscription: text("subscription"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Track type for music tracks
export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  durationMs: number;
  previewUrl: string | null;
  externalUrl: string;
  popularity: number;
  explicit: boolean;
  audioFeatures?: AudioFeatures;
}

// Artist type
export interface Artist {
  id: string;
  name: string;
  imageUrl: string | null;
  genres: string[];
  popularity: number;
  externalUrl: string;
}

// Album type
export interface Album {
  id: string;
  name: string;
  imageUrl: string;
  releaseDate: string;
  totalTracks: number;
  artists: { id: string; name: string }[];
  externalUrl: string;
}

// Playlist type
export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  owner: { id: string; displayName: string };
  trackCount: number;
  isPublic: boolean;
  externalUrl: string;
  tracks?: Track[];
}

// Audio features for detailed track analysis
export interface AudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  timeSignature: number;
}

// Recently played track with timestamp
export interface RecentlyPlayedTrack {
  track: Track;
  playedAt: string;
}

// User's top items response
export interface TopItemsResponse<T> {
  items: T[];
  total: number;
  timeRange: "short_term" | "medium_term" | "long_term";
}

// Search result types
export interface SearchResults {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

// Recommendation parameters
export interface RecommendationParams {
  seedTracks?: string[];
  seedArtists?: string[];
  seedGenres?: string[];
  targetEnergy?: number;
  targetDanceability?: number;
  targetValence?: number;
  targetTempo?: number;
  minPopularity?: number;
  limit?: number;
}

// AI-enhanced recommendation with explanation
export interface AIRecommendation {
  tracks: Track[];
  explanation: string;
  mood: string;
  suggestedPlaylistName: string;
}

// Listening stats for dashboard
export interface ListeningStats {
  totalMinutesListened: number;
  topGenre: string;
  tracksDiscovered: number;
  playlistsCreated: number;
  averageEnergy: number;
  averageValence: number;
  listeningByHour: { hour: number; minutes: number }[];
  genreDistribution: { genre: string; percentage: number }[];
}

// Device for playback
export interface Device {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  volumePercent: number;
}

// Playback state
export interface PlaybackState {
  isPlaying: boolean;
  currentTrack: Track | null;
  progressMs: number;
  durationMs: number;
  shuffleState: boolean;
  repeatState: "off" | "track" | "context";
  device: Device | null;
  volume: number;
}

// Smart playlist generation request
export interface SmartPlaylistRequest {
  mood?: string;
  activity?: string;
  energyRange?: { min: number; max: number };
  tempoRange?: { min: number; max: number };
  genres?: string[];
  trackCount?: number;
}

// Genre seed for recommendations
export interface GenreSeed {
  name: string;
  displayName: string;
}

// Time range options
export type TimeRange = "short_term" | "medium_term" | "long_term";

// Search filter options
export interface SearchFilters {
  type: ("track" | "artist" | "album" | "playlist")[];
  limit?: number;
  offset?: number;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
