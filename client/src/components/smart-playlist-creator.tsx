import { useState } from "react";
import { Wand2, ListMusic, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SmartPlaylistRequest } from "@shared/schema";

interface SmartPlaylistCreatorProps {
  onCreate: (request: SmartPlaylistRequest) => void;
  isLoading?: boolean;
}

const moodOptions = [
  { value: "happy", label: "Happy & Uplifting" },
  { value: "chill", label: "Relaxed & Chill" },
  { value: "energetic", label: "Energetic & Pumped" },
  { value: "focus", label: "Focus & Concentration" },
  { value: "melancholic", label: "Melancholic & Emotional" },
  { value: "romantic", label: "Romantic & Intimate" },
];

const activityOptions = [
  { value: "workout", label: "Workout & Exercise" },
  { value: "study", label: "Study & Work" },
  { value: "party", label: "Party & Social" },
  { value: "sleep", label: "Sleep & Relaxation" },
  { value: "commute", label: "Commute & Travel" },
  { value: "cooking", label: "Cooking & Chores" },
];

const genreOptions = [
  "pop", "rock", "hip-hop", "electronic", "r-n-b", "jazz",
  "classical", "indie", "folk", "country", "latin", "metal",
];

export function SmartPlaylistCreator({ onCreate, isLoading = false }: SmartPlaylistCreatorProps) {
  const [mood, setMood] = useState<string>("");
  const [activity, setActivity] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [energyRange, setEnergyRange] = useState<[number, number]>([20, 80]);
  const [tempoRange, setTempoRange] = useState<[number, number]>([80, 160]);
  const [trackCount, setTrackCount] = useState<number>(25);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : prev.length < 3
          ? [...prev, genre]
          : prev
    );
  };

  const handleCreate = () => {
    const request: SmartPlaylistRequest = {
      mood: mood || undefined,
      activity: activity || undefined,
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      energyRange: { min: energyRange[0] / 100, max: energyRange[1] / 100 },
      tempoRange: { min: tempoRange[0], max: tempoRange[1] },
      trackCount,
    };
    onCreate(request);
  };

  return (
    <Card data-testid="smart-playlist-creator">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          AI Playlist Generator
        </CardTitle>
        <CardDescription>
          Let AI create the perfect playlist based on your preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Selection */}
        <div className="space-y-2">
          <Label>Mood</Label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger data-testid="select-mood">
              <SelectValue placeholder="Select a mood" />
            </SelectTrigger>
            <SelectContent>
              {moodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Activity Selection */}
        <div className="space-y-2">
          <Label>Activity</Label>
          <Select value={activity} onValueChange={setActivity}>
            <SelectTrigger data-testid="select-activity">
              <SelectValue placeholder="Select an activity" />
            </SelectTrigger>
            <SelectContent>
              {activityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Genre Selection */}
        <div className="space-y-2">
          <Label>Preferred Genres (up to 3)</Label>
          <div className="flex flex-wrap gap-2">
            {genreOptions.map((genre) => (
              <Badge
                key={genre}
                variant={selectedGenres.includes(genre) ? "default" : "secondary"}
                className="cursor-pointer capitalize"
                onClick={() => handleGenreToggle(genre)}
                data-testid={`smart-genre-${genre}`}
              >
                {genre.replace("-", " ")}
              </Badge>
            ))}
          </div>
        </div>

        {/* Energy Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Energy Range</Label>
            <span className="text-sm text-muted-foreground">
              {energyRange[0]}% - {energyRange[1]}%
            </span>
          </div>
          <Slider
            value={energyRange}
            min={0}
            max={100}
            step={5}
            onValueChange={(value) => setEnergyRange(value as [number, number])}
            data-testid="slider-energy-range"
          />
        </div>

        {/* Tempo Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Tempo Range (BPM)</Label>
            <span className="text-sm text-muted-foreground">
              {tempoRange[0]} - {tempoRange[1]} BPM
            </span>
          </div>
          <Slider
            value={tempoRange}
            min={60}
            max={200}
            step={5}
            onValueChange={(value) => setTempoRange(value as [number, number])}
            data-testid="slider-tempo-range"
          />
        </div>

        {/* Track Count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Number of Tracks</Label>
            <span className="text-sm text-muted-foreground">{trackCount}</span>
          </div>
          <Slider
            value={[trackCount]}
            min={10}
            max={50}
            step={5}
            onValueChange={([value]) => setTrackCount(value)}
            data-testid="slider-track-count"
          />
        </div>

        <Button
          className="w-full"
          onClick={handleCreate}
          disabled={isLoading}
          data-testid="button-create-playlist"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creating Playlist...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ListMusic className="h-4 w-4" />
              Generate Playlist
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
