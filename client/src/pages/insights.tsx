import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Clock,
  Music,
  TrendingUp,
  Calendar,
  Zap,
  Smile,
  Headphones,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatsCard, StatsCardSkeleton } from "@/components/stats-card";
import { ArtistCard, ArtistCardSkeleton } from "@/components/artist-card";
import { TrackCard, TrackCardSkeleton } from "@/components/track-card";
import {
  ListeningActivityChart,
  GenreDistributionChart,
  ChartSkeleton,
} from "@/components/listening-chart";
import type { ListeningStats, Track, Artist, TimeRange } from "@shared/schema";

export default function Insights() {
  const [timeRange, setTimeRange] = useState<TimeRange>("short_term");

  const { data: stats, isLoading: statsLoading } = useQuery<ListeningStats>({
    queryKey: ["/api/stats"],
  });

  const { data: topTracks, isLoading: tracksLoading } = useQuery<Track[]>({
    queryKey: ["/api/top-tracks", timeRange],
  });

  const { data: topArtists, isLoading: artistsLoading } = useQuery<Artist[]>({
    queryKey: ["/api/top-artists", timeRange],
  });

  const timeRangeLabels: Record<TimeRange, string> = {
    short_term: "Last 4 Weeks",
    medium_term: "Last 6 Months",
    long_term: "All Time",
  };

  return (
    <div className="space-y-8 pb-24">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground" data-testid="text-insights-title">
          Listening Insights
        </h1>
        <p className="text-muted-foreground">
          Discover patterns in your music listening habits
        </p>
      </div>

      {/* Stats Overview */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Overview</h2>
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
                title="Total Listening"
                value={`${Math.round((stats?.totalMinutesListened || 0) / 60)}h`}
                subtitle="Hours this month"
                icon={Clock}
              />
              <StatsCard
                title="Average Energy"
                value={`${Math.round((stats?.averageEnergy || 0) * 100)}%`}
                subtitle="Your music energy level"
                icon={Zap}
              />
              <StatsCard
                title="Mood Score"
                value={`${Math.round((stats?.averageValence || 0) * 100)}%`}
                subtitle="Overall music positivity"
                icon={Smile}
              />
              <StatsCard
                title="New Discoveries"
                value={stats?.tracksDiscovered || 0}
                subtitle="New tracks found"
                icon={TrendingUp}
              />
            </>
          )}
        </div>
      </section>

      {/* Charts */}
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
              title="When You Listen"
            />
            <GenreDistributionChart
              data={stats?.genreDistribution || []}
              title="Genre Breakdown"
            />
          </>
        )}
      </section>

      {/* Audio Profile */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Your Audio Profile</h2>
        <Card>
          <CardContent className="grid gap-6 p-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    Energy Level
                  </span>
                  <span className="font-medium text-foreground">
                    {Math.round((stats?.averageEnergy || 0) * 100)}%
                  </span>
                </div>
                <Progress value={(stats?.averageEnergy || 0) * 100} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Smile className="h-4 w-4" />
                    Mood (Valence)
                  </span>
                  <span className="font-medium text-foreground">
                    {Math.round((stats?.averageValence || 0) * 100)}%
                  </span>
                </div>
                <Progress value={(stats?.averageValence || 0) * 100} />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="gap-1">
                    <Music className="h-3 w-3" />
                    Top Genre
                  </Badge>
                  <span className="font-medium text-foreground">{stats?.topGenre || "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="gap-1">
                    <Headphones className="h-3 w-3" />
                    Tracks Played
                  </Badge>
                  <span className="font-medium text-foreground">
                    {stats?.tracksDiscovered || 0} unique
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    Playlists
                  </Badge>
                  <span className="font-medium text-foreground">
                    {stats?.playlistsCreated || 0} created
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Top Items by Time Range */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Your Top Music</h2>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <TabsList>
              <TabsTrigger value="short_term" data-testid="tab-4-weeks">
                4 Weeks
              </TabsTrigger>
              <TabsTrigger value="medium_term" data-testid="tab-6-months">
                6 Months
              </TabsTrigger>
              <TabsTrigger value="long_term" data-testid="tab-all-time">
                All Time
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Tracks */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Top Tracks
                <Badge variant="secondary" className="ml-auto">
                  {timeRangeLabels[timeRange]}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {tracksLoading
                  ? Array.from({ length: 5 }).map((_, i) => <TrackCardSkeleton key={i} />)
                  : topTracks?.slice(0, 5).map((track, index) => (
                      <TrackCard key={track.id} track={track} index={index} />
                    ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Artists */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Top Artists
                <Badge variant="secondary" className="ml-auto">
                  {timeRangeLabels[timeRange]}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {artistsLoading
                  ? Array.from({ length: 6 }).map((_, i) => <ArtistCardSkeleton key={i} />)
                  : topArtists?.slice(0, 6).map((artist, index) => (
                      <ArtistCard key={artist.id} artist={artist} rank={index + 1} />
                    ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
