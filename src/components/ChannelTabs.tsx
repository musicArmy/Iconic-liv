import React from 'react';
import { ChannelId, StreamChannelConfig } from '../types';
import { Radio, ExternalLink, Globe, FileCode, Check } from 'lucide-react';

interface ChannelTabsProps {
  channels: Record<string, StreamChannelConfig>;
  activeChannel: ChannelId;
  onSelectChannel: (channelId: ChannelId) => void;
  onOpenCodeEditor: () => void;
}

export const ChannelTabs: React.FC<ChannelTabsProps> = ({
  channels,
  activeChannel,
  onSelectChannel,
  onOpenCodeEditor,
}) => {
  const channelList: { id: ChannelId; title: string; sub: string; badge: string; color: string; file: string }[] = [
    {
      id: 'hindi',
      title: 'हिंदी (Hindi)',
      sub: 'हिंदी कमेंट्री लाइव',
      badge: 'FEED 1',
      color: 'from-red-600 to-rose-600',
      file: 'hindi.html',
    },
    {
      id: 'english',
      title: 'English (इंग्लिश)',
      sub: 'English Commentary HD',
      badge: 'FEED 2',
      color: 'from-blue-600 to-indigo-600',
      file: 'english.html',
    },
    {
      id: 'willow',
      title: 'Willow (विलो)',
      sub: 'Willow HD Broadcast',
      badge: 'FEED 3',
      color: 'from-emerald-600 to-teal-600',
      file: 'willow.html',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-red-500" />
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            स्ट्रीमिंग चैनल चुनें (Select Stream Feed)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">
            3 Standalone Files Available:
          </span>
          <button
            onClick={onOpenCodeEditor}
            className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <FileCode className="w-3 h-3" />
            <span>View All 3 Codes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {channelList.map((ch) => {
          const isActive = activeChannel === ch.id;
          const config = channels[ch.id];
          const hasCustomUrl = config.streamUrl && config.streamUrl !== 'paste link';

          return (
            <div
              key={ch.id}
              onClick={() => onSelectChannel(ch.id)}
              className={`relative rounded-xl p-3 border cursor-pointer transition-all ${
                isActive
                  ? 'bg-slate-800/90 border-red-500 shadow-lg shadow-red-500/10 ring-1 ring-red-500/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-slate-300 border border-white/10">
                  {ch.badge}
                </span>

                <div className="flex items-center gap-1.5">
                  {hasCustomUrl ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Link Set
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-medium">
                      paste link
                    </span>
                  )}
                  {isActive && (
                    <span className="p-0.5 bg-red-600 rounded-full text-white">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    {ch.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">{ch.sub}</p>
                </div>

                {/* Direct file popout link */}
                <a
                  href={`/${ch.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title={`Open /${ch.file} in new tab (OBS Browser Source / Fullscreen)`}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
