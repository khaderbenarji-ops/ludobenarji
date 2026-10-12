import React from 'react';
import { GameSettings } from '../types/ludo';
import { sounds } from '../utils/audio';
import { X, Volume2, VolumeX, Zap, ShieldAlert, Sparkles, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const toggle = (key: keyof GameSettings) => {
    sounds.playClick();
    const updated = { ...settings, [key]: !settings[key] };
    onUpdateSettings(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 rounded-3xl border-2 border-amber-400 shadow-2xl p-5 sm:p-6 text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-wide">
              Settings
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setting Items */}
        <div className="space-y-3.5">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <p className="text-sm font-bold">Sound Effects</p>
                <p className="text-[11px] text-slate-400">Dice roll, moves, captures</p>
              </div>
            </div>
            <button
              onClick={() => toggle('soundEnabled')}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.soundEnabled ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Fast Play */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-bold">Fast Bot Turns</p>
                <p className="text-[11px] text-slate-400">Instant AI move playback</p>
              </div>
            </div>
            <button
              onClick={() => toggle('fastPlay')}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors ${
                settings.fastPlay ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.fastPlay ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto-move Single Legal Move */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-bold">Auto-Move Single Piece</p>
                <p className="text-[11px] text-slate-400">When only 1 valid move exists</p>
              </div>
            </div>
            <button
              onClick={() => toggle('autoMoveSingle')}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors ${
                settings.autoMoveSingle ? 'bg-blue-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.autoMoveSingle ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Three Sixes Rule */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <div>
                <p className="text-sm font-bold">Three Sixes Penalty</p>
                <p className="text-[11px] text-slate-400">Forfeit turn after 3 sixes</p>
              </div>
            </div>
            <button
              onClick={() => toggle('threeSixesPenalty')}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors ${
                settings.threeSixesPenalty ? 'bg-rose-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.threeSixesPenalty ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Done */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
