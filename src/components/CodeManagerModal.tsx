import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink, Code2, Key, Link2, Sparkles, Layers } from 'lucide-react';
import { ChannelId, StreamChannelConfig } from '../types';

interface CodeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Record<string, StreamChannelConfig>;
  onUpdateChannel: (id: ChannelId, updated: Partial<StreamChannelConfig>) => void;
  team1: string;
  team2: string;
}

export const CodeManagerModal: React.FC<CodeManagerModalProps> = ({
  isOpen,
  onClose,
  channels,
  onUpdateChannel,
  team1,
  team2,
}) => {
  const [activeTab, setActiveTab] = useState<ChannelId>('hindi');
  const [copied, setCopied] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!isOpen) return null;

  const currentChannel = channels[activeTab];

  // Helper to generate current HTML code for the selected file
  const generateFileHtml = (channel: StreamChannelConfig) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${team1} vs ${team2} - ${channel.name.toUpperCase()}</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.7.11/shaka-player.ui.min.js" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.7.11/controls.min.css" crossorigin="anonymous">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      background: #000;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .shaka-video-container {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    video {
      width: 100%;
      height: 100%;
      background: #000;
      object-fit: contain;
    }
    .shaka-spinner-container, .shaka-spinner, .shaka-spinner-svg {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
    }

    /* Screen Touch Refresh Button (Screen touch / hover par hi dikhega) */
    .stream-refresh-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 100;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    }
    .stream-refresh-btn.visible {
      opacity: 1;
      pointer-events: auto;
    }
    .stream-refresh-btn:hover {
      background: rgba(30, 41, 59, 0.95);
      transform: scale(1.08);
      border-color: rgba(255, 255, 255, 0.5);
    }
    .stream-refresh-btn svg {
      width: 22px;
      height: 22px;
      stroke: currentColor;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    }
    .stream-refresh-btn.spinning svg {
      animation: spinRefresh 0.8s linear infinite;
    }
    @keyframes spinRefresh {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .toast-msg {
      position: absolute;
      top: 75px;
      right: 20px;
      z-index: 101;
      background: rgba(0, 0, 0, 0.85);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.4);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 500;
      pointer-events: none;
      opacity: 0;
      transform: translateY(-8px);
      transition: all 0.25s ease;
    }
    .toast-msg.show {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body>
  <div class="shaka-video-container" id="playerContainer" data-shaka-player>
    <!-- Screen Touch Refresh Icon -->
    <button class="stream-refresh-btn" id="refreshBtn" title="Refresh Stream" aria-label="Refresh Stream">
      <svg viewBox="0 0 24 24">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.57 2.6L21 8"></path>
        <path d="M21 3v5h-5"></path>
      </svg>
    </button>
    <div class="toast-msg" id="toastMsg">Stream Refreshed ⚡</div>

    <video autoplay playsinline preload="metadata" poster="https://w0.peakpx.com/wallpaper/183/933/HD-wallpaper-fifa-world-cup-26-u-sports-soccer-mexico-canada-football-fifa-world-cup-world-cup-20.jpg"></video>
  </div>

  <script>
    // ============================================================
    // STREAM CONFIGURATION (${channel.name})
    // ============================================================
    const streamUrl = "${channel.streamUrl}";
    const drmConfig = {
      clearKeys: {
        "${channel.drmKeyId}": "${channel.drmKey}"
      }
    };
    // ============================================================

    let playerInstance = null;
    let hideControlsTimeout = null;

    document.addEventListener('DOMContentLoaded', async () => {
      const blockExternalAds = () => {
        const originalOpen = window.open;
        window.open = function () {
          console.warn('Blocked popup request');
          return null;
        };
        document.addEventListener('contextmenu', (event) => { event.preventDefault(); }, { passive: false });
        document.addEventListener('click', (event) => {
          const target = event.target;
          const anchor = target && target.closest ? target.closest('a') : null;
          if (anchor) { event.preventDefault(); event.stopPropagation(); }
        }, true);
        document.addEventListener('touchstart', (event) => {
          const target = event.target;
          const anchor = target && target.closest ? target.closest('a') : null;
          if (anchor) { event.preventDefault(); event.stopPropagation(); }
        }, { passive: false });
        document.addEventListener('touchend', (event) => {
          const target = event.target;
          const anchor = target && target.closest ? target.closest('a') : null;
          if (anchor) { event.preventDefault(); event.stopPropagation(); }
        }, { passive: false });
      };
      blockExternalAds();

      const container = document.getElementById('playerContainer');
      const refreshBtn = document.getElementById('refreshBtn');
      const toastMsg = document.getElementById('toastMsg');

      const showOverlayControls = () => {
        refreshBtn.classList.add('visible');
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(() => {
          refreshBtn.classList.remove('visible');
        }, 3200);
      };

      container.addEventListener('touchstart', showOverlayControls, { passive: true });
      container.addEventListener('mousemove', showOverlayControls, { passive: true });
      container.addEventListener('click', showOverlayControls, { passive: true });

      refreshBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        refreshBtn.classList.add('spinning');
        toastMsg.textContent = "Refreshing Stream...";
        toastMsg.classList.add('show');
        try {
          if (playerInstance) {
            await playerInstance.load(streamUrl);
          } else {
            const video = document.querySelector('video');
            video.load();
            video.play().catch(() => {});
          }
          toastMsg.textContent = "Stream Refreshed ⚡";
        } catch (err) {
          toastMsg.textContent = "Refreshed!";
        } finally {
          setTimeout(() => refreshBtn.classList.remove('spinning'), 600);
          setTimeout(() => toastMsg.classList.remove('show'), 2000);
        }
      });

      shaka.polyfill.installAll();
      if (!shaka.Player.isBrowserSupported()) {
        console.error('Browser not supported');
        return;
      }

      const video = document.querySelector('video');
      const player = new shaka.Player();
      playerInstance = player;
      await player.attach(video);

      const ui = new shaka.ui.Overlay(player, container, video);
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

      player.configure({
        drm: drmConfig,
        streaming: {
          lowLatencyMode: true,
          bufferingGoal: 15,
          rebufferingGoal: 2,
          bufferBehind: 15,
          retryParameters: { timeout: 10000, maxAttempts: 5, baseDelay: 300, backoffFactor: 1.2 },
          segmentRequestTimeout: 8000,
          segmentPrefetchLimit: 2,
          useNativeHlsOnSafari: true
        },
        manifest: {
          retryParameters: { timeout: 8000, maxAttempts: 3 }
        }
      });

      player.addEventListener('error', (event) => {
        console.error('Shaka Player Error:', event.detail);
      });

      if (streamUrl && streamUrl !== "paste link") {
        try {
          await player.load(streamUrl);
          console.log("Stream loaded successfully");
        } catch (error) {
          console.error('Load error:', error);
        }
      }
    });
  </script>
</body>
</html>`;
  };

  const handleCopyCode = () => {
    const code = generateFileHtml(currentChannel);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const code = generateFileHtml(currentChannel);
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentChannel.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const embedCode = `<iframe src="${window.location.origin}/${currentChannel.fileName}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                तीन फाइलें और कोड मैनेजर (3 Files & Code Manager)
              </h3>
              <p className="text-xs text-slate-400">
                हिंदी, इंग्लिश और Willow के कोड में बदलाव करें, कॉपी करें या स्टैंडअलोन फ़ाइल डाउनलोड करें
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Files Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-900 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('hindi')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'hindi'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>फ़ाइल 1: hindi.html (हिंदी)</span>
          </button>

          <button
            onClick={() => setActiveTab('english')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'english'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>फ़ाइल 2: english.html (इंग्लिश)</span>
          </button>

          <button
            onClick={() => setActiveTab('willow')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'willow'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>फ़ाइल 3: willow.html (Willow)</span>
          </button>
        </div>

        {/* Quick URL & DRM Keys Editor */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-sky-400" />
                Stream URL (m3u8 / mpd लिंक):
              </label>
              <input
                type="text"
                value={currentChannel.streamUrl}
                onChange={(e) =>
                  onUpdateChannel(activeTab, { streamUrl: e.target.value })
                }
                placeholder="उदा. https://example.com/live/index.m3u8"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                DRM Key (ClearKey):
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="text"
                  value={currentChannel.drmKeyId}
                  onChange={(e) =>
                    onUpdateChannel(activeTab, { drmKeyId: e.target.value })
                  }
                  placeholder="Key ID"
                  className="px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs focus:outline-none"
                />
                <input
                  type="text"
                  value={currentChannel.drmKey}
                  onChange={(e) =>
                    onUpdateChannel(activeTab, { drmKey: e.target.value })
                  }
                  placeholder="Key"
                  className="px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 relative select-text">
          <pre className="whitespace-pre overflow-x-auto leading-relaxed">
            {generateFileHtml(currentChannel)}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={`/${currentChannel.fileName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>फ़ाइल सीधे खोलें (/{currentChannel.fileName})</span>
            </a>

            <button
              onClick={handleCopyEmbed}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>{copiedEmbed ? 'Embed Code Copied!' : 'Copy OBS/Embed Code'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFile}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{currentChannel.fileName} डाउनलोड करें</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'कोड कॉपी हो गया!' : 'पूरा कोड कॉपी करें (Copy Code)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
