import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Wand2, Play, Save, ListMusic } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrackCard, TrackCardSkeleton } from "@/components/track-card";
import { SmartPlaylistCreator } from "@/components/smart-playlist-creator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Track, Playlist, SmartPlaylistRequest } from "@shared/schema";

export default function SmartPlaylists() {
  const [generatedTracks, setGeneratedTracks] = useState<Track[]>([]);
  const [playlistInfo, setPlaylistInfo] = useState<{ name: string; description: string } | null>(null);
  const { toast } = useToast();

  const { data: smartPlaylists, isLoading: playlistsLoading } = useQuery<Playlist[]>({
    queryKey: ["/api/smart-playlists"],
  });

  const generateMutation = useMutation({
    mutationFn: async (request: SmartPlaylistRequest) => {
      const response = await apiRequest("POST", "/api/smart-playlists/generate", request);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedTracks(data.tracks || []);
      setPlaylistInfo({ name: data.name, description: data.description });
      toast({
        title: "Playlist Generated",
        description: `Created "${data.name}" with ${data.tracks?.length || 0} tracks`,
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Could not generate playlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/smart-playlists/save", {
        name: playlistInfo?.name,
        description: playlistInfo?.description,
        tracks: generatedTracks.map((t) => t.id),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/smart-playlists"] });
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({
        title: "Playlist Saved",
        description: `"${playlistInfo?.name}" has been added to your library`,
      });
      setGeneratedTracks([]);
      setPlaylistInfo(null);
    },
  });

  return (
    <div className="space-y-8 pb-24">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground" data-testid="text-smart-playlists-title">
          Smart Playlists
        </h1>
        <p className="text-muted-foreground">
          Let AI create the perfect playlist for any mood, activity, or occasion
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Creator */}
        <div className="lg:col-span-1">
          <SmartPlaylistCreator
            onCreate={(request) => generateMutation.mutate(request)}
            isLoading={generateMutation.isPending}
          />
        </div>

        {/* Generated Playlist */}
        <div className="space-y-6 lg:col-span-2">
          {generatedTracks.length > 0 && playlistInfo && (
            <Card data-testid="generated-playlist">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    {playlistInfo.name}
                  </CardTitle>
                  <CardDescription>{playlistInfo.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending}
                    data-testid="button-save-playlist"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button data-testid="button-play-all">
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    Play All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {generatedTracks.map((track, index) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      index={index}
                      showAudioFeatures
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {generatedTracks.length === 0 && !generateMutation.isPending && (
            <Card>
              <CardContent className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Wand2 className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Create Your Perfect Playlist
                </h2>
                <p className="max-w-md text-muted-foreground">
                  Use the controls on the left to set your preferences, then let AI generate a personalized playlist just for you.
                </p>
              </CardContent>
            </Card>
          )}

          {generateMutation.isPending && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Generating Your Playlist...
                </CardTitle>
                <CardDescription>
                  Our AI is analyzing your preferences and finding the perfect tracks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <TrackCardSkeleton key={i} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Previously Created Smart Playlists */}
          {smartPlaylists && smartPlaylists.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Your AI-Generated Playlists
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {smartPlaylists.map((playlist) => (
                  <Card
                    key={playlist.id}
                    className="group cursor-pointer hover-elevate"
                    data-testid={`smart-playlist-${playlist.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-muted">
                        {playlist.imageUrl ? (
                          <img
                            src={playlist.imageUrl}
                            alt={playlist.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10">
                            <ListMusic className="h-12 w-12 text-primary/50" />
                          </div>
                        )}
                        <Button
                          size="icon"
                          className="absolute bottom-2 right-2 h-10 w-10 translate-y-2 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
                        >
                          <Play className="h-5 w-5 fill-current" />
                        </Button>
                      </div>
                      <p className="truncate font-medium text-foreground">{playlist.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {playlist.trackCount} tracks
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        <Wand2 className="mr-1 h-3 w-3" />
                        AI Generated
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
