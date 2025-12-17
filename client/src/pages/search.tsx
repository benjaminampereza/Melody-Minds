import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/search-bar";
import { TrackCard, TrackCardSkeleton } from "@/components/track-card";
import { ArtistCard, ArtistCardSkeleton } from "@/components/artist-card";
import { AlbumCard, AlbumCardSkeleton } from "@/components/album-card";
import { PlaylistCard, PlaylistCardSkeleton } from "@/components/playlist-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Mic2, Disc3, ListMusic, Search as SearchIcon } from "lucide-react";
import type { SearchResults } from "@shared/schema";

export default function Search() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: results, isLoading, isFetched } = useQuery<SearchResults>({
    queryKey: ["/api/search", query],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: query.length > 0,
  });

  const hasResults =
    results &&
    (results.tracks.length > 0 ||
      results.artists.length > 0 ||
      results.albums.length > 0 ||
      results.playlists.length > 0);

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="mb-4 text-3xl font-bold text-foreground" data-testid="text-search-title">
          Search
        </h1>
        <SearchBar
          placeholder="What do you want to listen to?"
          value={query}
          onChange={setQuery}
          className="max-w-2xl"
        />
      </div>

      {!query && (
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <SearchIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Search for music
          </h2>
          <p className="max-w-md text-muted-foreground">
            Find tracks, artists, albums, and playlists. Start typing to discover new music.
          </p>
        </div>
      )}

      {query && isLoading && (
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Tracks</h2>
            <div className="space-y-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <TrackCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>
      )}

      {query && isFetched && !hasResults && (
        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Music className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            No results found
          </h2>
          <p className="text-muted-foreground">
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {hasResults && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" data-testid="tab-all">
              All
            </TabsTrigger>
            <TabsTrigger value="tracks" data-testid="tab-tracks">
              <Music className="mr-2 h-4 w-4" />
              Tracks
            </TabsTrigger>
            <TabsTrigger value="artists" data-testid="tab-artists">
              <Mic2 className="mr-2 h-4 w-4" />
              Artists
            </TabsTrigger>
            <TabsTrigger value="albums" data-testid="tab-albums">
              <Disc3 className="mr-2 h-4 w-4" />
              Albums
            </TabsTrigger>
            <TabsTrigger value="playlists" data-testid="tab-playlists">
              <ListMusic className="mr-2 h-4 w-4" />
              Playlists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {results!.tracks.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Tracks</h2>
                <Card>
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      {results!.tracks.slice(0, 5).map((track, index) => (
                        <TrackCard key={track.id} track={track} index={index} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {results!.artists.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Artists</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {results!.artists.slice(0, 5).map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </section>
            )}

            {results!.albums.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Albums</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {results!.albums.slice(0, 5).map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              </section>
            )}

            {results!.playlists.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Playlists</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {results!.playlists.slice(0, 5).map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              </section>
            )}
          </TabsContent>

          <TabsContent value="tracks">
            <Card>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {results!.tracks.map((track, index) => (
                    <TrackCard key={track.id} track={track} index={index} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="artists">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {results!.artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="albums">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {results!.albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playlists">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {results!.playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
