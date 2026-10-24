import React, { useState } from 'react';
import { matchDetails } from './name-change';
import { RotateCw, Radio, Zap } from 'lucide-react';

type Channel = 'hindi' | 'english' | 'willow';

const CHANNELS: { id: Channel; label: string; sub: string; file: string; glow: string; activeBg: string }[] = [
  {
    id: 'hindi',
    label: 'Hindi',
    sub: 'हिंदी फीड',
    file: '/hindi.html',
    glow: 'shadow-red-500/25 border-red-500/60',
    activeBg: 'from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-600/40 border-red-400',
  },
  {
    id: 'english',
    label: 'English',
    sub: 'इंग्लिश फीड',
    file: '/english.html',
    glow: 'shadow-sky-500/25 border-sky-500/60',
    activeBg: 'from-sky-600 via-blue-600 to-indigo-700 text-white shadow-lg shadow-sky-500/40 border-sky-400',
  },
  {
    id: 'willow',
    label: 'Willow',
    sub: 'विलो एचडी',
    file: '/willow.html',
    glow: 'shadow-emerald-500/25 border-emerald-500/60',
    activeBg: 'from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-lg shadow-emerald-500/40 border-emerald-400',
  },
];

export default function App() {
  const [activeChannel, setActiveChannel] = useState<Channel>('hindi');
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshStream = () => {
    setIsRefreshing(true);
    setIframeKey(Date.now());
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const currentChannelObj = CHANNELS.find((c) => c.id === activeChannel) || CHANNELS[0];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden relative">
      {/* Dynamic Background Neon Lighting & Stadium Glow */}
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-[550px] h-[350px] bg-sky-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-20 right-1/4 translate-x-1/2 w-[550px] h-[350px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-5 flex-1">
        
        {/* =========================================================================
            1. TOP: MATCH NAME (IND vs NZ) & AESTHETIC 16:9 THUMBNAIL
            ========================================================================= */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a0f1d] to-slate-950 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
          {/* Subtle neon accents along top edge */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 via-amber-400 to-red-500" />
          
          {/* Background YouTube Thumbnail with dark cinematic gradient mask */}
          {matchDetails.thumbnailPhoto && (
            <div className="absolute inset-0 z-0 opacity-25 overflow-hidden">
              <img
                src={matchDetails.thumbnailPhoto}
                alt="Match Thumbnail"
                className="w-full h-full object-cover scale-105 filter blur-[1px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050811] via-transparent to-[#050811]" />
            </div>
          )}

          <div className="relative z-10 px-4 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Team vs Team Header */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              {/* Tournament / Category Badge with Neon Lighting */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-red-600/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-500/20 tracking-wider">
                  <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                  LIVE MATCH
                </span>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 tracking-wide uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  {matchDetails.matchType}
                </span>
              </div>

              {/* Big Aesthetic VS Typography */}
              <div className="flex items-center gap-3 sm:gap-5">
                <span className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_2px_12px_rgba(56,189,248,0.4)] text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-sky-200">
                  {matchDetails.team1}
                </span>

                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 p-[2px] shadow-lg shadow-red-600/40">
                    <div className="w-full h-full rounded-full bg-[#070b14] flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-red-500 italic">
                        VS
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_2px_12px_rgba(239,68,68,0.4)] text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-red-200">
                  {matchDetails.team2}
                </span>
              </div>
            </div>

            {/* 16:9 YouTube Thumbnail Mini Display (Aesthetic Broadcast Card) */}
            {matchDetails.thumbnailPhoto && (
              <div className="shrink-0 relative aspect-video w-36 sm:w-48 rounded-xl overflow-hidden border border-sky-500/30 shadow-xl shadow-sky-950/50 group">
                <img
                  src={matchDetails.thumbnailPhoto}
                  alt="YouTube 16:9 Thumbnail"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] font-bold text-white drop-shadow">
                  <span className="text-amber-400 truncate max-w-[80px]">{matchDetails.team1} v {matchDetails.team2}</span>
                  <span className="bg-red-600/90 px-1.5 py-0.2 rounded text-[9px]">16:9</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            2. MIDDLE: STREAM SCREEN / VIDEO PLAYER (WITH TOUCH REFRESH ICON)
            ========================================================================= */}
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-sky-500/30 via-slate-800 to-red-500/30 shadow-[0_10px_35px_-10px_rgba(14,165,233,0.25)]">
          <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl">
            {/* Active Stream iframe running /hindi.html, /english.html, or /willow.html */}
            <iframe
              key={`${currentChannelObj.id}-${iframeKey}`}
              src={currentChannelObj.file}
              title={`${matchDetails.team1} vs ${matchDetails.team2} - ${currentChannelObj.label}`}
              className="w-full h-full border-0 bg-black block"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />

            {/* Touch / Hover Screen Refresh Button */}
            <button
              onClick={handleRefreshStream}
              title="Refresh Stream"
              aria-label="Refresh Stream"
              className="absolute top-4 right-4 z-30 w-11 h-11 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 hover:border-sky-400 text-white flex items-center justify-center shadow-2xl transition-all duration-200 active:scale-90 cursor-pointer backdrop-blur-md opacity-80 hover:opacity-100 hover:shadow-sky-500/30"
            >
              <RotateCw className={`w-4 h-4 transition-colors ${isRefreshing ? 'animate-spin text-sky-400' : 'text-slate-200'}`} />
            </button>
          </div>
        </div>

        {/* =========================================================================
            3. BOTTOM: 3 BUTTONS (Hindi, English, Willow)
            ========================================================================= */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {CHANNELS.map((ch) => {
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`group relative overflow-hidden py-3 sm:py-4 px-3 sm:px-6 rounded-2xl font-bold transition-all duration-300 cursor-pointer border flex flex-col items-center justify-center gap-1 ${
                  isActive
                    ? `bg-gradient-to-b ${ch.activeBg} scale-[1.02] shadow-xl`
                    : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white backdrop-blur-md'
                }`}
              >
                {/* Active Neon Glow Light */}
                {isActive && (
                  <span className="absolute top-0 inset-x-0 h-[2px] bg-white/80 shadow-[0_0_12px_#fff]" />
                )}

                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                  <span className="text-base sm:text-xl font-black tracking-wide">
                    {ch.label}
                  </span>
                </div>

                <span className={`text-[11px] sm:text-xs font-semibold ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
                  {ch.sub}
                </span>
              </button>
            );
          })}
        </div>

      </main>
    </div>
  );
}
