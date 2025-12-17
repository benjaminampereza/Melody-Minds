import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get listening stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getListeningStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Get recently played tracks
  app.get("/api/recently-played", async (req, res) => {
    try {
      const tracks = await storage.getRecentlyPlayed();
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recently played" });
    }
  });

  // Get top tracks
  app.get("/api/top-tracks", async (req, res) => {
    try {
      const timeRange = (req.query.timeRange as string) || "short_term";
      const tracks = await storage.getTopTracks(timeRange);
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top tracks" });
    }
  });

  // Get top artists
  app.get("/api/top-artists", async (req, res) => {
    try {
      const timeRange = (req.query.timeRange as string) || "short_term";
      const artists = await storage.getTopArtists(timeRange);
      res.json(artists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top artists" });
    }
  });

  // Get user playlists
  app.get("/api/playlists", async (req, res) => {
    try {
      const playlists = await storage.getPlaylists();
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch playlists" });
    }
  });

  // Get saved tracks (library)
  app.get("/api/library/tracks", async (req, res) => {
    try {
      const tracks = await storage.getSavedTracks();
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved tracks" });
    }
  });

  // Get saved albums (library)
  app.get("/api/library/albums", async (req, res) => {
    try {
      const albums = await storage.getSavedAlbums();
      res.json(albums);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved albums" });
    }
  });

  // Get followed artists (library)
  app.get("/api/library/artists", async (req, res) => {
    try {
      const artists = await storage.getFollowedArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch followed artists" });
    }
  });

  // Get genre seeds for recommendations
  app.get("/api/genres", async (req, res) => {
    try {
      const genres = await storage.getGenreSeeds();
      res.json(genres);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch genres" });
    }
  });

  // Get recommendations
  app.get("/api/recommendations", async (req, res) => {
    try {
      const recommendations = await storage.getRecommendations();
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  // Generate recommendations with parameters
  app.post("/api/recommendations/generate", async (req, res) => {
    try {
      const params = req.body;
      // In a real app, this would call Spotify's recommendations API with the params
      const recommendations = await storage.getRecommendations();
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  // Get AI-enhanced recommendations
  app.get("/api/ai-recommendations", async (req, res) => {
    try {
      const aiRecs = await storage.getAIRecommendations();
      res.json(aiRecs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI recommendations" });
    }
  });

  // Get smart playlists
  app.get("/api/smart-playlists", async (req, res) => {
    try {
      const playlists = await storage.getSmartPlaylists();
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch smart playlists" });
    }
  });

  // Generate smart playlist with AI
  app.post("/api/smart-playlists/generate", async (req, res) => {
    try {
      const request = req.body;
      
      // Use OpenAI to generate playlist name and description
      const prompt = `Generate a creative playlist name and description based on these preferences:
      - Mood: ${request.mood || "any"}
      - Activity: ${request.activity || "any"}
      - Genres: ${request.genres?.join(", ") || "mixed"}
      - Energy: ${request.energyRange?.min || 0}% to ${request.energyRange?.max || 100}%
      
      Respond with JSON: { "name": "playlist name", "description": "short description" }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_completion_tokens: 150,
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{"name": "AI Mix", "description": "Curated just for you"}');
      
      // Get sample tracks for the playlist
      const tracks = await storage.getRecommendations();
      const selectedTracks = tracks.slice(0, request.trackCount || 25);

      res.json({
        name: aiResponse.name,
        description: aiResponse.description,
        tracks: selectedTracks,
      });
    } catch (error) {
      console.error("Error generating smart playlist:", error);
      // Fallback if OpenAI fails
      const tracks = await storage.getRecommendations();
      res.json({
        name: "Your Custom Mix",
        description: "A personalized playlist based on your preferences",
        tracks: tracks.slice(0, req.body.trackCount || 25),
      });
    }
  });

  // Save smart playlist
  app.post("/api/smart-playlists/save", async (req, res) => {
    try {
      const { name, description, tracks } = req.body;
      // In a real app, this would save to Spotify
      res.json({ success: true, playlistId: `new-${Date.now()}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to save playlist" });
    }
  });

  // Search
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        res.json({ tracks: [], artists: [], albums: [], playlists: [] });
        return;
      }
      const results = await storage.search(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  return httpServer;
}
