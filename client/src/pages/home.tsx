import { useQuery } from "@tanstack/react-query";
import { Clock, Music, ListMusic, TrendingUp, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StatsCard, StatsCardSkeleton } from "@/components/stats-card";
import { TrackCard, TrackCardSkeleton } from "@/components/track-card";
import { ArtistCard, ArtistCardSkeleton } from "@/components/artist-card";
import { ListeningActivityChart, GenreDistributionChart, ChartSkeleton } from "@/components/listening-chart";
import type { Track, Artist, ListeningStats, RecentlyPlayedTrack } from "@shared/schema";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useQuery<ListeningStats>({
    queryKey: ["/api/stats"],
  });

  const { data: recentlyPlayed, isLoading: recentLoading } = useQuery<RecentlyPlayedTrack[]>({
    queryKey: ["/api/recently-played"],
  });

  const { data: topTracks, isLoading: topTracksLoading } = useQuery<Track[]>({
    queryKey: ["/api/top-tracks", "short_term"],
  });

  const { data: topArtists, isLoading: topArtistsLoading } = useQuery<Artist[]>({
    queryKey: ["/api/top-artists", "short_term"],
  });

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Stats Section */}
      <section>
        <h1 className="mb-6 text-3xl font-bold text-foreground" data-testid="text-page-title">
          Your Music Dashboard
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <StatsCard
                title="Listening Time"
                value={`${Math.round((stats?.totalMinutesListened || 0) / 60)}h`}
                subtitle="This month"
                icon={Clock}
              />
              <StatsCard
                title="Top Genre"
                value={stats?.topGenre || "—"}
                subtitle="Most played"
                icon={Music}
              />
              <StatsCard
                title="Tracks Discovered"
                value={stats?.tracksDiscovered || 0}
                subtitle="New to you"
                icon={TrendingUp}
              />
              <StatsCard
                title="Playlists Created"
                value={stats?.playlistsCreated || 0}
                subtitle="AI generated"
                icon={ListMusic}
              />
            </>
          )}
        </div>
      </section>

      {/* Recently Played */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recently Played</h2>
          <Button variant="ghost" size="sm" data-testid="button-see-all-recent">
            See all
          </Button>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-4">
            {recentLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="w-[180px] flex-shrink-0">
                    <CardContent className="p-4">
                      <div className="aspect-square animate-pulse rounded-md bg-muted" />
                      <div className="mt-3 space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : recentlyPlayed?.slice(0, 8).map((item) => (
                  <Card
                    key={`${item.track.id}-${item.playedAt}`}
                    className="group w-[180px] flex-shrink-0 hover-elevate cursor-pointer"
                    data-testid={`recent-track-${item.track.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                        {item.track.album.imageUrl ? (
                          <img
                            src={item.track.album.imageUrl}
                            alt={item.track.album.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10">
                            <Music className="h-8 w-8 text-primary/50" />
                          </div>
                        )}
                        <Button
                          size="icon"
                          className="absolute bottom-2 right-2 h-10 w-10 translate-y-2 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
                        >
                          <Play className="h-5 w-5 fill-current" />
                        </Button>
                      </div>
                      <div className="mt-3 min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.track.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.track.artists.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Charts Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        {statsLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <ListeningActivityChart
              data={stats?.listeningByHour || []}
              title="Listening Activity by Hour"
            />
            <GenreDistributionChart
              data={stats?.genreDistribution || []}
              title="Your Top Genres"
            />
          </>
        )}
      </section>

      {/* Top Tracks & Artists */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Top Tracks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-lg">Top Tracks</CardTitle>
            <Button variant="ghost" size="sm" data-testid="button-see-all-tracks">
              See all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {topTracksLoading
                ? Array.from({ length: 5 }).map((_, i) => <TrackCardSkeleton key={i} />)
                : topTracks?.slice(0, 5).map((track, index) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      index={index}
                    />
                  ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Artists */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-lg">Top Artists</CardTitle>
            <Button variant="ghost" size="sm" data-testid="button-see-all-artists">
              See all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {topArtistsLoading
                ? Array.from({ length: 6 }).map((_, i) => <ArtistCardSkeleton key={i} />)
                : topArtists?.slice(0, 6).map((artist, index) => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                      rank={index + 1}
                    />
                  ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
