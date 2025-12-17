import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Artist } from "@shared/schema";

interface ArtistCardProps {
  artist: Artist;
  rank?: number;
  onPlay?: () => void;
  onClick?: () => void;
}

export function ArtistCard({ artist, rank, onPlay, onClick }: ArtistCardProps) {
  return (
    <div
      className="group flex flex-col items-center gap-3 rounded-lg p-4 text-center transition-colors hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`artist-card-${artist.id}`}
    >
      <div className="relative">
        {rank && (
          <div className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {rank}
          </div>
        )}
        <div className="relative h-32 w-32 overflow-hidden rounded-full bg-muted">
          {artist.imageUrl ? (
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10">
              <span className="text-4xl font-bold text-primary/50">
                {artist.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <Button
            size="icon"
            className="absolute bottom-2 right-2 h-10 w-10 translate-y-2 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
            data-testid={`button-play-artist-${artist.id}`}
          >
            <Play className="h-5 w-5 fill-current" />
          </Button>
        </div>
      </div>

      <div className="w-full">
        <p className="truncate text-sm font-semibold text-foreground" data-testid={`text-artist-name-${artist.id}`}>
          {artist.name}
        </p>
        <p className="text-xs text-muted-foreground">Artist</p>
      </div>

      {artist.genres.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1">
          {artist.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function ArtistCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="h-32 w-32 animate-pulse rounded-full bg-muted" />
      <div className="w-full space-y-2">
        <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mx-auto h-3 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
