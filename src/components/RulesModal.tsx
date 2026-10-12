import React from 'react';
import { X, ShieldCheck, Dice6, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rules = [
    {
      icon: <Dice6 className="w-6 h-6 text-amber-400" />,
      title: 'Exit Base with a 6',
      desc: 'Each player has 4 tokens in their yard. You must roll a 6 to bring a token out onto the board track.',
    },
    {
      icon: <ArrowRight className="w-6 h-6 text-blue-400" />,
      title: 'Clockwise Movement',
      desc: 'Move tokens along the track according to your dice roll. All players travel clockwise around the perimeter.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: 'Safe Squares & Stars',
      desc: '8 squares with Stars ⭐ and Start arrows are completely safe! Tokens on safe squares can stack together peacefully without capture.',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-rose-400" />,
      title: 'Capture & Bonus Turns',
      desc: "Landing on an opponent's token outside safe zones captures it, sends it back to base, and rewards you with an EXTRA turn!",
    },
    {
      icon: <Dice6 className="w-6 h-6 text-purple-400" />,
      title: 'Rolling a 6 Bonus',
      desc: 'Rolling a 6 always earns you an additional turn. Rolling three 6s consecutively forfeits the turn.',
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      title: 'Home Path & Victory',
      desc: 'Enter your designated colored home column. You need the EXACT dice count to enter the center triangle. First to bring all 4 tokens Home wins!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 rounded-3xl border-2 border-amber-400 shadow-2xl p-5 sm:p-6 text-white overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 uppercase tracking-wide">
              Official Ludo Rules
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

        {/* Scrollable Rules List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-400/50 transition"
            >
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 shrink-0 mt-0.5">
                {rule.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">{rule.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
        >
          Got It, Let's Play!
        </button>
      </div>
    </div>
  );
};
