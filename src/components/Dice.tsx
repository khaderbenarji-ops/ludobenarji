import React from 'react';
import { PlayerColor } from '../types/ludo';
import { COLOR_CONFIG } from '../utils/ludoConstants';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  canRoll: boolean;
  activeColor: PlayerColor;
  onRoll: () => void;
  disabled?: boolean;
  size?: 'normal' | 'large';
}

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  canRoll,
  activeColor,
  onRoll,
  disabled = false,
  size = 'normal',
}) => {
  const colorTheme = COLOR_CONFIG[activeColor];

  // Render pip dots for dice numbers 1 to 6
  const renderPips = (num: number) => {
    switch (num) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="w-4 h-4 rounded-full bg-rose-600 shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex flex-col justify-between p-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-800 self-start shadow-inner" />
            <span className="w-3 h-3 rounded-full bg-slate-800 self-end shadow-inner" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex flex-col justify-between p-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-800 self-start shadow-inner" />
            <span className="w-3 h-3 rounded-full bg-slate-800 self-center shadow-inner" />
            <span className="w-3 h-3 rounded-full bg-slate-800 self-end shadow-inner" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full flex flex-col justify-between p-1.5">
            <div className="flex justify-between">
              <span className="w-3 h-3 rounded-full bg-slate-800 shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-slate-800 shadow-inner" />
            </div>
            <div className="flex justify-between">
              <span className="w-3 h-3 rounded-full bg-slate-800 shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-slate-800 shadow-inner" />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full flex flex-col justify-between p-1.5">
            <div className="flex justify-between">
              <span className="w-3 h-3 rounded-full bg-slate-800 shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-slate-800 shadow-inner" />
            </div>
            <div className="flex justify-center">
              <span className="w-3 h-3 rounded-full bg-slate-800 shadow-inner" />
            </div>
            <div className="flex justify-between">
              <span className="w-3 h-3 rounded-full bg-slate-800 shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-slate-800 shadow-inner" />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full flex flex-col justify-between p-1.5">
            <div className="flex justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-inner" />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-inner" />
            </div>
            <div className="flex justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-inner" />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-inner" />
            </div>
            <div className="flex justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-inner" />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-inner" />
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm">
            TAP
          </div>
        );
    }
  };

  const isClickable = canRoll && !isRolling && !disabled;
  const dimensionClass = size === 'large' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-13 h-13 sm:w-16 sm:h-16';

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      <button
        type="button"
        onClick={() => {
          if (isClickable) onRoll();
        }}
        disabled={!isClickable}
        aria-label={`Dice value ${value ?? 'none'}`}
        className={`relative ${dimensionClass} rounded-2xl p-1 transition-all duration-200 cursor-pointer ${
          isClickable
            ? 'scale-100 hover:scale-105 active:scale-95 animate-pulse ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 shadow-lg shadow-amber-400/40'
            : 'opacity-95'
        }`}
        style={{
          background: `linear-gradient(145deg, #ffffff, #e2e8f0)`,
          boxShadow: isRolling
            ? '0 0 20px rgba(251, 191, 36, 0.8), 0 8px 16px rgba(0,0,0,0.3)'
            : '0 8px 16px -2px rgba(0,0,0,0.4), inset 0 2px 3px rgba(255,255,255,0.9), inset 0 -3px 4px rgba(0,0,0,0.2)',
          border: `2px solid ${colorTheme.primary}`,
        }}
      >
        {/* Dice face container */}
        <div
          className={`w-full h-full rounded-xl bg-gradient-to-br from-white to-slate-100 flex items-center justify-center border border-slate-200 shadow-inner ${
            isRolling ? 'animate-spin' : ''
          }`}
          style={{
            animationDuration: isRolling ? '0.35s' : '0s',
          }}
        >
          {isRolling ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-amber-500 animate-ping" />
            </div>
          ) : (
            renderPips(value ?? 1)
          )}
        </div>
      </button>

      {/* Bonus Turn / Six Indicator Badge */}
      {value === 6 && !isRolling && (
        <span className="absolute -top-3 -right-2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-wider shadow-md border border-white">
          +1 Turn
        </span>
      )}
    </div>
  );
};
