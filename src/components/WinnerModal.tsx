import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../types/ludo';
import { sounds } from '../utils/audio';
import { Trophy, RotateCcw, Home, Award, Coins } from 'lucide-react';
import { COLOR_CONFIG } from '../utils/ludoConstants';

interface WinnerModalProps {
  winner: Player;
  allPlayers: Player[];
  onPlayAgain: () => void;
  onHome: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  allPlayers,
  onPlayAgain,
  onHome,
}) => {
  useEffect(() => {
    sounds.playVictory();
    // Confetti cannons
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const config = COLOR_CONFIG[winner.color];

  // Sort standings: finished tokens descending
  const standings = [...allPlayers].sort((a, b) => {
    const aFin = a.tokens.filter((t) => t.step === 56 || t.isHome).length;
    const bFin = b.tokens.filter((t) => t.step === 56 || t.isHome).length;
    return bFin - aFin;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 rounded-3xl border-3 border-amber-400 shadow-2xl p-6 text-white text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Big Trophy Medallion */}
        <div className="relative mx-auto w-24 h-24 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center shadow-xl border-2 border-white">
            <Trophy className="w-10 h-10 text-slate-950 fill-amber-300 filter drop-shadow" />
          </div>
        </div>

        {/* Title */}
        <span className="inline-block px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
          VICTORY ROYALE
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
          {winner.name} Wins!
        </h2>
        <p className="text-xs text-slate-300 mb-4">
          All 4 tokens safely reached Home!
        </p>

        {/* Reward Coins Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-black text-sm mb-5">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>+500 Coins Earned!</span>
        </div>

        {/* Standings List */}
        <div className="space-y-2 mb-6 text-left">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Final Standings
          </div>
          {standings.map((p, idx) => {
            const pConfig = COLOR_CONFIG[p.color];
            const finishedTokens = p.tokens.filter((t) => t.step === 56 || t.isHome).length;
            const isChamp = idx === 0;

            return (
              <div
                key={p.id}
                className={`flex items-center justify-between p-2.5 rounded-2xl border transition ${
                  isChamp
                    ? 'bg-amber-500/15 border-amber-400/60 shadow-md'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      isChamp
                        ? 'bg-amber-400 text-slate-950'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-900'
                        : 'bg-amber-800 text-amber-100'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/50"
                    style={{ backgroundColor: pConfig.primary }}
                  />
                  <span className="text-sm font-bold text-white truncate max-w-[120px]">
                    {p.name}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-300 font-mono">
                  {finishedTokens}/4 Home
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onPlayAgain();
            }}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onHome();
            }}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Lobby
          </button>
        </div>
      </div>
    </div>
  );
};
