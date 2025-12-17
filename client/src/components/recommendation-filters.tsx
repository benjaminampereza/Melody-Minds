import { useState } from "react";
import { Sliders, Sparkles, Music, Zap, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { RecommendationParams, GenreSeed } from "@shared/schema";

interface RecommendationFiltersProps {
  genres: GenreSeed[];
  onApply: (params: RecommendationParams) => void;
  isLoading?: boolean;
}

export function RecommendationFilters({
  genres,
  onApply,
  isLoading = false,
}: RecommendationFiltersProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [energy, setEnergy] = useState<number>(50);
  const [danceability, setDanceability] = useState<number>(50);
  const [valence, setValence] = useState<number>(50);
  const [tempo, setTempo] = useState<number>(120);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : prev.length < 5
          ? [...prev, genre]
          : prev
    );
  };

  const handleApply = () => {
    onApply({
      seedGenres: selectedGenres.length > 0 ? selectedGenres : undefined,
      targetEnergy: energy / 100,
      targetDanceability: danceability / 100,
      targetValence: valence / 100,
      targetTempo: tempo,
      limit: 20,
    });
  };

  const handleReset = () => {
    setSelectedGenres([]);
    setEnergy(50);
    setDanceability(50);
    setValence(50);
    setTempo(120);
  };

  return (
    <Card data-testid="recommendation-filters">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sliders className="h-5 w-5" />
          Tune Your Recommendations
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleReset} data-testid="button-reset-filters">
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Genre Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Music className="h-4 w-4" />
            Genres (up to 5)
          </Label>
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 20).map((genre) => (
              <Badge
                key={genre.name}
                variant={selectedGenres.includes(genre.name) ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => handleGenreToggle(genre.name)}
                data-testid={`genre-${genre.name}`}
              >
                {genre.displayName}
              </Badge>
            ))}
          </div>
        </div>

        {/* Energy Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Zap className="h-4 w-4" />
              Energy
            </Label>
            <span className="text-sm text-muted-foreground">{energy}%</span>
          </div>
          <Slider
            value={[energy]}
            max={100}
            step={1}
            onValueChange={([value]) => setEnergy(value)}
            data-testid="slider-energy"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Chill</span>
            <span>Intense</span>
          </div>
        </div>

        {/* Danceability Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Danceability
            </Label>
            <span className="text-sm text-muted-foreground">{danceability}%</span>
          </div>
          <Slider
            value={[danceability]}
            max={100}
            step={1}
            onValueChange={([value]) => setDanceability(value)}
            data-testid="slider-danceability"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Minimal</span>
            <span>Groovy</span>
          </div>
        </div>

        {/* Mood (Valence) Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Smile className="h-4 w-4" />
              Mood
            </Label>
            <span className="text-sm text-muted-foreground">{valence}%</span>
          </div>
          <Slider
            value={[valence]}
            max={100}
            step={1}
            onValueChange={([value]) => setValence(value)}
            data-testid="slider-valence"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Melancholic</span>
            <span>Upbeat</span>
          </div>
        </div>

        {/* Tempo Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Tempo (BPM)</Label>
            <span className="text-sm text-muted-foreground">{tempo} BPM</span>
          </div>
          <Slider
            value={[tempo]}
            min={60}
            max={200}
            step={1}
            onValueChange={([value]) => setTempo(value)}
            data-testid="slider-tempo"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>60</span>
            <span>200</span>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleApply}
          disabled={isLoading}
          data-testid="button-apply-filters"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Get Recommendations
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
