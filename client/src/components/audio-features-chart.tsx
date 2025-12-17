import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AudioFeatures } from "@shared/schema";

interface AudioFeaturesChartProps {
  features: AudioFeatures;
  variant?: "radar" | "bars" | "compact";
  title?: string;
}

const featureLabels: Record<string, string> = {
  danceability: "Danceability",
  energy: "Energy",
  valence: "Mood",
  acousticness: "Acoustic",
  instrumentalness: "Instrumental",
  liveness: "Live",
  speechiness: "Vocal",
};

const keyLabels = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function AudioFeaturesChart({ features, variant = "radar", title }: AudioFeaturesChartProps) {
  const radarData = Object.entries(featureLabels).map(([key, label]) => ({
    feature: label,
    value: Math.round((features[key as keyof AudioFeatures] as number) * 100),
    fullMark: 100,
  }));

  if (variant === "compact") {
    return (
      <div className="space-y-3" data-testid="audio-features-compact">
        {Object.entries(featureLabels).slice(0, 4).map(([key, label]) => {
          const value = Math.round((features[key as keyof AudioFeatures] as number) * 100);
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground">{value}%</span>
              </div>
              <Progress value={value} className="h-1.5" />
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <Card data-testid="audio-features-bars">
        {title && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            {Object.entries(featureLabels).map(([key, label]) => {
              const value = Math.round((features[key as keyof AudioFeatures] as number) * 100);
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              );
            })}

            <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{Math.round(features.tempo)}</p>
                <p className="text-xs text-muted-foreground">BPM</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {keyLabels[features.key]}
                  {features.mode === 1 ? "" : "m"}
                </p>
                <p className="text-xs text-muted-foreground">Key</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{features.timeSignature}/4</p>
                <p className="text-xs text-muted-foreground">Time Sig</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="audio-features-radar">
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="feature"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <Radar
              name="Audio Features"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
          <div className="text-center">
            <p className="text-xl font-bold text-primary">{Math.round(features.tempo)}</p>
            <p className="text-xs text-muted-foreground">BPM</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">
              {keyLabels[features.key]}
              {features.mode === 1 ? "" : "m"}
            </p>
            <p className="text-xs text-muted-foreground">Key</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{features.timeSignature}/4</p>
            <p className="text-xs text-muted-foreground">Time Sig</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AudioFeaturesChartSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="flex h-64 items-center justify-center">
          <div className="h-48 w-48 animate-pulse rounded-full bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
