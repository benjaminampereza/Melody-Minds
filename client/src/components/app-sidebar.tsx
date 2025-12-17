import { Home, Search, Library, ListMusic, Sparkles, BarChart3, Music2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User, Playlist } from "@shared/schema";

const mainNavItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Search", url: "/search", icon: Search },
  { title: "Library", url: "/library", icon: Library },
];

const featureNavItems = [
  { title: "Recommendations", url: "/recommendations", icon: Sparkles },
  { title: "Smart Playlists", url: "/smart-playlists", icon: ListMusic },
  { title: "Insights", url: "/insights", icon: BarChart3 },
];

interface AppSidebarProps {
  user?: User | null;
  playlists?: Playlist[];
}

export function AppSidebar({ user, playlists = [] }: AppSidebarProps) {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Music2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">Music Intel</span>
            <span className="text-xs text-muted-foreground">Smart Discovery</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Intelligence
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {featureNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(" ", "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {playlists.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Your Playlists
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {playlists.slice(0, 8).map((playlist) => (
                  <SidebarMenuItem key={playlist.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={location === `/playlist/${playlist.id}`}
                      data-testid={`playlist-${playlist.id}`}
                    >
                      <Link href={`/playlist/${playlist.id}`}>
                        <div className="flex h-5 w-5 items-center justify-center rounded bg-muted">
                          <ListMusic className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="truncate">{playlist.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user ? (
          <div className="flex items-center gap-3 rounded-md bg-sidebar-accent p-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.imageUrl || undefined} alt={user.displayName || user.username} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(user.displayName || user.username).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-foreground">
                {user.displayName || user.username}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.subscription || "Free"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-md bg-sidebar-accent p-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-muted">
                <Music2 className="h-4 w-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Guest</span>
              <span className="text-xs text-muted-foreground">Connect Spotify</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
