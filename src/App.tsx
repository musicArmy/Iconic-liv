import React, { useEffect, useRef, useState } from 'react';
import { matchDetails } from './name-change';
import { RotateCw, Radio, Zap } from 'lucide-react';

type Channel = 'hindi' | 'english' | 'willow';

type StreamConfig = {
  id: Channel;
  label: string;
  sub: string;
  streamUrl: string;
  keyId: string;
  key: string;
  glow: string;
  activeBg: string;
  accent: string;
};

const CHANNELS: StreamConfig[] = [
  {
    id: 'hindi',
    label: 'Hindi',
    sub: 'हिंदी फीड',
    streamUrl: 'https://otte.live.fly.ww.aiv-cdn.net/fra-nitro/live/clients/dash/enc/mmvlg151u6/out/v1/ab9d1f193c094ee8a9305f983a716f35/cenc.mpd?',
    keyId: '18e6af4a0daf2a1fdfbdc5b541520c88',
    key: 'ca0b64b84edb4f20eb1e135ff03db4f7',
    glow: 'shadow-red-500/25 border-red-500/60',
    activeBg: 'from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-600/40 border-red-400',
    accent: 'bg-red-500',
  },
  {
    id: 'english',
    label: 'English',
    sub: 'इंग्लिश फीड',
    streamUrl: 'https://otte.live.fly.ww.aiv-cdn.net/lhr-nitro/live/clients/dash/enc/di53wexuc7/out/v1/40b0a31c1c5b4f4aa41286cb1313cf87/cenc.mpd?',
    keyId: '01501c3401dabab0e68c1d58b2ed5bde',
    key: '4c1167220c5d1358d630245281ceba58',
    glow: 'shadow-sky-500/25 border-sky-500/60',
    activeBg: 'from-sky-600 via-blue-600 to-indigo-700 text-white shadow-lg shadow-sky-500/40 border-sky-400',
    accent: 'bg-sky-500',
  },
  {
    id: 'willow',
    label: 'Willow',
    sub: 'विलो एचडी',
    streamUrl: 'https://otte.live.fly.ww.aiv-cdn.net/iad-nitro/live/clients/dash/enc/ntomodyqm3/out/v1/cd61ecc8b6694006a1173974fcfa4e9e/cenc.mpd?',
    keyId: '8c80205dcd2490ef9386a322c46aef12',
    key: '0dba6b2d52b76e5dff92fac577e7ac8d',
    glow: 'shadow-emerald-500/25 border-emerald-500/60',
    activeBg: 'from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-lg shadow-emerald-500/40 border-emerald-400',
    accent: 'bg-emerald-500',
  },
];

declare global {
  interface Window {
    shaka: any;
  }
}

export default function App() {
  const [activeChannel, setActiveChannel] = useState<Channel>('hindi');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentChannel = CHANNELS.find((channel) => channel.id === activeChannel) ?? CHANNELS[0];

  useEffect(() => {
    let cancelled = false;

    const setupPlayer = async () => {
      if (!window.shaka) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.7.11/shaka-player.ui.min.js';
        script.crossOrigin = 'anonymous';
        script.async = true;
        script.onload = async () => {
          if (!cancelled) {
            await setupPlayer();
          }
        };
        document.head.appendChild(script);
        return;
      }

      const video = videoRef.current;
      const container = containerRef.current;
      if (!video || !container) {
        return;
      }

      try {
        if (playerRef.current) {
          try {
            await playerRef.current.destroy();
          } catch (destroyError) {
            console.warn('Shaka destroy warning:', destroyError);
          }
        }

        window.shaka.polyfill.installAll();
        if (!window.shaka.Player.isBrowserSupported()) {
          if (!cancelled) setError('This browser does not support Shaka Player.');
          return;
        }

        const player = new window.shaka.Player();
        playerRef.current = player;
        await player.attach(video);

        const ui = new window.shaka.ui.Overlay(player, container, video);
        ui.configure({
          controlPanelElements: [
            'play_pause',
            'time_and_duration',
            'mute',
            'volume',
            'spacer',
            'language',
            'captions',
            'picture_in_picture',
            'quality',
            'fullscreen',
          ],
          volumeBarColors: {
            base: 'rgba(0, 136, 255, 0.3)',
            level: 'rgb(0, 136, 255)',
          },
          seekBarColors: {
            base: 'rgba(90, 0, 0, 0.3)',
            buffered: 'rgba(120, 0, 0, 0.6)',
            played: 'rgb(170, 0, 0)',
          },
        });

        player.configure({
          drm: {
            clearKeys: {
              [currentChannel.keyId]: currentChannel.key,
            },
          },
          streaming: {
            lowLatencyMode: true,
            bufferingGoal: 15,
            rebufferingGoal: 2,
            bufferBehind: 15,
            retryParameters: { timeout: 10000, maxAttempts: 5, baseDelay: 300, backoffFactor: 1.2 },
            segmentRequestTimeout: 8000,
            segmentPrefetchLimit: 2,
            useNativeHlsOnSafari: true,
          },
          manifest: {
            retryParameters: { timeout: 8000, maxAttempts: 3 },
          },
        });

        player.addEventListener('error', (event: any) => {
          console.error('Shaka player error:', event.detail);
          if (!cancelled) {
            setError(`Stream issue: ${event.detail?.message || 'Please check the stream link.'}`);
          }
        });

        if (!cancelled) {
          setError(null);
          setIsLoading(true);
        }

        await player.load(currentChannel.streamUrl);
        if (!cancelled) {
          setIsLoading(false);
          setError(null);
        }
      } catch (loadError) {
        console.error('Player init error:', loadError);
        if (!cancelled) {
          setError('Unable to load stream. Please try again.');
          setIsLoading(false);
        }
      }
    };

    setupPlayer();

    return () => {
      cancelled = true;
      if (playerRef.current) {
        playerRef.current.destroy().catch(() => undefined);
      }
    };
  }, [currentChannel]);

  const handleRefreshStream = async () => {
    if (!playerRef.current) return;
    setIsRefreshing(true);
    setError(null);

    try {
      await playerRef.current.load(currentChannel.streamUrl);
    } catch (refreshError) {
      console.error('Refresh error:', refreshError);
      setError('Stream refresh failed. Please retry.');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden relative">
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-[550px] h-[350px] bg-sky-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-20 right-1/4 translate-x-1/2 w-[550px] h-[350px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      <main className="relative z-10 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-5 flex-1">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a0f1d] to-slate-950 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 via-amber-400 to-red-500" />

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
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-red-600/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-50/10">
                  <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                  LIVE MATCH
                </span>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 tracking-wide uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  {matchDetails.matchType}
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-5">
                <span className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_2px_12px_rgba(56,189,248,0.4)] text-transparent bg-clip-text bg-gradient-to-br from-sky-300 via-white to-red-400">
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

                <span className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_2px_12px_rgba(239,68,68,0.4)] text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-white to-red-400">
                  {matchDetails.team2}
                </span>
              </div>
            </div>

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

        <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-sky-500/30 via-slate-800 to-red-500/30 shadow-[0_10px_35px_-10px_rgba(14,165,233,0.25)]">
          <div ref={containerRef} className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              preload="metadata"
              className="w-full h-full object-contain bg-black"
            />

            <button
              onClick={handleRefreshStream}
              title="Refresh Stream"
              aria-label="Refresh Stream"
              className="absolute top-4 right-4 z-30 w-11 h-11 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 hover:border-sky-400 text-white flex items-center justify-center"
            >
              <RotateCw className={`w-4 h-4 transition-colors ${isRefreshing ? 'animate-spin text-sky-400' : 'text-slate-200'}`} />
            </button>

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-slate-200 text-sm font-semibold tracking-wide">
                Loading {currentChannel.label} stream...
              </div>
            )}

            {error && (
              <div className="absolute bottom-4 left-4 right-4 z-30 rounded-xl border border-red-500/50 bg-red-950/90 px-3 py-2 text-xs text-red-100">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {CHANNELS.map((channel) => {
            const isActive = activeChannel === channel.id;
            return (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`group relative overflow-hidden py-3 sm:py-4 px-3 sm:px-6 rounded-2xl font-bold transition-all duration-300 cursor-pointer border flex flex-col items-center justify-center ${
                  isActive
                    ? `bg-gradient-to-b ${channel.activeBg} scale-[1.02] shadow-xl`
                    : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white backdrop-blur-md'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 inset-x-0 h-[2px] bg-white/80 shadow-[0_0_12px_#fff]" />
                )}

                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                  <span className="text-base sm:text-xl font-black tracking-wide">{channel.label}</span>
                </div>

                <span className={`text-[11px] sm:text-xs font-semibold ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
                  {channel.sub}
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
