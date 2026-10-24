import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCw, AlertCircle, Play, ExternalLink, Settings, Sparkles, Volume2 } from 'lucide-react';
import { StreamChannelConfig, MatchInfo } from '../types';
import { DEMO_STREAMS } from '../config/matchConfig';

// Declare Shaka global from CDN
declare global {
  interface Window {
    shaka: any;
  }
}

interface ShakaStreamPlayerProps {
  channel: StreamChannelConfig;
  matchInfo: MatchInfo;
  onOpenCodeEditor: () => void;
  onUpdateChannelUrl: (channelId: string, newUrl: string) => void;
}

export const ShakaStreamPlayer: React.FC<ShakaStreamPlayerProps> = ({
  channel,
  matchInfo,
  onOpenCodeEditor,
  onUpdateChannelUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const uiRef = useRef<any>(null);

  const [controlsVisible, setControlsVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState(channel.streamUrl !== 'paste link' ? channel.streamUrl : '');
  const [isLoaded, setIsLoaded] = useState(false);

  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger controls overlay visibility on touch or mouse interaction
  const triggerControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3200);
  }, []);

  // Refresh stream action
  const handleRefreshStream = useCallback(async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsRefreshing(true);
    setToastMessage('Stream Refreshing...');

    try {
      const video = videoRef.current;
      const player = playerRef.current;

      const targetUrl = channel.streamUrl && channel.streamUrl !== 'paste link'
        ? channel.streamUrl
        : customUrlInput;

      if (player && targetUrl && targetUrl !== 'paste link') {
        await player.load(targetUrl);
        setToastMessage('Stream Refreshed ⚡');
        setStreamError(null);
      } else if (video) {
        video.load();
        await video.play().catch(() => {});
        setToastMessage('Player Refreshed ⚡');
      }
    } catch (err: any) {
      console.warn('Stream reload error:', err);
      setToastMessage('Stream Reset Done');
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
      setTimeout(() => setToastMessage(null), 2400);
    }
  }, [channel.streamUrl, customUrlInput]);

  // Initialize or reconfigure Shaka Player
  useEffect(() => {
    let isMounted = true;

    const initShaka = async () => {
      if (!window.shaka) {
        console.warn('Shaka player CDN script not yet loaded');
        return;
      }

      window.shaka.polyfill.installAll();
      if (!window.shaka.Player.isBrowserSupported()) {
        if (isMounted) setStreamError('ब्राउज़र Shaka Player को सपोर्ट नहीं करता');
        return;
      }

      const video = videoRef.current;
      const container = containerRef.current;
      if (!video || !container) return;

      try {
        // Destroy existing player if any
        if (playerRef.current) {
          await playerRef.current.destroy();
        }

        const player = new window.shaka.Player();
        playerRef.current = player;
        await player.attach(video);

        // UI Overlay configuration
        const ui = new window.shaka.ui.Overlay(player, container, video);
        uiRef.current = ui;
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
            'fullscreen'
          ],
          volumeBarColors: {
            base: 'rgba(0, 136, 255, 0.3)',
            level: 'rgb(0, 136, 255)'
          },
          seekBarColors: {
            base: 'rgba(90, 0, 0, 0.3)',
            buffered: 'rgba(120, 0, 0, 0.6)',
            played: 'rgb(170, 0, 0)'
          }
        });

        // DRM clearKeys setup
        const drmConfig = {
          clearKeys: {
            [channel.drmKeyId || 'key1']: channel.drmKey || 'key2'
          }
        };

        player.configure({
          drm: drmConfig,
          streaming: {
            lowLatencyMode: true,
            bufferingGoal: 15,
            rebufferingGoal: 2,
            bufferBehind: 15,
            retryParameters: {
              timeout: 10000,
              maxAttempts: 5,
              baseDelay: 300,
              backoffFactor: 1.2
            },
            segmentRequestTimeout: 8000,
            segmentPrefetchLimit: 2,
            useNativeHlsOnSafari: true
          },
          manifest: {
            retryParameters: {
              timeout: 8000,
              maxAttempts: 3
            }
          }
        });

        player.addEventListener('error', (event: any) => {
          console.error('Shaka Player Error:', event.detail);
          if (isMounted) {
            setStreamError(`Stream Load Error: ${event.detail?.message || 'Check stream link'}`);
          }
        });

        const activeUrl = channel.streamUrl !== 'paste link' ? channel.streamUrl : customUrlInput;

        if (activeUrl && activeUrl !== 'paste link') {
          try {
            await player.load(activeUrl);
            if (isMounted) {
              setStreamError(null);
              setIsLoaded(true);
            }
          } catch (loadErr: any) {
            console.warn('Initial stream load failed:', loadErr);
            if (isMounted) {
              setStreamError('स्ट्रीम लोड करने में समस्या: कृपया मान्य m3u8 या mpd लिंक डालें।');
            }
          }
        } else {
          if (isMounted) {
            setIsLoaded(false);
          }
        }
      } catch (err: any) {
        console.error('Shaka init error:', err);
      }
    };

    initShaka();

    return () => {
      isMounted = false;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (playerRef.current) {
        playerRef.current.destroy().catch(() => {});
      }
    };
  }, [channel.id, channel.streamUrl]);

  const handleApplyUrl = (newUrl: string) => {
    setCustomUrlInput(newUrl);
    onUpdateChannelUrl(channel.id, newUrl);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Player Screen Container */}
      <div
        ref={containerRef}
        onTouchStart={triggerControls}
        onTouchMove={triggerControls}
        onMouseMove={triggerControls}
        onClick={triggerControls}
        className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group select-none"
        data-shaka-player
      >
        {/* HTML5 Video Element with YouTube Thumbnail as Poster */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          preload="metadata"
          poster={matchInfo.thumbnailUrl}
          className="w-full h-full object-contain bg-black"
        />

        {/* ------------------------------------------------------------- */}
        {/* 🔄 SCREEN TOUCH REFRESH ICON (User Requirement: Screen touch / hover par hi dikhega) */}
        {/* ------------------------------------------------------------- */}
        <button
          onClick={handleRefreshStream}
          onTouchEnd={(e) => {
            e.stopPropagation();
            handleRefreshStream();
          }}
          title="Refresh Stream (स्ट्रीम रिफ्रेश करें)"
          aria-label="Refresh Stream"
          className={`absolute top-4 right-4 z-40 w-11 h-11 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 hover:border-white/50 backdrop-blur-md text-white flex items-center justify-center shadow-xl cursor-pointer transition-all duration-300 ${
            controlsVisible
              ? 'opacity-100 pointer-events-auto scale-100'
              : 'opacity-0 pointer-events-none scale-90'
          } ${isRefreshing ? 'border-sky-400 text-sky-400' : ''}`}
        >
          <RotateCw
            className={`w-5 h-5 transition-transform ${isRefreshing ? 'animate-spin text-sky-400' : 'group-hover:rotate-45'}`}
          />
        </button>

        {/* Live Channel Badge Overlay (Touch-activated) */}
        <div
          className={`absolute top-4 left-4 z-30 transition-all duration-300 pointer-events-none ${
            controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-red-600/90 text-white font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {channel.tag}
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur text-slate-300 text-[11px] font-medium border border-white/10">
              {channel.quality}
            </span>
          </div>
        </div>

        {/* Toast Notification for Screen Refresh */}
        {toastMessage && (
          <div className="absolute top-16 right-4 z-40 px-3.5 py-1.5 rounded-full bg-black/90 border border-sky-400/50 text-sky-300 text-xs font-semibold shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
            {toastMessage}
          </div>
        )}

        {/* Placeholder Screen when stream is "paste link" */}
        {(!customUrlInput || customUrlInput === 'paste link') && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center mb-3">
              <Play className="w-8 h-8 translate-x-0.5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {channel.name} ({channel.hindiLabel})
            </h3>
            <p className="text-xs text-slate-300 max-w-md mb-4">
              इस चैनल का स्ट्रीम लिंक अभी <code className="text-amber-400 font-mono">paste link</code> पर सेट है। नीचे अपना m3u8/mpd लिंक डालें या डेमो स्ट्रीम टेस्ट करें।
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleApplyUrl(DEMO_STREAMS[0].url)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/20 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                डेमो 4K स्ट्रीम चालू करें (Test Stream)
              </button>
              <button
                onClick={onOpenCodeEditor}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-sky-400" />
                लिंक व DRM कोड बदलें
              </button>
            </div>
          </div>
        )}

        {/* Stream Error Banner */}
        {streamError && customUrlInput && customUrlInput !== 'paste link' && (
          <div className="absolute bottom-16 left-4 right-4 z-30 bg-red-950/90 border border-red-600/60 rounded-xl p-3 backdrop-blur text-red-200 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{streamError}</span>
            </div>
            <button
              onClick={() => handleRefreshStream()}
              className="px-2.5 py-1 rounded bg-red-600 text-white font-semibold text-[11px] shrink-0 hover:bg-red-500"
            >
              दोबारा लोड करें
            </button>
          </div>
        )}
      </div>

      {/* Quick Stream Link Bar & Standalone Link */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <span className="font-semibold text-slate-300 shrink-0 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {channel.name} Link:
          </span>
          <input
            type="text"
            value={customUrlInput}
            onChange={(e) => setCustomUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleApplyUrl(customUrlInput);
              }
            }}
            placeholder="paste m3u8 or mpd link here..."
            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 text-xs font-mono focus:outline-none focus:border-red-500"
          />
          <button
            onClick={() => handleApplyUrl(customUrlInput)}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors shrink-0"
          >
            लागू करें (Apply)
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Standalone HTML File Button */}
          <a
            href={`/${channel.fileName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition-colors"
            title={`Open standalone /${channel.fileName} in full screen browser / OBS`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            <span>Standalone {channel.fileName}</span>
          </a>

          <button
            onClick={() => handleRefreshStream()}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80"
            title="Refresh Player"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
