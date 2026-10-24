import React, { useState } from 'react';
import { MatchInfo } from '../types';
import { Edit3, ArrowLeftRight, Trophy, Radio, MapPin, Check, Code, Shield } from 'lucide-react';

interface MatchBannerProps {
  matchInfo: MatchInfo;
  onUpdateMatchInfo: (updated: Partial<MatchInfo>) => void;
  onOpenCodeEditor: () => void;
}

export const MatchBanner: React.FC<MatchBannerProps> = ({
  matchInfo,
  onUpdateMatchInfo,
  onOpenCodeEditor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [team1, setTeam1] = useState(matchInfo.team1);
  const [team2, setTeam2] = useState(matchInfo.team2);
  const [tournament, setTournament] = useState(matchInfo.tournament);
  const [tagline, setTagline] = useState(matchInfo.tagline);
  const [venue, setVenue] = useState(matchInfo.venue || '');
  const [status, setStatus] = useState(matchInfo.status);

  const handleSave = () => {
    onUpdateMatchInfo({
      team1: team1.trim() || 'TEAM 1',
      team2: team2.trim() || 'TEAM 2',
      tournament: tournament.trim() || 'LIVE MATCH',
      tagline: tagline.trim(),
      venue: venue.trim(),
      status,
    });
    setIsEditing(false);
  };

  const handleSwap = () => {
    const temp = team1;
    setTeam1(team2);
    setTeam2(temp);
    onUpdateMatchInfo({
      team1: team2,
      team2: temp,
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/80 shadow-2xl p-4 sm:p-6 mb-6">
      {/* Background stadium light ambient glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Tournament & Status & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/60 relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider animate-pulse">
            <Radio className="w-3.5 h-3.5 text-red-500" />
            <span>{matchInfo.status}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[200px] sm:max-w-xs">{matchInfo.tournament}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isEditing
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'टीम नाम बदलें (Edit Names)'}</span>
          </button>

          <button
            onClick={onOpenCodeEditor}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700/80 flex items-center gap-1.5 transition-colors"
            title="View & Edit Code (hindi.html, english.html, willow.html)"
          >
            <Code className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Code Files</span>
          </button>
        </div>
      </div>

      {/* Editing Form */}
      {isEditing ? (
        <div className="relative z-10 bg-slate-950/90 border border-amber-500/40 rounded-xl p-4 sm:p-5 mb-4 animate-in fade-in duration-200">
          <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            मैच विवरण और टीमों के नाम बदलें (Update Match & Team Names)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                टीम 1 का नाम (First Team Name):
              </label>
              <input
                type="text"
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
                placeholder="उदा. INDIA, REAL MADRID"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-base focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                टीम 2 का नाम (Second Team Name):
              </label>
              <input
                type="text"
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
                placeholder="उदा. AUSTRALIA, BARCELONA"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-base focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                टूर्नामेंट / मैच का नाम (Tournament Name):
              </label>
              <input
                type="text"
                value={tournament}
                onChange={(e) => setTournament(e.target.value)}
                placeholder="उदा. ICC T20 WORLD CUP 2026"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                वेन्यू / स्टेडियम (Venue):
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="उदा. Melbourne Cricket Ground"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-slate-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={handleSwap}
              type="button"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>टीमों की जगह बदलें (Swap Teams)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                रद्द करें (Cancel)
              </button>
              <button
                onClick={handleSave}
                type="button"
                className="px-5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>सेव करें (Save Changes)</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Broadcast VS Scoreboard Display */}
      <div className="relative z-10 py-3 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4 text-center">
          {/* Team 1 Card */}
          <div className="md:col-span-5 flex flex-col items-center md:items-end justify-center">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-red-400 block">
                  TEAM ONE (पहला नाम)
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase drop-shadow-md">
                  {matchInfo.team1}
                </h2>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-xl shadow-red-600/20 border border-white/20">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>

          {/* VS Center Emblem */}
          <div className="md:col-span-1 flex flex-col items-center justify-center my-1 md:my-0">
            <div className="relative flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-amber-500 to-red-600 p-[2px] shadow-2xl shadow-red-600/40">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center">
                  <span className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 tracking-wider">
                    VS
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase -mt-1 tracking-widest">
                    वर्सेस
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Team 2 Card */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start justify-center">
            <div className="flex items-center gap-3 flex-row-reverse md:flex-row">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-blue-600/20 border border-white/20">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="text-left">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-blue-400 block">
                  TEAM TWO (दूसरा नाम)
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase drop-shadow-md">
                  {matchInfo.team2}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Venue & Tagline Footer */}
        {(matchInfo.venue || matchInfo.tagline) && (
          <div className="mt-4 pt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 border-t border-slate-800/40">
            {matchInfo.venue && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {matchInfo.venue}
              </span>
            )}
            {matchInfo.tagline && (
              <span className="text-slate-500">• {matchInfo.tagline}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
