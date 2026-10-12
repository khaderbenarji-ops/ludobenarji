import React, { useState } from 'react';
import { GameMode, GameSettings, UserProfile } from '../types/ludo';
import { AVATAR_OPTIONS, COUNTRY_LIST } from '../utils/ludoConstants';
import { sounds } from '../utils/audio';
import { canClaimDailyReward, markDailyRewardClaimed } from '../utils/storage';
import {
  Coins,
  Gem,
  Settings,
  HelpCircle,
  Volume2,
  VolumeX,
  Bot,
  Users,
  Zap,
  Shield,
  Trophy,
  Gift,
  Sparkles,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface HomeScreenProps {
  userProfile: UserProfile;
  settings: GameSettings;
  onStartGame: (mode: GameMode, playerCount: 2 | 3 | 4) => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onToggleSound: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  settings,
  onStartGame,
  onOpenProfile,
  onOpenSettings,
  onOpenRules,
  onUpdateProfile,
  onToggleSound,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(2);
  const [showPlayerCountModal, setShowPlayerCountModal] = useState<boolean>(false);
  const [hasDailyReward, setHasDailyReward] = useState<boolean>(canClaimDailyReward());
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  const currentAvatar =
    AVATAR_OPTIONS.find((a) => a.id === userProfile.avatar) || AVATAR_OPTIONS[0];
  const currentCountry =
    COUNTRY_LIST.find((c) => c.code === userProfile.country) || COUNTRY_LIST[0];

  const handleModeClick = (mode: GameMode) => {
    sounds.playClick();
    if (mode === 'quick-play') {
      onStartGame('quick-play', 2);
    } else {
      setSelectedMode(mode);
      setShowPlayerCountModal(true);
    }
  };

  const handleConfirmStart = () => {
    sounds.playClick();
    if (selectedMode) {
      setShowPlayerCountModal(false);
      onStartGame(selectedMode, playerCount);
    }
  };

  const handleClaimDailyReward = () => {
    sounds.playVictory();
    markDailyRewardClaimed();
    setHasDailyReward(false);
    onUpdateProfile({
      ...userProfile,
      coins: userProfile.coins + 500,
      gems: userProfile.gems + 10,
    });
    setRewardToast('+500 Coins & +10 Gems Claimed!');
    setTimeout(() => setRewardToast(null), 3000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Background patterned overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Top Header Bar (Screenshot 6 style!) */}
      <header className="relative w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between z-20">
        {/* Profile Info */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenProfile();
          }}
          className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 hover:border-amber-400 transition cursor-pointer shadow-lg group"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md border-2 border-amber-400 ${currentAvatar.bg} group-hover:scale-105 transition`}
          >
            {currentAvatar.emoji}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-white group-hover:text-amber-300 transition">
                {userProfile.name}
              </span>
              <span className="text-xs">{currentCountry.flag}</span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold block">
              Level {userProfile.level}
            </span>
          </div>
        </button>

        {/* Currency Counters */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/50 shadow-inner">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-black text-amber-300 font-mono tabular-nums">
              {userProfile.coins.toLocaleString()}
            </span>
          </div>

          {/* Gems */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/50 shadow-inner">
            <Gem className="w-4 h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-black text-cyan-300 font-mono tabular-nums">
              {userProfile.gems.toLocaleString()}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition cursor-pointer"
            title={settings.soundEnabled ? 'Mute' : 'Unmute'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Rules */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenRules();
            }}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition cursor-pointer"
            title="Rules"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="relative flex-1 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center justify-center z-10">
        {/* Toast Alert */}
        {rewardToast && (
          <div className="absolute top-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl animate-bounce z-30">
            {rewardToast}
          </div>
        )}

        {/* Hero Title & Royal Crown Emblem */}
        <div className="text-center mb-6 sm:mb-8 select-none">
          <div className="relative inline-block">
            <span className="text-5xl sm:text-6xl filter drop-shadow-[0_10px_10px_rgba(245,158,11,0.5)] animate-bounce">
              👑
            </span>
            <div className="mt-1 flex items-center justify-center gap-1 sm:gap-2">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
                LUDO
              </span>
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 drop-shadow-md">
                ROYALE
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-amber-200/90 tracking-widest uppercase mt-0.5">
              The Classic Board Championship
            </p>
          </div>

          {/* Daily Reward Claim Strip */}
          {hasDailyReward && (
            <div className="mt-4">
              <button
                onClick={handleClaimDailyReward}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition transform border border-white cursor-pointer"
              >
                <Gift className="w-4 h-4 animate-spin" />
                <span>Claim Free Daily Bonus (+500 Coins!)</span>
              </button>
            </div>
          )}
        </div>

        {/* Game Mode Cards Grid (Screenshot 6 style!) */}
        <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Card 1: PLAY VS COMPUTER */}
          <button
            onClick={() => handleModeClick('vs-computer')}
            className="group relative p-4 rounded-3xl bg-gradient-to-br from-blue-900/80 to-slate-900/90 border-2 border-blue-500/60 hover:border-amber-400 shadow-xl transition-all duration-200 text-left cursor-pointer hover:scale-102"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition shrink-0">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider mb-0.5">
                  Single Player
                </span>
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition leading-tight">
                  Vs Computer
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Play against smart AI bots with genuine tactics
                </p>
              </div>
            </div>
          </button>

          {/* Card 2: PASS AND PLAY */}
          <button
            onClick={() => handleModeClick('pass-n-play')}
            className="group relative p-4 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-amber-950/40 border-2 border-amber-500/60 hover:border-amber-400 shadow-xl transition-all duration-200 text-left cursor-pointer hover:scale-102"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition shrink-0">
                <Users className="w-8 h-8 text-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-0.5">
                  Local Match
                </span>
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition leading-tight">
                  Pass & Play
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Pass the device with 2 to 4 family & friends
                </p>
              </div>
            </div>
          </button>

          {/* Card 3: QUICK MATCH */}
          <button
            onClick={() => handleModeClick('quick-play')}
            className="group relative p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-emerald-950/40 border-2 border-emerald-500/60 hover:border-amber-400 shadow-xl transition-all duration-200 text-left cursor-pointer hover:scale-102"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition shrink-0">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-0.5">
                  Fast 1v1
                </span>
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition leading-tight">
                  Quick Game
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Instant duel with 2 tokens or fast rules
                </p>
              </div>
            </div>
          </button>

          {/* Card 4: 4-PLAYER BATTLE */}
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedMode('vs-computer');
              setPlayerCount(4);
              onStartGame('vs-computer', 4);
            }}
            className="group relative p-4 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-rose-950/40 border-2 border-rose-500/60 hover:border-amber-400 shadow-xl transition-all duration-200 text-left cursor-pointer hover:scale-102"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition shrink-0">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-wider mb-0.5">
                  Royale Battle
                </span>
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition leading-tight">
                  4-Player Grand Slam
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Full 4-corner board battle with all colors
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Player Stats Ribbon */}
        <div className="mt-6 flex items-center gap-6 text-xs text-slate-400 font-bold">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>
              Wins:{' '}
              <strong className="text-white font-mono">{userProfile.gamesWon}</strong>
            </span>
          </div>
          <span>·</span>
          <div>
            Played:{' '}
            <strong className="text-white font-mono">{userProfile.gamesPlayed}</strong>
          </div>
          <span>·</span>
          <div>
            Win Rate:{' '}
            <strong className="text-emerald-400 font-mono">
              {userProfile.gamesPlayed > 0
                ? `${Math.round((userProfile.gamesWon / userProfile.gamesPlayed) * 100)}%`
                : '100%'}
            </strong>
          </div>
        </div>
      </main>

      {/* Bottom Footer Navigation */}
      <footer className="w-full max-w-md mx-auto px-4 pb-4 pt-1 z-20 text-center">
        <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenProfile();
            }}
            className="text-xs font-bold text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>👤</span> Profile
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenRules();
            }}
            className="text-xs font-bold text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>📜</span> How to Play
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenSettings();
            }}
            className="text-xs font-bold text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>⚙️</span> Options
          </button>
        </div>
      </footer>

      {/* Player Count Selection Modal */}
      {showPlayerCountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 border-2 border-amber-400 rounded-3xl p-6 text-center shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-amber-300 uppercase tracking-wide">
              Select Number of Players
            </h3>
            <p className="text-xs text-slate-300">
              {selectedMode === 'vs-computer'
                ? 'Choose how many opponents you want to challenge'
                : 'Choose how many players will share this device'}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[2, 3, 4].map((count) => {
                const isSelected = playerCount === count;
                return (
                  <button
                    key={count}
                    onClick={() => {
                      sounds.playClick();
                      setPlayerCount(count as 2 | 3 | 4);
                    }}
                    className={`p-3 rounded-2xl border-2 font-black transition cursor-pointer flex flex-col items-center ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400/20 text-white scale-105 shadow-lg shadow-amber-400/30'
                        : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-2xl mb-1">
                      {count === 2 ? '👥' : count === 3 ? '👪' : '👨‍👩‍👧‍👦'}
                    </span>
                    <span className="text-sm">{count} Players</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setShowPlayerCountModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStart}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 cursor-pointer"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
