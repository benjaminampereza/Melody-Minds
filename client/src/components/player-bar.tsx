import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Laptop,
  Smartphone,
  Speaker,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PlaybackState, Device } from "@shared/schema";

interface PlayerBarProps {
  playbackState: PlaybackState | null;
  devices?: Device[];
  onPlayPause?: () => void;
  onSkipPrevious?: () => void;
  onSkipNext?: () => void;
  onSeek?: (position: number) => void;
  onVolumeChange?: (volume: number) => void;
  onShuffleToggle?: () => void;
  onRepeatToggle?: () => void;
  onDeviceSelect?: (deviceId: string) => void;
}

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getDeviceIcon(type: string) {
  switch (type.toLowerCase()) {
    case "computer":
      return Laptop;
    case "smartphone":
      return Smartphone;
    default:
      return Speaker;
  }
}

export function PlayerBar({
  playbackState,
  devices = [],
  onPlayPause,
  onSkipPrevious,
  onSkipNext,
  onSeek,
  onVolumeChange,
  onShuffleToggle,
  onRepeatToggle,
  onDeviceSelect,
}: PlayerBarProps) {
  const track = playbackState?.currentTrack;
  const progress = playbackState?.progressMs || 0;
  const duration = playbackState?.durationMs || 0;
  const volume = playbackState?.volume ?? 100;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-lg"
      data-testid="player-bar"
    >
      <div className="mx-auto flex h-[90px] max-w-screen-2xl items-center gap-4 px-4">
        {/* Track Info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {track ? (
            <>
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                {track.album.imageUrl ? (
                  <img
                    src={track.album.imageUrl}
                    alt={track.album.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10">
                    <Play className="h-6 w-6 text-primary/50" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground" data-testid="text-now-playing-track">
                  {track.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {track.artists.map((a) => a.name).join(", ")}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-md bg-muted" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className={playbackState?.shuffleState ? "text-primary" : ""}
              onClick={onShuffleToggle}
              data-testid="button-shuffle"
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={onSkipPrevious}
              data-testid="button-previous"
            >
              <SkipBack className="h-5 w-5 fill-current" />
            </Button>

            <Button
              size="icon"
              className="h-10 w-10"
              onClick={onPlayPause}
              data-testid="button-play-pause"
            >
              {playbackState?.isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={onSkipNext}
              data-testid="button-next"
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className={playbackState?.repeatState !== "off" ? "text-primary" : ""}
              onClick={onRepeatToggle}
              data-testid="button-repeat"
            >
              {playbackState?.repeatState === "track" ? (
                <Repeat1 className="h-4 w-4" />
              ) : (
                <Repeat className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex w-full max-w-md items-center gap-2">
            <span className="w-10 text-right text-xs text-muted-foreground">
              {formatTime(progress)}
            </span>
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1000}
              onValueChange={([value]) => onSeek?.(value)}
              className="flex-1"
              data-testid="slider-progress"
            />
            <span className="w-10 text-xs text-muted-foreground">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume & Device Controls */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" data-testid="button-devices">
                {(() => {
                  const DeviceIcon = playbackState?.device
                    ? getDeviceIcon(playbackState.device.type)
                    : Speaker;
                  return <DeviceIcon className="h-4 w-4" />;
                })()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {devices.length > 0 ? (
                devices.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  return (
                    <DropdownMenuItem
                      key={device.id}
                      onClick={() => onDeviceSelect?.(device.id)}
                      className={device.isActive ? "bg-primary/10" : ""}
                      data-testid={`device-${device.id}`}
                    >
                      <DeviceIcon className="mr-2 h-4 w-4" />
                      <span>{device.name}</span>
                      {device.isActive && (
                        <span className="ml-auto text-xs text-primary">Active</span>
                      )}
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <DropdownMenuItem disabled>No devices available</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex w-32 items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onVolumeChange?.(volume > 0 ? 0 : 100)}
              data-testid="button-volume"
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={([value]) => onVolumeChange?.(value)}
              className="flex-1"
              data-testid="slider-volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
