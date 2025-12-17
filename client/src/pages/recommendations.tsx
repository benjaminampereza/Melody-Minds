import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sparkles, Brain, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrackCard, TrackCardSkeleton } from "@/components/track-card";
import { RecommendationFilters } from "@/components/recommendation-filters";
import { AudioFeaturesChart } from "@/components/audio-features-chart";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Track, GenreSeed, RecommendationParams, AIRecommendation } from "@shared/schema";

export default function Recommendations() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const { data: genres } = useQuery<GenreSeed[]>({
    queryKey: ["/api/genres"],
  });

  const { data: recommendations, isLoading: recsLoading } = useQuery<Track[]>({
    queryKey: ["/api/recommendations"],
  });

  const { data: aiRecommendation, isLoading: aiLoading } = useQuery<AIRecommendation>({
    queryKey: ["/api/ai-recommendations"],
  });

  const generateMutation = useMutation({
    mutationFn: async (params: RecommendationParams) => {
      const response = await apiRequest("POST", "/api/recommendations/generate", params);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
    },
  });

  return (
    <div className="space-y-8 pb-24">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground" data-testid="text-recommendations-title">
          Music Recommendations
        </h1>
        <p className="text-muted-foreground">
          Discover new music tailored to your taste using AI-powered recommendations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Filters */}
        <div className="lg:col-span-1">
          <RecommendationFilters
            genres={genres || []}
            onApply={(params) => generateMutation.mutate(params)}
            isLoading={generateMutation.isPending}
          />
        </div>

        {/* Recommendations */}
        <div className="space-y-6 lg:col-span-2">
          {/* AI Insights Card */}
          {aiRecommendation && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent" data-testid="ai-insights-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Music Insights
                </CardTitle>
                <CardDescription>{aiRecommendation.explanation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Lightbulb className="h-3 w-3" />
                    Mood: {aiRecommendation.mood}
                  </Badge>
                  <Badge variant="outline">
                    Suggested: {aiRecommendation.suggestedPlaylistName}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommended Tracks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Recommended for You
              </CardTitle>
              <Badge variant="secondary">
                {recommendations?.length || 0} tracks
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recsLoading || generateMutation.isPending
                  ? Array.from({ length: 10 }).map((_, i) => <TrackCardSkeleton key={i} />)
                  : recommendations?.map((track, index) => (
                      <TrackCard
                        key={track.id}
                        track={track}
                        index={index}
                        showAudioFeatures
                        onPlay={() => setSelectedTrack(track)}
                      />
                    ))}

                {!recsLoading && !generateMutation.isPending && recommendations?.length === 0 && (
                  <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Sparkles className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      No recommendations yet
                    </h3>
                    <p className="text-muted-foreground">
                      Adjust the filters and click "Get Recommendations" to discover new music
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Selected Track Audio Features */}
          {selectedTrack?.audioFeatures && (
            <AudioFeaturesChart
              features={selectedTrack.audioFeatures}
              title={`Audio Analysis: ${selectedTrack.name}`}
              variant="bars"
            />
          )}
        </div>
      </div>
    </div>
  );
}
