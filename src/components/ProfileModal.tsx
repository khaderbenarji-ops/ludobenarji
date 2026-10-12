import React, { useState } from 'react';
import { UserProfile } from '../types/ludo';
import { AVATAR_OPTIONS, COUNTRY_LIST } from '../utils/ludoConstants';
import { sounds } from '../utils/audio';
import { X, Check, Globe, Edit2 } from 'lucide-react';

interface ProfileModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [country, setCountry] = useState(profile.country);

  if (!isOpen) return null;

  const handleSave = () => {
    sounds.playClick();
    onSave({
      ...profile,
      name: name.trim() || 'BayMajor',
      avatar,
      country,
    });
    onClose();
  };

  const selectedAvatarObj = AVATAR_OPTIONS.find((a) => a.id === avatar) || AVATAR_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-400 shadow-2xl p-5 sm:p-6 text-white overflow-hidden">
        {/* Header Ribbon */}
        <div className="relative -mt-2 mb-4 text-center">
          <div className="inline-block px-8 py-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 rounded-lg shadow-lg border border-amber-300 transform -rotate-1">
            <h2 className="text-base sm:text-lg font-black tracking-wide text-amber-200 uppercase drop-shadow-sm">
              Edit Profile
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-0 right-0 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name and Current Avatar preview */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-blue-800/60 mb-4 flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-amber-400 ${selectedAvatarObj.bg}`}
          >
            {selectedAvatarObj.emoji}
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Enter Name
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={name}
                maxLength={15}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                placeholder="Enter player name"
              />
              <Edit2 className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Country Selector */}
        <div className="bg-slate-900/80 rounded-2xl p-3 border border-blue-800/60 mb-4">
          <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Select Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {COUNTRY_LIST.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Avatar Grid (Screenshot 4 style!) */}
        <div className="mb-5">
          <label className="text-xs font-black text-amber-300 uppercase tracking-wider block mb-2 text-center">
            Select Profile Picture
          </label>
          <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-950/70 rounded-2xl border border-slate-800 scrollbar-thin">
            {AVATAR_OPTIONS.map((opt) => {
              const isSelected = avatar === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    sounds.playClick();
                    setAvatar(opt.id);
                  }}
                  className={`relative p-2 rounded-xl flex items-center justify-center text-2xl transition-all ${
                    opt.bg
                  } ${
                    isSelected
                      ? 'ring-4 ring-amber-400 scale-105 shadow-lg shadow-amber-400/40 z-10'
                      : 'opacity-80 hover:opacity-100 hover:scale-100'
                  }`}
                >
                  <span>{opt.emoji}</span>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-base uppercase tracking-wider shadow-xl shadow-emerald-500/30 border-2 border-emerald-300 active:scale-98 transition transform cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
};
