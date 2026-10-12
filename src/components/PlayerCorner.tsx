import React from 'react';
import { Player } from '../types/ludo';
import { COLOR_CONFIG } from '../utils/ludoConstants';
import { Crown, Bot, User } from 'lucide-react';

interface PlayerCornerProps {
  player: Player;
  isActive: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const PlayerCorner: React.FC<PlayerCornerProps> = ({
  player,
  isActive,
  position,
}) => {
  const config = COLOR_CONFIG[player.color];
  const finishedCount = player.tokens.filter((t) => t.step === 56 || t.isHome).length;

  return (
    <div
      className={`relative flex items-center gap-2 p-1.5 sm:p-2 rounded-xl border transition-all duration-300 select-none ${
        isActive
          ? 'bg-slate-900/90 border-amber-400 shadow-lg shadow-amber-400/20 scale-102 ring-2 ring-amber-400/60'
          : 'bg-slate-900/60 border-slate-800 opacity-90'
      }`}
    >
      {/* Player Avatar */}
      <div className="relative shrink-0">
        <div
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-lg sm:text-xl border-2 shadow-inner ${
            isActive ? 'border-amber-400 animate-pulse' : 'border-slate-700'
          }`}
          style={{ backgroundColor: config.primary }}
        >
          {player.type === 'computer' ? (
            <Bot className="w-5 h-5 text-white" />
          ) : (
            <span className="filter drop-shadow-sm">
              {player.avatar === 'king-crown' ? '👑' : player.avatar === 'cool-shades' ? '😎' : '🧢'}
            </span>
          )}
        </div>

        {/* Color Pin Badge */}
        <div
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 shadow"
          style={{ backgroundColor: config.primary }}
        />
      </div>

      {/* Player Info */}
      <div className="flex flex-col min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[80px] sm:max-w-[100px]">
            {player.name}
          </span>
          {player.rank && (
            <span className="flex items-center gap-0.5 px-1 py-0.2 bg-amber-400 text-slate-950 font-black text-[9px] rounded uppercase">
              <Crown className="w-2.5 h-2.5" /> #{player.rank}
            </span>
          )}
        </div>

        {/* Tokens finished progress */}
        <div className="flex items-center gap-1 mt-0.5">
          {[0, 1, 2, 3].map((idx) => (
            <span
              key={`star-prog-${idx}`}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                idx < finishedCount
                  ? 'bg-amber-400 shadow-sm shadow-amber-400'
                  : 'bg-slate-700 border border-slate-600'
              }`}
            />
          ))}
          <span className="text-[10px] text-slate-400 ml-1 font-mono tabular-nums">
            {finishedCount}/4
          </span>
        </div>
      </div>
    </div>
  );
};
