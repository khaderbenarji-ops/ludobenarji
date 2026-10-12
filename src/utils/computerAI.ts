import { MoveOption, Player } from '../types/ludo';
import { getCoordinatesForStep, isStepSafe } from './gameLogic';

/**
 * Selects the best move for a computer player according to strategic heuristics:
 * 1. Capturing an opponent token (+1000)
 * 2. Finishing a token into Home (+600)
 * 3. Moving a token out of the base on rolling a 6 (+350)
 * 4. Escaping a vulnerable position where an enemy is within 1-6 spaces behind (+250)
 * 5. Entering the home straight (safe zone) (+200)
 * 6. Landing on a star or start square (+180)
 * 7. Advancing tokens closer to home (+1 * step value)
 * 8. Penalty if target square leaves token vulnerable to capture within 1-6 steps (-150)
 */
export function chooseBestMove(
  options: MoveOption[],
  activePlayer: Player,
  allPlayers: Player[]
): MoveOption {
  if (options.length === 1) {
    return options[0];
  }

  let bestMove = options[0];
  let highestScore = -Infinity;

  for (const move of options) {
    let score = 0;

    // 1. Prioritize capturing opponent tokens
    if (move.willCapture) {
      score += 1000;
    }

    // 2. Prioritize finishing into Home
    if (move.willReachHome) {
      score += 650;
    }

    // 3. Bring token out of base
    if (move.currentStep === -1 && move.targetStep === 0) {
      score += 350;
    }

    // 4. Moving into home straight where nobody can catch it
    if (move.currentStep <= 50 && move.targetStep >= 51) {
      score += 250;
    }

    // 5. Landing on a safe square
    if (move.willBeSafe && move.targetStep > 0) {
      score += 180;
    }

    // 6. Escaping danger: check if current token is currently threatened
    if (move.currentStep >= 0 && move.currentStep <= 50 && !isStepSafe(activePlayer.color, move.currentStep)) {
      const isCurrentlyThreatened = checkIsThreatened(
        move.token.position,
        activePlayer.id,
        allPlayers
      );
      if (isCurrentlyThreatened) {
        score += 220; // High incentive to run away!
      }
    }

    // 7. Avoid moving into an unsafe square where an opponent can capture it
    if (!move.willBeSafe && move.targetStep <= 50) {
      const willBeThreatened = checkIsThreatened(
        move.targetCoords,
        activePlayer.id,
        allPlayers
      );
      if (willBeThreatened) {
        score -= 160;
      }
    }

    // 8. Progress reward: advancing tokens forward
    score += move.targetStep * 2;

    // Small random jitter to make bot moves feel natural and unpredictable when scores tie
    score += Math.random() * 15;

    if (score > highestScore) {
      highestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Checks if a coordinate is within 1-6 steps behind an active enemy token on the outer track
 */
function checkIsThreatened(
  coords: { r: number; c: number },
  playerId: string,
  allPlayers: Player[]
): boolean {
  for (const opponent of allPlayers) {
    if (opponent.id === playerId) continue;
    for (const token of opponent.tokens) {
      if (token.step >= 0 && token.step <= 50) {
        const tokenCoords = getCoordinatesForStep(token.color, token.id, token.step);
        // If opponent is roughly near or could reach this cell
        if (Math.abs(tokenCoords.r - coords.r) <= 6 && Math.abs(tokenCoords.c - coords.c) <= 6) {
          return true;
        }
      }
    }
  }
  return false;
}
