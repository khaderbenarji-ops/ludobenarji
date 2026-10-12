import { PlayerColor } from '../types/ludo';

export interface GridCoord {
  r: number;
  c: number;
}

// 52 Outer Track Coordinates in Clockwise Order starting from Red's start square (row 6, col 1)
export const TRACK_COORDINATES: GridCoord[] = [
  // 0..4: Red exit arm moving right
  { r: 6, c: 1 },  // 0: Red Start (Safe)
  { r: 6, c: 2 },  // 1
  { r: 6, c: 3 },  // 2
  { r: 6, c: 4 },  // 3
  { r: 6, c: 5 },  // 4
  // 5..10: Top arm moving up
  { r: 5, c: 6 },  // 5
  { r: 4, c: 6 },  // 6
  { r: 3, c: 6 },  // 7
  { r: 2, c: 6 },  // 8: Safe Star
  { r: 1, c: 6 },  // 9
  { r: 0, c: 6 },  // 10
  // 11..12: Top turn
  { r: 0, c: 7 },  // 11
  { r: 0, c: 8 },  // 12
  // 13..17: Top arm moving down (Green)
  { r: 1, c: 8 },  // 13: Green Start (Safe)
  { r: 2, c: 8 },  // 14
  { r: 3, c: 8 },  // 15
  { r: 4, c: 8 },  // 16
  { r: 5, c: 8 },  // 17
  // 18..23: Right arm moving right
  { r: 6, c: 9 },  // 18
  { r: 6, c: 10 }, // 19
  { r: 6, c: 11 }, // 20
  { r: 6, c: 12 }, // 21: Safe Star
  { r: 6, c: 13 }, // 22
  { r: 6, c: 14 }, // 23
  // 24..25: Right turn
  { r: 7, c: 14 }, // 24
  { r: 8, c: 14 }, // 25
  // 26..30: Right arm moving left (Yellow)
  { r: 8, c: 13 }, // 26: Yellow Start (Safe)
  { r: 8, c: 12 }, // 27
  { r: 8, c: 11 }, // 28
  { r: 8, c: 10 }, // 29
  { r: 8, c: 9 },  // 30
  // 31..36: Bottom arm moving down
  { r: 9, c: 8 },  // 31
  { r: 10, c: 8 }, // 32
  { r: 11, c: 8 }, // 33
  { r: 12, c: 8 }, // 34: Safe Star
  { r: 13, c: 8 }, // 35
  { r: 14, c: 8 }, // 36
  // 37..38: Bottom turn
  { r: 14, c: 7 }, // 37
  { r: 14, c: 6 }, // 38
  // 39..43: Bottom arm moving up (Blue)
  { r: 13, c: 6 }, // 39: Blue Start (Safe)
  { r: 12, c: 6 }, // 40
  { r: 11, c: 6 }, // 41
  { r: 10, c: 6 }, // 42
  { r: 9, c: 6 },  // 43
  // 44..49: Left arm moving left
  { r: 8, c: 5 },  // 44
  { r: 8, c: 4 },  // 45
  { r: 8, c: 3 },  // 46
  { r: 8, c: 2 },  // 47: Safe Star
  { r: 8, c: 1 },  // 48
  { r: 8, c: 0 },  // 49
  // 50..51: Left turn back to Red
  { r: 7, c: 0 },  // 50
  { r: 6, c: 0 }   // 51
];

// Starting track index for each color
export const COLOR_START_INDEX: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Outer track safe square indices
export const SAFE_TRACK_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

// Star indices (safe squares with visual stars)
export const STAR_TRACK_INDICES = [8, 21, 34, 47];

// Home straight coordinates (5 steps for each color, step 51..55)
export const HOME_STRAIGHTS: Record<PlayerColor, GridCoord[]> = {
  red: [
    { r: 7, c: 1 },
    { r: 7, c: 2 },
    { r: 7, c: 3 },
    { r: 7, c: 4 },
    { r: 7, c: 5 }
  ],
  green: [
    { r: 1, c: 7 },
    { r: 2, c: 7 },
    { r: 3, c: 7 },
    { r: 4, c: 7 },
    { r: 5, c: 7 }
  ],
  yellow: [
    { r: 7, c: 13 },
    { r: 7, c: 12 },
    { r: 7, c: 11 },
    { r: 7, c: 10 },
    { r: 7, c: 9 }
  ],
  blue: [
    { r: 13, c: 7 },
    { r: 12, c: 7 },
    { r: 11, c: 7 },
    { r: 10, c: 7 },
    { r: 9, c: 7 }
  ]
};

// Home center triangle coordinates (step 56)
export const HOME_CENTER_COORDS: Record<PlayerColor, GridCoord> = {
  red: { r: 7, c: 6 },
  green: { r: 6, c: 7 },
  yellow: { r: 7, c: 8 },
  blue: { r: 8, c: 7 }
};

// Base positions for 4 tokens in each player's home yard
export const BASE_TOKEN_COORDS: Record<PlayerColor, GridCoord[]> = {
  red: [
    { r: 1.8, c: 1.8 },
    { r: 1.8, c: 3.8 },
    { r: 3.8, c: 1.8 },
    { r: 3.8, c: 3.8 }
  ],
  green: [
    { r: 1.8, c: 10.8 },
    { r: 1.8, c: 12.8 },
    { r: 3.8, c: 10.8 },
    { r: 3.8, c: 12.8 }
  ],
  yellow: [
    { r: 10.8, c: 10.8 },
    { r: 10.8, c: 12.8 },
    { r: 12.8, c: 10.8 },
    { r: 12.8, c: 12.8 }
  ],
  blue: [
    { r: 10.8, c: 1.8 },
    { r: 10.8, c: 3.8 },
    { r: 12.8, c: 1.8 },
    { r: 12.8, c: 3.8 }
  ]
};

// Visual styling constants for each player color
export const COLOR_CONFIG = {
  red: {
    name: 'Red',
    primary: '#E11D48',
    secondary: '#BE123C',
    light: '#FFE4E6',
    border: '#9F1239',
    gradient: 'from-rose-500 to-rose-700',
    ring: 'ring-rose-500',
    glow: 'rgba(225, 29, 72, 0.4)',
    text: 'text-rose-600',
    bg: 'bg-rose-500',
  },
  green: {
    name: 'Green',
    primary: '#16A34A',
    secondary: '#15803D',
    light: '#DCFCE7',
    border: '#166534',
    gradient: 'from-emerald-500 to-emerald-700',
    ring: 'ring-emerald-500',
    glow: 'rgba(22, 163, 74, 0.4)',
    text: 'text-emerald-600',
    bg: 'bg-emerald-500',
  },
  yellow: {
    name: 'Yellow',
    primary: '#EAB308',
    secondary: '#CA8A04',
    light: '#FEF9C3',
    border: '#A16207',
    gradient: 'from-amber-400 to-amber-600',
    ring: 'ring-amber-400',
    glow: 'rgba(234, 179, 8, 0.4)',
    text: 'text-amber-600',
    bg: 'bg-amber-400',
  },
  blue: {
    name: 'Blue',
    primary: '#2563EB',
    secondary: '#1D4ED8',
    light: '#DBEAFE',
    border: '#1E40AF',
    gradient: 'from-blue-500 to-blue-700',
    ring: 'ring-blue-500',
    glow: 'rgba(37, 99, 235, 0.4)',
    text: 'text-blue-600',
    bg: 'bg-blue-500',
  }
};

export const AVATAR_OPTIONS = [
  { id: 'king-crown', name: 'Royale King', emoji: '👑', bg: 'bg-amber-500' },
  { id: 'cool-shades', name: 'Bay Major', emoji: '😎', bg: 'bg-rose-600' },
  { id: 'pro-gamer', name: 'Mastermind', emoji: '🧢', bg: 'bg-blue-600' },
  { id: 'queen-crown', name: 'Ludo Queen', emoji: '👸', bg: 'bg-purple-600' },
  { id: 'wizard', name: 'Dice Wizard', emoji: '🧙‍♂️', bg: 'bg-indigo-600' },
  { id: 'ninja', name: 'Stealth Pawn', emoji: '🥷', bg: 'bg-slate-800' },
  { id: 'fire-dragon', name: 'Dragon Master', emoji: '🐲', bg: 'bg-red-600' },
  { id: 'tiger', name: 'Royal Tiger', emoji: '🐯', bg: 'bg-orange-500' },
  { id: 'lion', name: 'Pride King', emoji: '🦁', bg: 'bg-yellow-600' },
  { id: 'astro', name: 'Cosmic Roll', emoji: '👨‍🚀', bg: 'bg-cyan-600' },
  { id: 'pirate', name: 'Captain Dice', emoji: '🏴‍☠️', bg: 'bg-emerald-700' },
  { id: 'detective', name: 'Strategist', emoji: '🕵️', bg: 'bg-stone-700' },
  { id: 'vampire', name: 'Night Lord', emoji: '🧛', bg: 'bg-zinc-800' },
  { id: 'superhero', name: 'Champion', emoji: '🦸', bg: 'bg-teal-600' },
  { id: 'robot', name: 'AI Engine', emoji: '🤖', bg: 'bg-sky-600' },
  { id: 'dj', name: 'Beat Master', emoji: '🎧', bg: 'bg-fuchsia-600' },
  { id: 'fox', name: 'Clever Fox', emoji: '🦊', bg: 'bg-amber-600' },
  { id: 'phoenix', name: 'Flame Wing', emoji: '🦅', bg: 'bg-amber-700' },
  { id: 'diamond', name: 'High Roller', emoji: '💎', bg: 'bg-blue-500' },
  { id: 'star', name: 'Lucky Star', emoji: '⭐', bg: 'bg-yellow-500' }
];

export const COUNTRY_LIST = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' }
];
