export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export type PlayerType = 'human' | 'computer';

export type GameMode = 'vs-computer' | 'pass-n-play' | 'quick-play' | 'team-up';

export interface Token {
  id: number; // 0, 1, 2, 3
  color: PlayerColor;
  step: number; // -1: in base, 0..50: outer track, 51..55: home path, 56: home reached
  position: { r: number; c: number }; // Current board grid row & col (0..14)
  isHome: boolean;
  isSafe: boolean;
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  type: PlayerType;
  avatar: string;
  country: string;
  tokens: Token[];
  rank?: number; // 1st, 2nd, 3rd, 4th
  tokensFinished: number;
}

export interface BoardCell {
  r: number;
  c: number;
  type: 'base' | 'track' | 'home-path' | 'center' | 'empty';
  color?: PlayerColor;
  isSafe?: boolean;
  hasStar?: boolean;
  hasArrow?: boolean;
  trackIndex?: number;
  homeIndex?: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  fastPlay: boolean; // Faster animation
  threeSixesPenalty: boolean; // Forfeit on 3 sixes
  autoMoveSingle: boolean; // Auto-move when only 1 legal move
}

export interface UserProfile {
  name: string;
  avatar: string;
  country: string;
  coins: number;
  gems: number;
  level: number;
  gamesPlayed: number;
  gamesWon: number;
}

export interface MoveOption {
  tokenId: number;
  token: Token;
  currentStep: number;
  targetStep: number;
  targetCoords: { r: number; c: number };
  willCapture: boolean;
  willReachHome: boolean;
  willBeSafe: boolean;
}

export interface GameState {
  mode: GameMode;
  players: Player[];
  activePlayerIndex: number;
  diceValue: number | null;
  isRolling: boolean;
  canRoll: boolean;
  legalMoves: MoveOption[];
  consecutiveSixes: number;
  gameStatus: 'PLAYING' | 'PAUSED' | 'FINISHED';
  winners: Player[];
  statusMessage: string;
  turnCount: number;
}
