import React from 'react';
import { PlayerColor, Token } from '../types/ludo';
import { COLOR_CONFIG } from '../utils/ludoConstants';

interface TokenPieceProps {
  token: Token;
  isLegalMove: boolean;
  onSelect: (token: Token) => void;
  stackIndex?: number;
  totalInCell?: number;
  interactive?: boolean;
}

export const TokenPiece: React.FC<TokenPieceProps> = ({
  token,
  isLegalMove,
  onSelect,
  stackIndex = 0,
  totalInCell = 1,
  interactive = true,
}) => {
  const config = COLOR_CONFIG[token.color];

  // Offset calculation for multi-token stacks
  let offsetX = 0;
  let offsetY = 0;
  let scale = 1;

  if (totalInCell > 1) {
    scale = totalInCell > 2 ? 0.72 : 0.82;
    if (totalInCell === 2) {
      offsetX = stackIndex === 0 ? -6 : 6;
      offsetY = stackIndex === 0 ? -5 : 5;
    } else if (totalInCell === 3) {
      if (stackIndex === 0) {
        offsetX = 0;
        offsetY = -8;
      } else if (stackIndex === 1) {
        offsetX = -7;
        offsetY = 6;
      } else {
        offsetX = 7;
        offsetY = 6;
      }
    } else {
      // 4 tokens
      const positions = [
        { x: -7, y: -7 },
        { x: 7, y: -7 },
        { x: -7, y: 7 },
        { x: 7, y: 7 },
      ];
      offsetX = positions[stackIndex % 4].x;
      offsetY = positions[stackIndex % 4].y;
    }
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (isLegalMove && interactive) {
          onSelect(token);
        }
      }}
      className={`absolute z-20 transition-all duration-300 ease-out select-none ${
        isLegalMove && interactive
          ? 'cursor-pointer hover:scale-125 z-40'
          : 'pointer-events-none'
      }`}
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
      }}
    >
      {/* Legal Move Glow Halo */}
      {isLegalMove && (
        <span
          className="absolute -inset-1 rounded-full animate-ping opacity-75"
          style={{ backgroundColor: config.primary }}
        />
      )}

      {/* 3D Pawn Body */}
      <div
        className={`relative w-7 h-7 sm:w-8 sm:h-8 flex flex-col items-center justify-center filter drop-shadow-md ${
          isLegalMove ? 'animate-bounce' : ''
        }`}
      >
        {/* Pawn Top / Head Sphere */}
        <div
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center relative border-2 border-white/90 shadow-md"
          style={{
            background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${config.primary} 55%, ${config.secondary} 100%)`,
          }}
        >
          {/* Inner ring marker (classic Ludo King pawn detail) */}
          <div className="w-2 h-2 rounded-full border border-white/80 bg-white/30" />
        </div>

        {/* Pawn Skirt Base */}
        <div
          className="w-4 h-1.5 rounded-full -mt-0.5 border border-white/50"
          style={{
            background: `linear-gradient(to bottom, ${config.primary}, ${config.secondary})`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
          }}
        />
      </div>
    </div>
  );
};
