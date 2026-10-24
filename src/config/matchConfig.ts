import { MatchInfo, StreamChannelConfig } from '../types';

/**
 * =========================================================================
 * 🏏⚽ MATCH CONFIGURATION (यहाँ कोड में दोनों टीमों के नाम बदल सकते हैं)
 * =========================================================================
 * आप यहाँ सीधे Team 1 और Team 2 का नाम बदल सकते हैं।
 * उदाहरण: team1: "INDIA", team2: "AUSTRALIA" या "REAL MADRID", "BARCELONA"
 */
export const DEFAULT_MATCH_CONFIG: MatchInfo = {
  // टीम 1 का नाम (Team 1 Name):
  team1: "INDIA",

  // टीम 2 का नाम (Team 2 Name):
  team2: "AUSTRALIA",

  // टूर्नामेंट या मैच का नाम (Tournament / Series Name):
  tournament: "ICC T20 WORLD CUP 2026 - FINAL",

  // खेल की श्रेणी (Sport Category):
  category: "cricket",

  // लाइव स्थिति (LIVE / UPCOMING / FINISHED):
  status: "LIVE",

  // टैगलाइन या वेन्यू (Tagline / Venue):
  tagline: "Live Stream • Ultra HD 4K • Dual Audio Feeds",
  venue: "Melbourne Cricket Ground (MCG)",

  // डिफ़ॉल्ट यूट्यूब थंबनेल पोस्टर (Default YouTube Thumbnail Poster 16:9):
  thumbnailUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1280&auto=format&fit=crop"
};

/**
 * =========================================================================
 * 📺 THREE STREAM FEEDS (हिंदी, इंग्लिश, Willow - तीनों चैनलों की सेटिंग्स)
 * =========================================================================
 * आप यहाँ प्रत्येक चैनल का streamUrl (m3u8 या mpd link) और DRM Keys बदल सकते हैं।
 */
export const DEFAULT_CHANNELS: Record<string, StreamChannelConfig> = {
  hindi: {
    id: "hindi",
    name: "Hindi Stream",
    hindiLabel: "हिंदी कमेंट्री",
    tag: "हिंदी HD",
    streamUrl: "paste link", // <- यहाँ अपनी Hindi stream URL paste करें
    drmKeyId: "key1",
    drmKey: "key2",
    fileName: "hindi.html",
    quality: "1080p 60fps"
  },
  english: {
    id: "english",
    name: "English Stream",
    hindiLabel: "इंग्लिश कमेंट्री",
    tag: "ENGLISH HD",
    streamUrl: "paste link", // <- यहाँ अपनी English stream URL paste करें
    drmKeyId: "key1",
    drmKey: "key2",
    fileName: "english.html",
    quality: "1080p 60fps"
  },
  willow: {
    id: "willow",
    name: "Willow Cricket",
    hindiLabel: "Willow HD (विलो)",
    tag: "WILLOW HD",
    streamUrl: "paste link", // <- यहाँ अपनी Willow stream URL paste करें
    drmKeyId: "key1",
    drmKey: "key2",
    fileName: "willow.html",
    quality: "4K UHD"
  }
};

/**
 * Demo Stream Links (परीक्षण के लिए जब तक यूजर अपना लिंक न डाले)
 */
export const DEMO_STREAMS = [
  {
    name: "Shaka Tears of Steel (DASH / 4K Test)",
    url: "https://storage.googleapis.com/shaka-demo-assets/tears-of-steel/dash.mpd"
  },
  {
    name: "Big Buck Bunny (HLS Test)",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  },
  {
    name: "Akamai Live Test (HLS Live)",
    url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8"
  }
];

/**
 * Preset 16:9 High-Def Thumbnails for fast match preview
 */
export const PRESET_THUMBNAILS = [
  {
    label: "Cricket Stadium Night",
    url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1280&auto=format&fit=crop"
  },
  {
    label: "FIFA Football Arena",
    url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1280&auto=format&fit=crop"
  },
  {
    label: "Cricket Bat & Ball Close",
    url: "https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?q=80&w=1280&auto=format&fit=crop"
  },
  {
    label: "World Cup Trophy Glow",
    url: "https://w0.peakpx.com/wallpaper/183/933/HD-wallpaper-fifa-world-cup-26-u-sports-soccer-mexico-canada-football-fifa-world-cup-world-cup-20.jpg"
  }
];
