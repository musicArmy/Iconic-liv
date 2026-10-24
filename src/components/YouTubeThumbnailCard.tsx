import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, X, Check, Eye } from 'lucide-react';
import { PRESET_THUMBNAILS } from '../config/matchConfig';

interface YouTubeThumbnailCardProps {
  thumbnailUrl: string;
  onUpdateThumbnail: (url: string) => void;
  team1: string;
  team2: string;
  tournament: string;
}

export const YouTubeThumbnailCard: React.FC<YouTubeThumbnailCardProps> = ({
  thumbnailUrl,
  onUpdateThumbnail,
  team1,
  team2,
  tournament,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('कृपया केवल इमेज फ़ाइल (JPG, PNG, WEBP) अपलोड करें।');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onUpdateThumbnail(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-600/20 text-red-400 rounded-lg">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base flex items-center gap-2">
              यूट्यूब थंबनेल (YouTube Thumbnail)
              <span className="text-xs font-normal px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full">
                16:9 Ratio
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              मैच का 16:9 थंबनेल अपलोड करें जो लाइव पेज और प्लेयर पोस्टर पर दिखेगा
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Preset Posters</span>
          </button>
        </div>
      </div>

      {/* Preset selection dropdown */}
      {showPresets && (
        <div className="mb-4 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400 mb-2">तुरंत प्रीसेट पोस्टर चुनें (Select Preset Poster):</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_THUMBNAILS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onUpdateThumbnail(preset.url);
                  setShowPresets(false);
                }}
                className={`relative aspect-video rounded-lg overflow-hidden border transition-all text-left group ${
                  thumbnailUrl === preset.url
                    ? 'border-red-500 ring-2 ring-red-500/30'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium truncate drop-shadow">
                    {preset.label}
                  </span>
                </div>
                {thumbnailUrl === preset.url && (
                  <div className="absolute top-1 right-1 bg-red-600 rounded-full p-0.5 text-white">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 16:9 YouTube Thumbnail Display & Drag-Drop Box */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative aspect-video w-full rounded-xl overflow-hidden border-2 transition-all group ${
          isDragging
            ? 'border-red-500 bg-red-950/20 shadow-lg shadow-red-500/20'
            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
        }`}
      >
        {thumbnailUrl ? (
          <>
            <img
              src={thumbnailUrl}
              alt="Match YouTube Thumbnail"
              className="w-full h-full object-cover"
            />
            {/* Overlay Gradient with Team Details */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

            {/* YouTube Badge Watermark */}
            <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded tracking-wider flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              LIVE 16:9 THUMBNAIL
            </div>

            {/* Match info overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
              <div>
                <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest drop-shadow">
                  {tournament}
                </p>
                <h4 className="text-base sm:text-xl font-black text-white drop-shadow-md flex items-center gap-2">
                  <span>{team1}</span>
                  <span className="text-red-500 text-sm font-extrabold italic">VS</span>
                  <span>{team2}</span>
                </h4>
              </div>
              <span className="text-[10px] bg-black/70 backdrop-blur text-slate-300 px-2 py-0.5 rounded border border-white/10">
                1280 × 720
              </span>
            </div>

            {/* Floating Action Buttons on Hover */}
            <div className="absolute top-3 right-3 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setPreviewModal(true)}
                title="Full Preview"
                className="p-2 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur border border-white/20 transition-all hover:scale-105"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Change Photo"
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg transition-all hover:scale-105 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                बदलें (Change)
              </button>
            </div>
          </>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6 text-center hover:bg-slate-900/50 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-red-400 group-hover:scale-110 transition-all mb-3">
              <Upload className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">
              यूट्यूब थंबनेल फोटो अपलोड करें (Upload 16:9 Thumbnail)
            </p>
            <p className="text-xs text-slate-400 max-w-sm mb-3">
              फोटो को यहाँ ड्रैग करें या क्लिक करके अपने फोन/कंप्यूटर से सेलेक्ट करें
            </p>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              16:9 Aspect Ratio (1280x720 / JPG / PNG / WEBP)
            </span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />
      </div>

      {/* Full Preview Modal */}
      {previewModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-semibold text-white text-sm">
                यूट्यूब थंबनेल प्रीव्यू (16:9 Preview)
              </h3>
              <button
                onClick={() => setPreviewModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black relative">
              <img
                src={thumbnailUrl}
                alt="Full Preview"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-3 bg-slate-900 flex justify-between items-center text-xs text-slate-400">
              <span>{team1} vs {team2}</span>
              <span>16:9 Standard YouTube Broadcast Dimensions</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
