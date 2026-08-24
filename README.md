# 📼 CASSETTE WALA (कैसेट वाला)
> **Tagline:** *Rewind. Play. Relive.*  
> **Supporting:** *“Har cassette mein ek yaad hai.”* | *“Press Play. Travel Back.”*

A premium nostalgic Indian music experience designed to recreate stepping into an old Indian cassette shop from the 1980s, 1990s, and 2000s.

---

## 🌟 Key Features

1. **Realistic Skeuomorphic Cassette Player Deck**:
   - **Cassette Compartment**: Motorized tape well that opens and loads tapes with smooth spring and latch mechanics.
   - **Dual Backlit Analog VU Meters**: Left & Right stereo channels with dynamically bouncing needles reacting to music.
   - **Mechanical Piano-Key Buttons**: `EJECT (⏏)`, `REWIND (⏪)`, `PLAY (▶)`, `FAST FORWARD (⏩)`, `STOP (⏹)`, `PAUSE (❚❚)`, and `SKIP PREV/NEXT`.
   - **Mechanical 3-Digit Tape Counter**: Mechanical rolling counter (`000` to `999`) with quick `RESET` button.
   - **Dolby B/C Noise Reduction & Tape Bias Selector**: Type I (Normal Ferro), Type II (Chrome CrO2), Type IV (Metal).
   - **Rotary Volume Knob**: Smooth tactile volume control with mute toggle.
   - **VFD Display**: Vacuum Fluorescent Display showing real-time track titles, elapsed time, duration, and era info.

2. **Authentic Interactive Physical Cassette Cards**:
   - **Transparent Acrylic Window**: Realistic left and right rotating tape spools with variable magnetic tape winding.
   - **Adhesive Paper Labels**: Handwritten cursive typography, vintage record label logos (T-Series, Tips, Venus, HMV, Magnasound), stamp marks, and MRP stickers.
   - **Side A / Side B Flip**: Interactive flip switch with tracklist preview.
   - **3D Lift & Tilt on Hover**: Framer Motion physics.
   - **Folded Paper J-Card Inlay**: Modal that unfolds the vintage paper tape inlay booklet with singer credits, lyrics, collector notes, and cassette care warnings.

3. **Curated Official Indian Music Collection**:
   - 📼 **80s Golden Hits** (*T-Series Bollywood Classics — Kishore Kumar, Lata Mangeshkar, Asha Bhosle, RD Burman*)
   - ❤️ **90s Evergreen** (*Tips Official — Nadeem-Shravan, Kumar Sanu, Alka Yagnik, Udit Narayan*)
   - 🎤 **Kumar Sanu Special** (*T-Series Classics — King of 90s Romance*)
   - 🎙️ **Udit Narayan & Alka Yagnik – Golden Hits** (*Classic romantic 90s duets*)
   - 👑 **Alka Yagnik Special** (*Melody Queen classics from Taal, Baazigar, QSQT*)
   - 💿 **2000s Nostalgia** (*Lucky Ali, KK, Indipop, Euphoria, Dil Chahta Hai*)
   - 💔 **Dard Bhari Cassette** (*Late Night 2 AM Heartbreak & Jagjit Singh Ghazals*)
   - 🌧️ **Baarish Wali Cassette** (*Rain outside, hot chai and samosas inside*)
   - 🚗 **Safar Wali Cassette** (*Road trips, GT Road breeze, open windows*)
   - 🕺 **80s Disco & Mithun Masti** (*Bappi Lahiri synthezisers & Disco Dancer*)
   - 📻 **Vividh Bharati Radio Days** (*Ameen Sayani & Binaca Geetmala nostalgia*)
   - ☕ **Late Night Ghazal & Chai** (*Jagjit & Chitra Singh soulful evenings*)

4. **Dynamic YouTube Integration**:
   - Uses the official **YouTube IFrame Player API**.
   - Supports both full multi-track **YouTube Playlists** (`type: 'playlist'`) and long **Jukebox Videos** (`type: 'video'`).
   - Seamless track change tracking, duration syncing, and chapter seeking.
   - Built-in URL parser (`lib/youtubeHelper.ts`) to extract playlist IDs or video IDs from any YouTube URL.

5. **"Apna Mixtape Banao" (Custom Cassette Creator)**:
   - Users can paste their own YouTube Playlist or Video URL.
   - Pick cassette chassis color (Matte Charcoal, Clear Acrylic, Ruby Red, Gold Edition, Peacock Teal, Smoky Glass).
   - Write custom handwritten titles, artist dedications, and insert directly into the deck!

6. **Procedural Web Audio API Sound Synthesizer**:
   - Built-in sound engine (`lib/soundSynth.ts`) for zero-latency, realistic mechanical clicks, heavy tape eject clunk, motor start hum, rewind spool whoosh, and button snaps without external audio file failures.
   - Switchable **Ambient Tape Hiss & Vinyl Crackle** generator.
   - Switchable **Retro CRT Scanlines TV Mode**.

7. **Nostalgic Loading Intro ("REWINDING TIME...")**:
   - Pencil rewinding a loose cassette tape animation with mechanical tape counter rolling back to the 1980s.

8. **Keyboard Shortcuts**:
   - `Space`: Play / Pause toggle
   - `←` / `→`: Rewind / Fast Forward 10 seconds
   - `N` / `P`: Next / Previous track
   - `M`: Mute / Unmute
   - `E`: Eject cassette

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 App Router](https://nextjs.org/) (React 19, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom retro wood & paper color palette
- **Animations**: [Framer Motion](https://www.framer-motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Engine**: Native Web Audio API procedural synthesis
- **Video / Music**: YouTube IFrame Player API

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 📻 How to Add or Edit Cassettes

All cassettes are configured in [`data/playlists.ts`](./data/playlists.ts).

You can easily add new cassettes by adding an object to the `CASSETTE_PLAYLISTS` array:

```typescript
{
  id: 'my-custom-playlist',
  title: 'Mohabbat Ke Nagme',
  subtitle: 'Romantic Classics',
  hindiTitle: 'मोहब्बत के सदाबहार नगमे',
  description: 'Heartwarming 90s melodies.',
  era: '1990s', // '1980s' | '1990s' | '2000s'
  yearRange: '1992 - 1999',
  moods: ['all', 'romance'],
  type: 'playlist', // or 'video'
  youtubePlaylistId: 'YOUR_YOUTUBE_PLAYLIST_ID', // e.g. 'PL123456789'
  // Or for single jukebox video:
  // youtubeId: 'VIDEO_ID',
  youtubeUrl: 'https://www.youtube.com/playlist?list=YOUR_YOUTUBE_PLAYLIST_ID',
  source: 'T-Series Bollywood Classics',
  trackCount: 15,
  durationApprox: '1 hr 30 min',
  sideA: ['1. Song Name (Movie)', '2. Another Song (Movie)'],
  sideB: ['1. Side B Song (Movie)', '2. Closing Track (Movie)'],
  coverColor: {
    base: '#b93826',
    border: '#d99b26',
    accent: '#ffffff',
    labelBg: '#faf0ca',
    labelText: '#1f1b16',
    tapeBody: 'red', // 'black' | 'clear' | 'smoke' | 'red' | 'gold' | 'teal'
  },
}
```

---

*“Purane Gaane. Purani Yaadein. Cassette Wala.”*
