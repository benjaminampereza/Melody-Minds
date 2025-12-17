# Music Intelligence Platform - Design Guidelines

## Design Approach
**Reference-Based: Spotify + SoundCloud Inspiration**

This music-first platform follows Spotify's sophisticated dark theme aesthetic combined with SoundCloud's player-focused design. The interface prioritizes audio content, data visualization, and seamless playback controls while maintaining an immersive, distraction-free listening experience.

**Design Principles:**
- Audio-first interface with persistent playback controls
- Data-rich visualizations that reveal listening insights
- Card-based content organization for scalability
- Immersive dark theme reducing eye strain during extended sessions
- Seamless integration between discovery, library, and playback

## Color Palette
- **Primary:** #1DB954 (Spotify Green) - CTAs, active states, accent elements
- **Secondary:** #191414 (Deep Black) - Primary backgrounds, headers
- **Background:** #121212 (Dark Grey) - Main content areas, cards
- **Text Primary:** #FFFFFF (White) - Headings, primary content
- **Text Secondary:** #B3B3B3 (Light Grey) - Descriptions, metadata
- **Accent:** #535353 (Medium Grey) - Borders, dividers, inactive states
- **Success:** #1ED760 (Bright Green) - Confirmations, saved states
- **Error:** #E22134 (Red) - Warnings, errors

## Typography
**Font Stack:** Circular (primary), Gotham, Roboto, system-ui, sans-serif

**Hierarchy:**
- Hero Heading: 3.5rem (56px), Bold, 1.1 line height
- Section Heading: 2rem (32px), Bold, 1.2 line height
- Card Title: 1.25rem (20px), Bold, 1.3 line height
- Body Large: 1rem (16px), Regular, 1.5 line height
- Body Small: 0.875rem (14px), Regular, 1.5 line height
- Caption/Metadata: 0.75rem (12px), Medium, 1.4 line height

## Layout System
**Spacing Scale:** Tailwind units 2, 4, 6, 8, 12, 16, 24 (p-2, m-4, gap-6, etc.)

**Container Strategy:**
- Max width: 1400px for dashboard content
- Sidebar: Fixed 240px (desktop), collapsible (mobile)
- Content padding: px-6 (mobile), px-8 (tablet), px-12 (desktop)
- Section spacing: py-12 (mobile), py-16 (desktop)
- Card gaps: gap-4 (mobile), gap-6 (desktop)

**Grid Systems:**
- Playlist/Album Cards: grid-cols-2 (mobile), grid-cols-3 (tablet), grid-cols-4-5 (desktop)
- Track Lists: Single column with row-based items
- Recommendation Cards: grid-cols-1 (mobile), grid-cols-2 (tablet), grid-cols-3-4 (desktop)
- Dashboard Stats: grid-cols-2 (mobile), grid-cols-4 (desktop)

## Component Library

### Navigation
**Sidebar Navigation:** Fixed left sidebar with user profile at top, main navigation items (Home, Search, Library, Playlists), and playlist quick access list below. Persistent on desktop, drawer on mobile.

**Top Bar:** Search input (center), user profile menu (right), playback device selector. Background: #191414, height: 64px.

### Cards
**Playlist/Album Card:** Square artwork (aspect-ratio-square), title (truncate), artist/creator (text-secondary), hover overlay with play button (blurred background). Padding: p-4, rounded: rounded-lg.

**Track Row:** Horizontal layout with track number/play icon, artwork (48x48), title/artist, album name, duration, add-to-playlist action. Hover: bg-#535353/20.

**Recommendation Card:** Album artwork, track title, artist, audio features preview (tempo, energy chips), add button. Enhanced shadow on hover.

### Player Controls
**Bottom Player Bar:** Fixed bottom, full-width, height: 90px. Three-column layout - track info (left), controls (center), volume/devices (right). Background: #181818, border-top: 1px solid #282828.

**Controls:** Play/pause (large, center), skip previous/next, shuffle, repeat, progress bar with time stamps, volume slider, device selector.

### Data Visualizations
**Charts:** Use Chart.js with dark theme. Line charts for listening over time, bar charts for top genres, donut charts for audio features distribution. Colors: Primary green with gradient fills.

**Audio Features Display:** Horizontal progress bars showing danceability, energy, valence, acousticness (0-100 scale), labeled with icons and percentages.

### Forms & Inputs
**Search Bar:** Dark background (#282828), rounded-full, icon left, clear button right. Focus: border-primary.

**Filter Dropdowns:** Dark background, rounded corners, green accent on selected items.

**Range Sliders:** Green track, circular thumb, used for audio feature filters (tempo, energy ranges).

## Page Sections

### Dashboard Home
- **Hero Stats Section:** 4-column grid showing total listening time, top genre, tracks discovered, playlists created. Each stat in card with large number and icon.
- **Recently Played:** Horizontal scrolling carousel of recent tracks with timestamps.
- **Top Artists/Tracks:** Two-column layout, each showing top 5 with rankings, playcounts.
- **Listening Insights:** Line chart showing listening activity over time, genre distribution donut chart.

### Recommendations Page
- **AI Recommendation Engine:** Filter controls at top (seed selection, audio features sliders), recommendation grid below showing 20-30 tracks with add-to-playlist actions.
- **Smart Playlists:** Auto-generated playlists based on mood, activity, time of day. Card grid layout.

### Library View
- **Tabs:** Playlists, Albums, Artists, Tracks
- **Grid View:** Responsive card grid for visual content
- **List View:** Detailed track listings with sortable columns

### Search Results
- **Category Tabs:** All, Tracks, Albums, Artists, Playlists
- **Results Grid:** Mixed content types with appropriate card layouts, infinite scroll pagination

## Images

### Hero Section
**Large hero image** spanning full viewport width, height: 60vh (desktop), 40vh (mobile). Image description: Abstract music visualization with sound waves or equalizer bars in vibrant colors (purples, blues, greens) against dark background. Gradient overlay from transparent to #121212 at bottom.

**Hero Content:** Overlaid on image bottom-third, white text with drop-shadow. Heading: "Your Music Intelligence Platform", subheading describing AI-powered recommendations. CTA button with blurred backdrop (backdrop-blur-md, bg-primary/80).

### Artwork/Album Covers
All track, album, and playlist cards use square artwork images. Placeholder: Gradient backgrounds (#1DB954 to #1ED760) with music note icon when no artwork available.

### Artist Images
Circular artist photos in top artists sections, rounded-full, border: 2px solid #535353.

### Empty States
Illustrations for empty playlists, no search results: Simple line art in grey tones with green accents, centered with helpful text below.

## Animations
**Minimal, purposeful animations only:**
- Card hover: Subtle lift (translateY: -4px, shadow increase), 200ms ease
- Play button appearance: Fade in on card hover, 150ms
- Page transitions: Fade content, 300ms
- Player controls: Smooth progress bar updates, no other animations

## Responsive Behavior
- **Mobile (<768px):** Single column layouts, collapsible sidebar drawer, simplified player controls, stacked stats
- **Tablet (768-1024px):** 2-3 column grids, persistent sidebar optional, full player features
- **Desktop (>1024px):** Multi-column grids, fixed sidebar, expanded visualizations, all features visible