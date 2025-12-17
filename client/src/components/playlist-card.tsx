import { Play, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Playlist } from "@shared/schema";

interface PlaylistCardProps {
  playlist: Playlist;
  onPlay?: () => void;
  onClick?: () => void;
}

export function PlaylistCard({ playlist, onPlay, onClick }: PlaylistCardProps) {
  return (
    <div
      className="group flex flex-col gap-3 rounded-lg p-4 transition-colors hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`playlist-card-${playlist.id}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        {playlist.imageUrl ? (
          <img
            src={playlist.imageUrl}
            alt={playlist.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10">
            <ListMusic className="h-12 w-12 text-primary/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <Button
          size="icon"
          className="absolute bottom-3 right-3 h-12 w-12 translate-y-2 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.();
          }}
          data-testid={`button-play-playlist-${playlist.id}`}
        >
          <Play className="h-6 w-6 fill-current" />
        </Button>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground" data-testid={`text-playlist-name-${playlist.id}`}>
          {playlist.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {playlist.description || `By ${playlist.owner.displayName}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {playlist.trackCount} tracks
        </p>
      </div>
    </div>
  );
}

export function PlaylistCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="aspect-square animate-pulse rounded-md bg-muted" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
