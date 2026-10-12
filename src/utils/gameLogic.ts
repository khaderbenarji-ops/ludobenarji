import { MoveOption, Player, PlayerColor, Token } from '../types/ludo';
import {
  BASE_TOKEN_COORDS,
  COLOR_START_INDEX,
  HOME_CENTER_COORDS,
  HOME_STRAIGHTS,
  SAFE_TRACK_INDICES,
  TRACK_COORDINATES,
} from './ludoConstants';

/**
 * Returns grid coordinates (r, c) for a token at a given step
 */
export function getCoordinatesForStep(
  color: PlayerColor,
  tokenId: number,
  step: number
): { r: number; c: number } {
  if (step === -1) {
    return BASE_TOKEN_COORDS[color][tokenId];
  }
  if (step >= 0 && step <= 50) {
    const trackIndex = (COLOR_START_INDEX[color] + step) % 52;
    return TRACK_COORDINATES[trackIndex];
  }
  if (step >= 51 && step <= 55) {
    const homeIndex = step - 51;
    return HOME_STRAIGHTS[color][homeIndex];
  }
  // Step 56: Home center
  return HOME_CENTER_COORDS[color];
}

/**
 * Checks if a given step for a color is on a safe square
 */
export function isStepSafe(color: PlayerColor, step: number): boolean {
  if (step === -1) return true;
  if (step >= 51) return true; // Home path & home are safe
  const trackIndex = (COLOR_START_INDEX[color] + step) % 52;
  return SAFE_TRACK_INDICES.includes(trackIndex);
}

/**
 * Calculates all legal move options for the active player given a rolled dice value
 */
export function calculateLegalMoves(
  activePlayer: Player,
  allPlayers: Player[],
  diceValue: number
): MoveOption[] {
  const options: MoveOption[] = [];

  for (const token of activePlayer.tokens) {
    // If token already in home, cannot move
    if (token.step === 56 || token.isHome) continue;

    // Token inside base: needs a 6 to move to starting track square (step 0)
    if (token.step === -1) {
      if (diceValue === 6) {
        const targetCoords = getCoordinatesForStep(token.color, token.id, 0);
        // Start square is safe, so no capture happens
        options.push({
          tokenId: token.id,
          token,
          currentStep: -1,
          targetStep: 0,
          targetCoords,
          willCapture: false,
          willReachHome: false,
          willBeSafe: true,
        });
      }
      continue;
    }

    // Token already on track or home straight
    const targetStep = token.step + diceValue;

    // Exact count required to reach step 56 (Home)
    if (targetStep > 56) {
      continue; // Overshoot, move is illegal
    }

    const targetCoords = getCoordinatesForStep(token.color, token.id, targetStep);
    const willReachHome = targetStep === 56;
    const willBeSafe = isStepSafe(token.color, targetStep);

    // Check if target square has opponent tokens that can be captured
    let willCapture = false;
    if (!willBeSafe && targetStep <= 50) {
      for (const opponent of allPlayers) {
        if (opponent.id === activePlayer.id) continue;
        for (const oppToken of opponent.tokens) {
          if (oppToken.step >= 0 && oppToken.step <= 50) {
            const oppCoords = getCoordinatesForStep(oppToken.color, oppToken.id, oppToken.step);
            if (oppCoords.r === targetCoords.r && oppCoords.c === targetCoords.c) {
              willCapture = true;
              break;
            }
          }
        }
        if (willCapture) break;
      }
    }

    options.push({
      tokenId: token.id,
      token,
      currentStep: token.step,
      targetStep,
      targetCoords,
      willCapture,
      willReachHome,
      willBeSafe,
    });
  }

  return options;
}

/**
 * Finds all opponent tokens at the target coordinates that will be captured
 */
export function findCapturedOpponentTokens(
  targetCoords: { r: number; c: number },
  activePlayerId: string,
  allPlayers: Player[],
  targetStep: number,
  activeColor: PlayerColor
): { playerId: string; tokenId: number }[] {
  // Safe squares and home straight cannot have captures
  if (isStepSafe(activeColor, targetStep) || targetStep > 50) {
    return [];
  }

  const captured: { playerId: string; tokenId: number }[] = [];

  for (const player of allPlayers) {
    if (player.id === activePlayerId) continue;
    for (const token of player.tokens) {
      if (token.step >= 0 && token.step <= 50) {
        const coords = getCoordinatesForStep(token.color, token.id, token.step);
        if (coords.r === targetCoords.r && coords.c === targetCoords.c) {
          captured.push({ playerId: player.id, tokenId: token.id });
        }
      }
    }
  }

  return captured;
}

/**
 * Initializes players for a game based on mode and player count
 */
export function createInitialPlayers(
  mode: 'vs-computer' | 'pass-n-play' | 'quick-play' | 'team-up',
  playerCount: 2 | 3 | 4,
  userProfile: { name: string; avatar: string; country: string }
): Player[] {
  const allColors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
  
  // Choose colors based on player count
  let selectedColors: PlayerColor[] = [];
  if (playerCount === 2) {
    // Classic 2-player opposing colors: Red and Yellow
    selectedColors = ['red', 'yellow'];
  } else if (playerCount === 3) {
    selectedColors = ['red', 'green', 'yellow'];
  } else {
    selectedColors = ['red', 'green', 'yellow', 'blue'];
  }

  const botNames = ['AlphaBot', 'DiceMaster', 'LudoRani', 'SultanRoll'];
  const botAvatars = ['robot', 'wizard', 'ninja', 'fire-dragon'];
  const botCountries = ['US', 'IN', 'GB', 'AE'];

  return selectedColors.map((color, index) => {
    const isHuman = mode === 'pass-n-play' || (index === 0);
    const name = index === 0 ? (userProfile.name || 'You') : (isHuman ? `Player ${index + 1}` : botNames[index % botNames.length]);
    const avatar = index === 0 ? userProfile.avatar : (isHuman ? 'cool-shades' : botAvatars[index % botAvatars.length]);
    const country = index === 0 ? userProfile.country : botCountries[index % botCountries.length];

    const tokens: Token[] = [0, 1, 2, 3].map(id => ({
      id,
      color,
      step: -1,
      position: BASE_TOKEN_COORDS[color][id],
      isHome: false,
      isSafe: true,
    }));

    return {
      id: `p-${color}-${index}`,
      name,
      color,
      type: isHuman ? 'human' : 'computer',
      avatar,
      country,
      tokens,
      tokensFinished: 0,
    };
  });
}

/**
 * Checks if a player has finished all 4 tokens
 */
export function isPlayerFinished(player: Player): boolean {
  return player.tokens.every(t => t.step === 56 || t.isHome);
}

/**
 * Determines the next active player index, skipping players who have finished
 */
export function getNextPlayerIndex(
  currentIndex: number,
  players: Player[]
): number {
  let nextIndex = (currentIndex + 1) % players.length;
  let attempts = 0;
  
  while (isPlayerFinished(players[nextIndex]) && attempts < players.length) {
    nextIndex = (nextIndex + 1) % players.length;
    attempts++;
  }

  return nextIndex;
}
