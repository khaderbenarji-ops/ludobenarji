import React from 'react';
import { MoveOption, Player, PlayerColor, Token } from '../types/ludo';
import { COLOR_CONFIG } from '../utils/ludoConstants';
import { TokenPiece } from './TokenPiece';
import { Star } from 'lucide-react';

interface LudoBoardProps {
  players: Player[];
  activeColor: PlayerColor;
  legalMoves: MoveOption[];
  onSelectToken: (token: Token) => void;
  interactive?: boolean;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  players,
  activeColor,
  legalMoves,
  onSelectToken,
  interactive = true,
}) => {
  // Collect all tokens from all players and group them by board position
  const allTokens = players.flatMap((p) => p.tokens);

  // Group tokens by approximate position to compute stacking offsets
  const tokenGroups: { [key: string]: Token[] } = {};
  allTokens.forEach((t) => {
    // Round position to handle slight fractional coordinates
    const key = `${t.position.r.toFixed(1)}_${t.position.c.toFixed(1)}`;
    if (!tokenGroups[key]) tokenGroups[key] = [];
    tokenGroups[key].push(t);
  });

  const legalTokenIds = new Set(legalMoves.map((m) => `${m.token.color}-${m.tokenId}`));

  // Helper to render track cells with correct background and symbols
  const renderTrackCell = (r: number, c: number) => {
    // Safe Star positions
    const isSafeStar =
      (r === 2 && c === 6) ||
      (r === 6 && c === 12) ||
      (r === 12 && c === 8) ||
      (r === 8 && c === 2);

    // Start squares (colored with arrows)
    const isRedStart = r === 6 && c === 1;
    const isGreenStart = r === 1 && c === 8;
    const isYellowStart = r === 8 && c === 13;
    const isBlueStart = r === 13 && c === 6;

    // Home entry arrows
    const isRedEntry = r === 7 && c === 0;
    const isGreenEntry = r === 0 && c === 7;
    const isYellowEntry = r === 7 && c === 14;
    const isBlueEntry = r === 14 && c === 7;

    // Home paths
    const isRedHome = r === 7 && c >= 1 && c <= 5;
    const isGreenHome = c === 7 && r >= 1 && r <= 5;
    const isYellowHome = r === 7 && c >= 9 && c <= 13;
    const isBlueHome = c === 7 && r >= 9 && r <= 13;

    let bgStyle = 'bg-white';
    let cellBorder = 'border-slate-300';
    let content: React.ReactNode = null;

    if (isRedHome || isRedStart) {
      bgStyle = 'bg-rose-500';
      cellBorder = 'border-rose-600';
    } else if (isGreenHome || isGreenStart) {
      bgStyle = 'bg-emerald-500';
      cellBorder = 'border-emerald-600';
    } else if (isYellowHome || isYellowStart) {
      bgStyle = 'bg-amber-400';
      cellBorder = 'border-amber-500';
    } else if (isBlueHome || isBlueStart) {
      bgStyle = 'bg-blue-500';
      cellBorder = 'border-blue-600';
    }

    if (isSafeStar) {
      content = (
        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-400 filter drop-shadow-sm" />
      );
    } else if (isRedStart || isRedEntry) {
      content = <span className="text-white font-black text-xs sm:text-sm">➔</span>;
    } else if (isGreenStart || isGreenEntry) {
      content = <span className="text-white font-black text-xs sm:text-sm">⬇</span>;
    } else if (isYellowStart || isYellowEntry) {
      content = <span className="text-white font-black text-xs sm:text-sm">⬅</span>;
    } else if (isBlueStart || isBlueEntry) {
      content = <span className="text-white font-black text-xs sm:text-sm">⬆</span>;
    }

    return (
      <div
        key={`cell-${r}-${c}`}
        className={`relative w-full h-full border ${cellBorder} ${bgStyle} flex items-center justify-center`}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="relative w-full aspect-square max-w-[500px] sm:max-w-[540px] md:max-w-[580px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-slate-900 select-none">
      {/* 15x15 Grid Layout */}
      <div className="relative w-full h-full grid grid-cols-15 grid-rows-15 bg-white">
        {/* ================= 4 BASE CORNERS (6x6 each) ================= */}
        {/* Top-Left: RED BASE (rows 0..5, cols 0..5) */}
        <div className="col-start-1 col-end-7 row-start-1 row-end-7 p-2 sm:p-2.5 bg-rose-500 border-2 border-slate-900 flex flex-col justify-between">
          <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl border-2 border-rose-600 p-2 sm:p-3 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 items-center justify-items-center shadow-inner">
            {[0, 1, 2, 3].map((slot) => (
              <div
                key={`red-slot-${slot}`}
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-rose-100 border-2 border-rose-400 shadow-inner flex items-center justify-center"
              >
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-rose-500/20" />
              </div>
            ))}
          </div>
        </div>

        {/* Top-Right: GREEN BASE (rows 0..5, cols 9..14) */}
        <div className="col-start-10 col-end-16 row-start-1 row-end-7 p-2 sm:p-2.5 bg-emerald-500 border-2 border-slate-900 flex flex-col justify-between">
          <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl border-2 border-emerald-600 p-2 sm:p-3 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 items-center justify-items-center shadow-inner">
            {[0, 1, 2, 3].map((slot) => (
              <div
                key={`green-slot-${slot}`}
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-emerald-100 border-2 border-emerald-400 shadow-inner flex items-center justify-center"
              >
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-emerald-500/20" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-Left: BLUE BASE (rows 9..14, cols 0..5) */}
        <div className="col-start-1 col-end-7 row-start-10 row-end-16 p-2 sm:p-2.5 bg-blue-500 border-2 border-slate-900 flex flex-col justify-between">
          <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl border-2 border-blue-600 p-2 sm:p-3 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 items-center justify-items-center shadow-inner">
            {[0, 1, 2, 3].map((slot) => (
              <div
                key={`blue-slot-${slot}`}
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-blue-100 border-2 border-blue-400 shadow-inner flex items-center justify-center"
              >
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-blue-500/20" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-Right: YELLOW BASE (rows 9..14, cols 9..14) */}
        <div className="col-start-10 col-end-16 row-start-10 row-end-16 p-2 sm:p-2.5 bg-amber-400 border-2 border-slate-900 flex flex-col justify-between">
          <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl border-2 border-amber-500 p-2 sm:p-3 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 items-center justify-items-center shadow-inner">
            {[0, 1, 2, 3].map((slot) => (
              <div
                key={`yellow-slot-${slot}`}
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-amber-100 border-2 border-amber-400 shadow-inner flex items-center justify-center"
              >
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-amber-400/25" />
              </div>
            ))}
          </div>
        </div>

        {/* ================= TOP ARM TRACK (rows 0..5, cols 6..8) ================= */}
        <div className="col-start-7 col-end-10 row-start-1 row-end-7 grid grid-cols-3 grid-rows-6">
          {[0, 1, 2, 3, 4, 5].flatMap((r) => [6, 7, 8].map((c) => renderTrackCell(r, c)))}
        </div>

        {/* ================= RIGHT ARM TRACK (rows 6..8, cols 9..14) ================= */}
        <div className="col-start-10 col-end-16 row-start-7 row-end-10 grid grid-cols-6 grid-rows-3">
          {[6, 7, 8].flatMap((r) => [9, 10, 11, 12, 13, 14].map((c) => renderTrackCell(r, c)))}
        </div>

        {/* ================= BOTTOM ARM TRACK (rows 9..14, cols 6..8) ================= */}
        <div className="col-start-7 col-end-10 row-start-10 row-end-16 grid grid-cols-3 grid-rows-6">
          {[9, 10, 11, 12, 13, 14].flatMap((r) => [6, 7, 8].map((c) => renderTrackCell(r, c)))}
        </div>

        {/* ================= LEFT ARM TRACK (rows 6..8, cols 0..5) ================= */}
        <div className="col-start-1 col-end-7 row-start-7 row-end-10 grid grid-cols-6 grid-rows-3">
          {[6, 7, 8].flatMap((r) => [0, 1, 2, 3, 4, 5].map((c) => renderTrackCell(r, c)))}
        </div>

        {/* ================= CENTER HOME AREA (3x3: rows 6..8, cols 6..8) ================= */}
        <div className="col-start-7 col-end-10 row-start-7 row-end-10 relative overflow-hidden border-2 border-slate-900 bg-slate-950">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Red Left Triangle */}
            <polygon points="0,0 50,50 0,100" fill="#E11D48" />
            {/* Green Top Triangle */}
            <polygon points="0,0 100,0 50,50" fill="#16A34A" />
            {/* Yellow Right Triangle */}
            <polygon points="100,0 100,100 50,50" fill="#EAB308" />
            {/* Blue Bottom Triangle */}
            <polygon points="0,100 100,100 50,50" fill="#2563EB" />
            {/* Center Crown / Trophy Medallion */}
            <circle cx="50" cy="50" r="14" fill="#0F172A" stroke="#F59E0B" strokeWidth="2.5" />
            <text
              x="50"
              y="55"
              textAnchor="middle"
              fontSize="14"
              fill="#F59E0B"
              fontWeight="900"
            >
              👑
            </text>
          </svg>
        </div>
      </div>

      {/* ================= FLOATING TOKENS LAYER ================= */}
      <div className="absolute inset-0 pointer-events-none">
        {Object.entries(tokenGroups).map(([posKey, tokensInCell]) => {
          return tokensInCell.map((token, stackIdx) => {
            const isLegal = legalTokenIds.has(`${token.color}-${token.id}`);
            const cellWidthPct = 100 / 15;
            const cellHeightPct = 100 / 15;

            // Compute center of cell
            const leftPct = token.position.c * cellWidthPct + cellWidthPct / 2;
            const topPct = token.position.r * cellHeightPct + cellHeightPct / 2;

            return (
              <div
                key={`tok-${token.color}-${token.id}`}
                className="absolute"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto',
                }}
              >
                <TokenPiece
                  token={token}
                  isLegalMove={isLegal}
                  onSelect={onSelectToken}
                  stackIndex={stackIdx}
                  totalInCell={tokensInCell.length}
                  interactive={interactive}
                />
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};
