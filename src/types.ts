export interface MatchInfo {
  team1: string;
  team2: string;
  tournament: string;
  category: 'cricket' | 'football' | 'tennis' | 'other';
  status: 'LIVE' | 'UPCOMING' | 'FINISHED' | 'DELAYED';
  tagline: string;
  venue?: string;
  thumbnailUrl: string;
}

export interface StreamChannelConfig {
  id: 'hindi' | 'english' | 'willow';
  name: string;
  hindiLabel: string;
  tag: string;
  streamUrl: string;
  drmKeyId: string;
  drmKey: string;
  fileName: string;
  quality: string;
}

export type ChannelId = 'hindi' | 'english' | 'willow';
