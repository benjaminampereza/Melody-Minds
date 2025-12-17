import { Play, Pause, Plus, Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Track } from "@shared/schema";

interface TrackCardProps {
  track: Track;
  index?: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  onAddToPlaylist?: () => void;
  onToggleLike?: () => void;
  isLiked?: boolean;
  showAudioFeatures?: boolean;
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function TrackCard({
  track,
  index,
  isPlaying = false,
  onPlay,
  onAddToPlaylist,
  onToggleLike,
  isLiked = false,
  showAudioFeatures = false,
}: TrackCardProps) {
  return (
    <div
      className="group flex items-center gap-4 rounded-md p-3 transition-colors hover-elevate"
      data-testid={`track-card-${track.id}`}
    >
      <div className="flex w-8 items-center justify-center">
        {isPlaying ? (
          <div className="flex items-center gap-0.5">
            <span className="h-3 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "0ms" }} />
            <span className="h-4 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "150ms" }} />
            <span className="h-2 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "300ms" }} />
          </div>
        ) : (
          <span className="text-sm text-muted-foreground group-hover:invisible">
            {index !== undefined ? index + 1 : null}
          </span>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="invisible absolute group-hover:visible"
          onClick={onPlay}
          data-testid={`button-play-${track.id}`}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
        </Button>
      </div>

      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        {track.album.imageUrl ? (
          <img
            src={track.album.imageUrl}
            alt={track.album.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Play className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground" data-testid={`text-track-name-${track.id}`}>
          {track.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {track.artists.map((a) => a.name).join(", ")}
        </p>
      </div>

      {showAudioFeatures && track.audioFeatures && (
        <div className="hidden gap-2 md:flex">
          <Badge variant="secondary" className="text-xs">
            Energy {Math.round(track.audioFeatures.energy * 100)}%
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Vibe {Math.round(track.audioFeatures.valence * 100)}%
          </Badge>
        </div>
      )}

      <div className="hidden text-sm text-muted-foreground md:block">
        {track.album.name}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className={`invisible group-hover:visible ${isLiked ? "visible text-primary" : ""}`}
          onClick={onToggleLike}
          data-testid={`button-like-${track.id}`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>

        <span className="w-12 text-right text-sm text-muted-foreground">
          {formatDuration(track.durationMs)}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="invisible group-hover:visible"
              data-testid={`button-more-${track.id}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onAddToPlaylist} data-testid={`menu-add-playlist-${track.id}`}>
              <Plus className="mr-2 h-4 w-4" />
              Add to Playlist
            </DropdownMenuItem>
            <DropdownMenuItem data-testid={`menu-view-album-${track.id}`}>
              View Album
            </DropdownMenuItem>
            <DropdownMenuItem data-testid={`menu-view-artist-${track.id}`}>
              View Artist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function TrackCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3">
      <div className="h-4 w-8 animate-pulse rounded bg-muted" />
      <div className="h-12 w-12 animate-pulse rounded-md bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      </div>
      <div className="hidden h-4 w-24 animate-pulse rounded bg-muted md:block" />
      <div className="h-4 w-12 animate-pulse rounded bg-muted" />
    </div>
  );
}
