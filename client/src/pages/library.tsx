import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrackCard, TrackCardSkeleton } from "@/components/track-card";
import { AlbumCard, AlbumCardSkeleton } from "@/components/album-card";
import { ArtistCard, ArtistCardSkeleton } from "@/components/artist-card";
import { PlaylistCard, PlaylistCardSkeleton } from "@/components/playlist-card";
import { Grid3X3, List, Plus, Music, Disc3, Mic2, ListMusic } from "lucide-react";
import type { Track, Album, Artist, Playlist } from "@shared/schema";

type ViewMode = "grid" | "list";

export default function Library() {
  const [activeTab, setActiveTab] = useState("playlists");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const { data: playlists, isLoading: playlistsLoading } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
  });

  const { data: savedTracks, isLoading: tracksLoading } = useQuery<Track[]>({
    queryKey: ["/api/library/tracks"],
  });

  const { data: savedAlbums, isLoading: albumsLoading } = useQuery<Album[]>({
    queryKey: ["/api/library/albums"],
  });

  const { data: followedArtists, isLoading: artistsLoading } = useQuery<Artist[]>({
    queryKey: ["/api/library/artists"],
  });

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-library-title">
          Your Library
        </h1>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            onClick={() => setViewMode("grid")}
            data-testid="button-grid-view"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={viewMode === "list" ? "secondary" : "ghost"}
            onClick={() => setViewMode("list")}
            data-testid="button-list-view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="playlists" data-testid="tab-playlists">
            <ListMusic className="mr-2 h-4 w-4" />
            Playlists
          </TabsTrigger>
          <TabsTrigger value="tracks" data-testid="tab-tracks">
            <Music className="mr-2 h-4 w-4" />
            Liked Songs
          </TabsTrigger>
          <TabsTrigger value="albums" data-testid="tab-albums">
            <Disc3 className="mr-2 h-4 w-4" />
            Albums
          </TabsTrigger>
          <TabsTrigger value="artists" data-testid="tab-artists">
            <Mic2 className="mr-2 h-4 w-4" />
            Artists
          </TabsTrigger>
        </TabsList>

        {/* Playlists Tab */}
        <TabsContent value="playlists" className="mt-6">
          <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "space-y-2"}>
            {/* Create Playlist Card */}
            <Card className="flex cursor-pointer items-center justify-center hover-elevate" data-testid="button-create-playlist">
              <CardContent className={`flex flex-col items-center justify-center gap-3 ${viewMode === "grid" ? "aspect-square p-6" : "p-4"}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Create Playlist</span>
              </CardContent>
            </Card>

            {playlistsLoading
              ? Array.from({ length: 7 }).map((_, i) => <PlaylistCardSkeleton key={i} />)
              : playlists?.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
          </div>
        </TabsContent>

        {/* Liked Songs Tab */}
        <TabsContent value="tracks" className="mt-6">
          {viewMode === "list" ? (
            <Card>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {tracksLoading
                    ? Array.from({ length: 10 }).map((_, i) => <TrackCardSkeleton key={i} />)
                    : savedTracks?.map((track, index) => (
                        <TrackCard key={track.id} track={track} index={index} isLiked />
                      ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {tracksLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 p-4">
                      <div className="aspect-square animate-pulse rounded-md bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                      </div>
                    </div>
                  ))
                : savedTracks?.map((track) => (
                    <Card key={track.id} className="group hover-elevate cursor-pointer" data-testid={`saved-track-${track.id}`}>
                      <CardContent className="p-4">
                        <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                          {track.album.imageUrl ? (
                            <img
                              src={track.album.imageUrl}
                              alt={track.album.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10">
                              <Music className="h-8 w-8 text-primary/50" />
                            </div>
                          )}
                        </div>
                        <div className="mt-3 min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{track.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {track.artists.map((a) => a.name).join(", ")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          )}
        </TabsContent>

        {/* Albums Tab */}
        <TabsContent value="albums" className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {albumsLoading
              ? Array.from({ length: 10 }).map((_, i) => <AlbumCardSkeleton key={i} />)
              : savedAlbums?.map((album) => <AlbumCard key={album.id} album={album} />)}
          </div>
        </TabsContent>

        {/* Artists Tab */}
        <TabsContent value="artists" className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {artistsLoading
              ? Array.from({ length: 12 }).map((_, i) => <ArtistCardSkeleton key={i} />)
              : followedArtists?.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty States */}
      {!playlistsLoading && activeTab === "playlists" && playlists?.length === 0 && (
        <EmptyState
          icon={ListMusic}
          title="No playlists yet"
          description="Create your first playlist to start organizing your music"
        />
      )}
      {!tracksLoading && activeTab === "tracks" && savedTracks?.length === 0 && (
        <EmptyState
          icon={Music}
          title="No liked songs"
          description="Save songs you love by clicking the heart icon"
        />
      )}
      {!albumsLoading && activeTab === "albums" && savedAlbums?.length === 0 && (
        <EmptyState
          icon={Disc3}
          title="No saved albums"
          description="Save albums to easily access them later"
        />
      )}
      {!artistsLoading && activeTab === "artists" && followedArtists?.length === 0 && (
        <EmptyState
          icon={Mic2}
          title="No followed artists"
          description="Follow your favorite artists to see them here"
        />
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
