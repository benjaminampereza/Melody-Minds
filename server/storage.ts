import { type User, type InsertUser, type Track, type Artist, type Album, type Playlist, type AudioFeatures, type RecentlyPlayedTrack, type ListeningStats, type GenreSeed, type SearchResults, type AIRecommendation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getListeningStats(): Promise<ListeningStats>;
  getRecentlyPlayed(): Promise<RecentlyPlayedTrack[]>;
  getTopTracks(timeRange: string): Promise<Track[]>;
  getTopArtists(timeRange: string): Promise<Artist[]>;
  getPlaylists(): Promise<Playlist[]>;
  getSavedTracks(): Promise<Track[]>;
  getSavedAlbums(): Promise<Album[]>;
  getFollowedArtists(): Promise<Artist[]>;
  getGenreSeeds(): Promise<GenreSeed[]>;
  getRecommendations(): Promise<Track[]>;
  getAIRecommendations(): Promise<AIRecommendation>;
  getSmartPlaylists(): Promise<Playlist[]>;
  search(query: string): Promise<SearchResults>;
}

// Sample data generators
function generateSampleArtist(id: string, name: string, imageUrl: string, genres: string[]): Artist {
  return {
    id,
    name,
    imageUrl,
    genres,
    popularity: Math.floor(Math.random() * 40) + 60,
    externalUrl: `https://open.spotify.com/artist/${id}`,
  };
}

function generateSampleAlbum(id: string, name: string, artistName: string, imageUrl: string): Album {
  return {
    id,
    name,
    imageUrl,
    releaseDate: `202${Math.floor(Math.random() * 4)}-0${Math.floor(Math.random() * 9) + 1}-15`,
    totalTracks: Math.floor(Math.random() * 12) + 8,
    artists: [{ id: `artist-${id}`, name: artistName }],
    externalUrl: `https://open.spotify.com/album/${id}`,
  };
}

function generateAudioFeatures(id: string): AudioFeatures {
  return {
    id,
    danceability: Math.random() * 0.5 + 0.3,
    energy: Math.random() * 0.6 + 0.3,
    key: Math.floor(Math.random() * 12),
    loudness: -Math.random() * 10 - 3,
    mode: Math.random() > 0.5 ? 1 : 0,
    speechiness: Math.random() * 0.2 + 0.03,
    acousticness: Math.random() * 0.5 + 0.1,
    instrumentalness: Math.random() * 0.3,
    liveness: Math.random() * 0.3 + 0.1,
    valence: Math.random() * 0.6 + 0.2,
    tempo: Math.floor(Math.random() * 80) + 80,
    timeSignature: 4,
  };
}

function generateSampleTrack(id: string, name: string, artistName: string, albumName: string, imageUrl: string): Track {
  return {
    id,
    name,
    artists: [generateSampleArtist(`artist-${id}`, artistName, imageUrl, ["pop", "electronic"])],
    album: generateSampleAlbum(`album-${id}`, albumName, artistName, imageUrl),
    durationMs: Math.floor(Math.random() * 120000) + 180000,
    previewUrl: null,
    externalUrl: `https://open.spotify.com/track/${id}`,
    popularity: Math.floor(Math.random() * 40) + 60,
    explicit: Math.random() > 0.7,
    audioFeatures: generateAudioFeatures(id),
  };
}

// Sample music data
const sampleArtists: Artist[] = [
  generateSampleArtist("1", "Taylor Swift", "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3bc19e5c2fa", ["pop", "country"]),
  generateSampleArtist("2", "The Weeknd", "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb", ["r-n-b", "pop"]),
  generateSampleArtist("3", "Dua Lipa", "https://i.scdn.co/image/ab6761610000e5eb17e0d0c3b0b2c2c2b0b2c2c2", ["pop", "dance"]),
  generateSampleArtist("4", "Drake", "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9", ["hip-hop", "rap"]),
  generateSampleArtist("5", "Billie Eilish", "https://i.scdn.co/image/ab6761610000e5ebd8b9980db67272cb4d2c3daf", ["pop", "alternative"]),
  generateSampleArtist("6", "Ed Sheeran", "https://i.scdn.co/image/ab6761610000e5eb3bcef85e105dfc42399ef0ba", ["pop", "folk"]),
  generateSampleArtist("7", "Ariana Grande", "https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952", ["pop", "r-n-b"]),
  generateSampleArtist("8", "Bad Bunny", "https://i.scdn.co/image/ab6761610000e5eb9ad8f20d00baca7e5c2b5678", ["latin", "reggaeton"]),
];

const sampleTracks: Track[] = [
  generateSampleTrack("t1", "Anti-Hero", "Taylor Swift", "Midnights", "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5"),
  generateSampleTrack("t2", "Blinding Lights", "The Weeknd", "After Hours", "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36"),
  generateSampleTrack("t3", "Levitating", "Dua Lipa", "Future Nostalgia", "https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946"),
  generateSampleTrack("t4", "One Dance", "Drake", "Views", "https://i.scdn.co/image/ab67616d0000b273c25f28e2c6ec1c9e6e25f5c2"),
  generateSampleTrack("t5", "Bad Guy", "Billie Eilish", "When We All Fall Asleep", "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce"),
  generateSampleTrack("t6", "Shape of You", "Ed Sheeran", "Divide", "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96"),
  generateSampleTrack("t7", "7 Rings", "Ariana Grande", "Thank U, Next", "https://i.scdn.co/image/ab67616d0000b27356ac7b86e090f307e218e9c8"),
  generateSampleTrack("t8", "Dakiti", "Bad Bunny", "El Ultimo Tour", "https://i.scdn.co/image/ab67616d0000b273005ee0c300471f8e02d34c4a"),
  generateSampleTrack("t9", "Save Your Tears", "The Weeknd", "After Hours", "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36"),
  generateSampleTrack("t10", "Don't Start Now", "Dua Lipa", "Future Nostalgia", "https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946"),
  generateSampleTrack("t11", "Cruel Summer", "Taylor Swift", "Lover", "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647"),
  generateSampleTrack("t12", "Starboy", "The Weeknd", "Starboy", "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452"),
  generateSampleTrack("t13", "Thinking Out Loud", "Ed Sheeran", "X", "https://i.scdn.co/image/ab67616d0000b273407981084d79d283e24d428e"),
  generateSampleTrack("t14", "Thank U, Next", "Ariana Grande", "Thank U, Next", "https://i.scdn.co/image/ab67616d0000b27356ac7b86e090f307e218e9c8"),
  generateSampleTrack("t15", "Titi Me Pregunto", "Bad Bunny", "Un Verano Sin Ti", "https://i.scdn.co/image/ab67616d0000b27349d694203245f241a1bcaa72"),
];

const samplePlaylists: Playlist[] = [
  {
    id: "p1",
    name: "Today's Top Hits",
    description: "The hottest tracks right now",
    imageUrl: "https://i.scdn.co/image/ab67706f00000003e8e28219724c2423afa4d320",
    owner: { id: "spotify", displayName: "Spotify" },
    trackCount: 50,
    isPublic: true,
    externalUrl: "https://open.spotify.com/playlist/p1",
  },
  {
    id: "p2",
    name: "Chill Vibes",
    description: "Relax and unwind with these tracks",
    imageUrl: "https://i.scdn.co/image/ab67706f00000003ca5a7517156021292e5663a6",
    owner: { id: "user1", displayName: "You" },
    trackCount: 32,
    isPublic: false,
    externalUrl: "https://open.spotify.com/playlist/p2",
  },
  {
    id: "p3",
    name: "Workout Mix",
    description: "High energy tracks for your workout",
    imageUrl: "https://i.scdn.co/image/ab67706f00000003bd0e19e810bb4b55ab164a95",
    owner: { id: "user1", displayName: "You" },
    trackCount: 45,
    isPublic: true,
    externalUrl: "https://open.spotify.com/playlist/p3",
  },
  {
    id: "p4",
    name: "Late Night Feelings",
    description: "Emotional and atmospheric tunes",
    imageUrl: "https://i.scdn.co/image/ab67706f000000035f0ff9251e3b3cf429c9de2e",
    owner: { id: "user1", displayName: "You" },
    trackCount: 28,
    isPublic: false,
    externalUrl: "https://open.spotify.com/playlist/p4",
  },
];

const genreSeeds: GenreSeed[] = [
  { name: "pop", displayName: "Pop" },
  { name: "rock", displayName: "Rock" },
  { name: "hip-hop", displayName: "Hip Hop" },
  { name: "electronic", displayName: "Electronic" },
  { name: "r-n-b", displayName: "R&B" },
  { name: "jazz", displayName: "Jazz" },
  { name: "classical", displayName: "Classical" },
  { name: "indie", displayName: "Indie" },
  { name: "folk", displayName: "Folk" },
  { name: "country", displayName: "Country" },
  { name: "latin", displayName: "Latin" },
  { name: "metal", displayName: "Metal" },
  { name: "dance", displayName: "Dance" },
  { name: "soul", displayName: "Soul" },
  { name: "reggae", displayName: "Reggae" },
  { name: "blues", displayName: "Blues" },
  { name: "punk", displayName: "Punk" },
  { name: "ambient", displayName: "Ambient" },
  { name: "funk", displayName: "Funk" },
  { name: "disco", displayName: "Disco" },
];

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getListeningStats(): Promise<ListeningStats> {
    return {
      totalMinutesListened: 2847,
      topGenre: "Pop",
      tracksDiscovered: 156,
      playlistsCreated: 8,
      averageEnergy: 0.68,
      averageValence: 0.55,
      listeningByHour: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        minutes: Math.floor(Math.random() * 60) + (hour >= 18 && hour <= 23 ? 40 : 10),
      })),
      genreDistribution: [
        { genre: "Pop", percentage: 35 },
        { genre: "Hip Hop", percentage: 22 },
        { genre: "R&B", percentage: 18 },
        { genre: "Electronic", percentage: 15 },
        { genre: "Other", percentage: 10 },
      ],
    };
  }

  async getRecentlyPlayed(): Promise<RecentlyPlayedTrack[]> {
    const now = new Date();
    return sampleTracks.slice(0, 8).map((track, index) => ({
      track,
      playedAt: new Date(now.getTime() - index * 3600000).toISOString(),
    }));
  }

  async getTopTracks(timeRange: string): Promise<Track[]> {
    const shuffled = [...sampleTracks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }

  async getTopArtists(timeRange: string): Promise<Artist[]> {
    const shuffled = [...sampleArtists].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  }

  async getPlaylists(): Promise<Playlist[]> {
    return samplePlaylists;
  }

  async getSavedTracks(): Promise<Track[]> {
    return sampleTracks.slice(0, 12);
  }

  async getSavedAlbums(): Promise<Album[]> {
    return sampleTracks.slice(0, 8).map((t) => t.album);
  }

  async getFollowedArtists(): Promise<Artist[]> {
    return sampleArtists;
  }

  async getGenreSeeds(): Promise<GenreSeed[]> {
    return genreSeeds;
  }

  async getRecommendations(): Promise<Track[]> {
    const shuffled = [...sampleTracks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 15);
  }

  async getAIRecommendations(): Promise<AIRecommendation> {
    return {
      tracks: sampleTracks.slice(0, 10),
      explanation: "Based on your recent listening, you seem to enjoy upbeat pop tracks with catchy melodies. These recommendations blend your favorite artists with similar sounds you might love.",
      mood: "Energetic & Positive",
      suggestedPlaylistName: "Your Perfect Mix",
    };
  }

  async getSmartPlaylists(): Promise<Playlist[]> {
    return [
      {
        id: "smart1",
        name: "Morning Energy Boost",
        description: "AI-curated tracks to start your day",
        imageUrl: null,
        owner: { id: "ai", displayName: "AI" },
        trackCount: 25,
        isPublic: false,
        externalUrl: "",
      },
      {
        id: "smart2",
        name: "Focus Flow",
        description: "Instrumental tracks for deep concentration",
        imageUrl: null,
        owner: { id: "ai", displayName: "AI" },
        trackCount: 30,
        isPublic: false,
        externalUrl: "",
      },
    ];
  }

  async search(query: string): Promise<SearchResults> {
    const lowerQuery = query.toLowerCase();
    return {
      tracks: sampleTracks.filter(
        (t) => t.name.toLowerCase().includes(lowerQuery) ||
               t.artists.some((a) => a.name.toLowerCase().includes(lowerQuery))
      ),
      artists: sampleArtists.filter((a) => a.name.toLowerCase().includes(lowerQuery)),
      albums: sampleTracks
        .map((t) => t.album)
        .filter((a) => a.name.toLowerCase().includes(lowerQuery))
        .filter((album, index, self) => self.findIndex((a) => a.id === album.id) === index),
      playlists: samplePlaylists.filter(
        (p) => p.name.toLowerCase().includes(lowerQuery) ||
               (p.description?.toLowerCase().includes(lowerQuery) ?? false)
      ),
    };
  }
}

export const storage = new MemStorage();
