import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameMode, GameSettings, MoveOption, Player, PlayerColor, Token, UserProfile } from '../types/ludo';
import {
  calculateLegalMoves,
  createInitialPlayers,
  findCapturedOpponentTokens,
  getCoordinatesForStep,
  getNextPlayerIndex,
  isPlayerFinished,
  isStepSafe,
} from '../utils/gameLogic';
import { chooseBestMove } from '../utils/computerAI';
import { sounds } from '../utils/audio';
import { COLOR_CONFIG } from '../utils/ludoConstants';
import { LudoBoard } from './LudoBoard';
import { Dice } from './Dice';
import { PlayerCorner } from './PlayerCorner';
import { WinnerModal } from './WinnerModal';
import { RulesModal } from './RulesModal';
import { SettingsModal } from './SettingsModal';
import { Pause, Play, RotateCcw, Home, Volume2, VolumeX, HelpCircle, Sparkles } from 'lucide-react';

interface GameScreenProps {
  mode: GameMode;
  playerCount: 2 | 3 | 4;
  userProfile: UserProfile;
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onBackToHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  playerCount,
  userProfile,
  settings,
  onUpdateSettings,
  onUpdateProfile,
  onBackToHome,
}) => {
  const [players, setPlayers] = useState<Player[]>(() =>
    createInitialPlayers(mode, playerCount, userProfile)
  );
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [canRoll, setCanRoll] = useState<boolean>(true);
  const [legalMoves, setLegalMoves] = useState<MoveOption[]>([]);
  const [consecutiveSixes, setConsecutiveSixes] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Game started! Roll the dice.');
  const [winner, setWinner] = useState<Player | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const activePlayer = players[activePlayerIndex];
  const isComputerTurn = activePlayer?.type === 'computer';
  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up bot timers on unmount
  useEffect(() => {
    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, []);

  // Check game victory condition
  const checkVictory = useCallback((currentPlayers: Player[]) => {
    for (const player of currentPlayers) {
      if (isPlayerFinished(player)) {
        setWinner(player);
        // Award user coins if human won
        if (player.type === 'human' && player.id === currentPlayers[0].id) {
          onUpdateProfile({
            ...userProfile,
            coins: userProfile.coins + 500,
            gamesWon: userProfile.gamesWon + 1,
            gamesPlayed: userProfile.gamesPlayed + 1,
          });
        } else {
          onUpdateProfile({
            ...userProfile,
            gamesPlayed: userProfile.gamesPlayed + 1,
          });
        }
        return true;
      }
    }
    return false;
  }, [userProfile, onUpdateProfile]);

  // Advance turn to next player
  const advanceTurn = useCallback((currentPlayers: Player[], nextIdx?: number) => {
    const nextPlayerIndex = nextIdx !== undefined ? nextIdx : getNextPlayerIndex(activePlayerIndex, currentPlayers);
    setActivePlayerIndex(nextPlayerIndex);
    setDiceValue(null);
    setLegalMoves([]);
    setCanRoll(true);
    setConsecutiveSixes(0);
    const nextPlayer = currentPlayers[nextPlayerIndex];
    setStatusMessage(
      nextPlayer.type === 'human' ? `${nextPlayer.name}'s turn! Roll dice.` : `${nextPlayer.name} is thinking...`
    );
  }, [activePlayerIndex]);

  // Execute a chosen legal move
  const executeMove = useCallback((move: MoveOption) => {
    setLegalMoves([]);
    setCanRoll(false);

    sounds.playTokenMove();

    // 1. Move the chosen token
    let willGrantBonusTurn = diceValue === 6;
    let captureOccurred = false;

    setPlayers((prevPlayers) => {
      let updated = prevPlayers.map((p) => {
        if (p.id !== activePlayer.id) return p;
        const updatedTokens = p.tokens.map((t) => {
          if (t.id === move.tokenId) {
            return {
              ...t,
              step: move.targetStep,
              position: move.targetCoords,
              isHome: move.willReachHome,
              isSafe: move.willBeSafe,
            };
          }
          return t;
        });

        const finished = updatedTokens.filter((t) => t.isHome || t.step === 56).length;
        return {
          ...p,
          tokens: updatedTokens,
          tokensFinished: finished,
        };
      });

      // 2. Check for captures of opponent tokens
      const capturedTokens = findCapturedOpponentTokens(
        move.targetCoords,
        activePlayer.id,
        updated,
        move.targetStep,
        activePlayer.color
      );

      if (capturedTokens.length > 0) {
        captureOccurred = true;
        willGrantBonusTurn = true; // Capturing grants bonus roll!
        sounds.playTokenCapture();

        // Send captured tokens back to their base (-1)
        updated = updated.map((p) => {
          const matchingCaptures = capturedTokens.filter((c) => c.playerId === p.id);
          if (matchingCaptures.length === 0) return p;

          const updatedTokens = p.tokens.map((t) => {
            if (matchingCaptures.some((c) => c.tokenId === t.id)) {
              return {
                ...t,
                step: -1,
                position: getCoordinatesForStep(t.color, t.id, -1),
                isSafe: true,
              };
            }
            return t;
          });
          return { ...p, tokens: updatedTokens };
        });

        setStatusMessage(`Boom! ${activePlayer.name} captured opponent token! +1 Bonus Turn!`);
      } else if (move.willReachHome) {
        sounds.playTokenHome();
        willGrantBonusTurn = true; // Reaching home grants bonus roll!
        setStatusMessage(`Hooray! ${activePlayer.name} reached Home! +1 Bonus Turn!`);
      } else if (move.willBeSafe && move.targetStep > 0) {
        sounds.playSafeZone();
      }

      // 3. Check for game win
      const hasWinner = checkVictory(updated);
      if (hasWinner) return updated;

      // 4. Handle next turn or bonus turn
      const delay = settings.fastPlay ? 300 : 600;
      setTimeout(() => {
        if (willGrantBonusTurn) {
          setDiceValue(null);
          setCanRoll(true);
          if (!captureOccurred && !move.willReachHome && diceValue === 6) {
            setStatusMessage(`${activePlayer.name} rolled a 6! Roll again.`);
          }
        } else {
          advanceTurn(updated);
        }
      }, delay);

      return updated;
    });
  }, [activePlayer, diceValue, settings.fastPlay, checkVictory, advanceTurn]);

  // Roll the dice
  const handleRollDice = useCallback(() => {
    if (!canRoll || isRolling || isPaused || winner) return;

    sounds.playDiceRoll();
    setIsRolling(true);
    setCanRoll(false);
    setLegalMoves([]);

    const rollDuration = settings.fastPlay ? 250 : 500;

    setTimeout(() => {
      // Deterministic random dice 1 to 6
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(roll);
      setIsRolling(false);

      if (roll === 6) {
        sounds.playSixRoll();
      }

      // Check 3 consecutive sixes penalty
      const newConsecutiveSixes = roll === 6 ? consecutiveSixes + 1 : 0;
      setConsecutiveSixes(newConsecutiveSixes);

      if (settings.threeSixesPenalty && newConsecutiveSixes === 3) {
        setStatusMessage(`${activePlayer.name} rolled three 6s in a row! Turn forfeited.`);
        setTimeout(() => {
          advanceTurn(players);
        }, 1200);
        return;
      }

      // Calculate legal moves
      const moves = calculateLegalMoves(activePlayer, players, roll);
      setLegalMoves(moves);

      if (moves.length === 0) {
        setStatusMessage(`No legal moves for ${activePlayer.name} with roll ${roll}.`);
        const waitDelay = settings.fastPlay ? 500 : 900;
        setTimeout(() => {
          advanceTurn(players);
        }, waitDelay);
      } else if (moves.length === 1 && settings.autoMoveSingle && activePlayer.type === 'human') {
        setStatusMessage(`${activePlayer.name} moving piece automatically.`);
        setTimeout(() => {
          executeMove(moves[0]);
        }, 400);
      } else {
        setStatusMessage(
          activePlayer.type === 'human'
            ? `Choose a highlighted token to move ${roll} steps.`
            : `${activePlayer.name} is making a move...`
        );
      }
    }, rollDuration);
  }, [canRoll, isRolling, isPaused, winner, settings, consecutiveSixes, activePlayer, players, advanceTurn, executeMove]);

  // Computer AI Turn Controller
  useEffect(() => {
    if (isPaused || winner) return;

    if (isComputerTurn && canRoll && !isRolling) {
      const thinkTime = settings.fastPlay ? 400 : 900;
      botTimerRef.current = setTimeout(() => {
        handleRollDice();
      }, thinkTime);
    } else if (isComputerTurn && !canRoll && !isRolling && legalMoves.length > 0) {
      const moveTime = settings.fastPlay ? 400 : 800;
      botTimerRef.current = setTimeout(() => {
        const bestMove = chooseBestMove(legalMoves, activePlayer, players);
        executeMove(bestMove);
      }, moveTime);
    }

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [isComputerTurn, canRoll, isRolling, legalMoves, isPaused, winner, settings.fastPlay, activePlayer, players, handleRollDice, executeMove]);

  // Restart match
  const handleRestart = () => {
    sounds.playClick();
    setPlayers(createInitialPlayers(mode, playerCount, userProfile));
    setActivePlayerIndex(0);
    setDiceValue(null);
    setIsRolling(false);
    setCanRoll(true);
    setLegalMoves([]);
    setConsecutiveSixes(0);
    setWinner(null);
    setIsPaused(false);
    setStatusMessage('Game restarted! Roll dice.');
  };

  const currentColorConfig = COLOR_CONFIG[activePlayer.color];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Top Header Controls Bar */}
      <header className="w-full max-w-5xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between z-20">
        {/* Left: Mode Badge & Home */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              onBackToHome();
            }}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition"
            title="Lobby"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-900/60 border border-blue-700/80 text-blue-200">
            {mode === 'vs-computer' ? 'Vs Computer' : mode === 'pass-n-play' ? 'Pass & Play' : 'Quick Match'}
          </span>
        </div>

        {/* Center: Live Banner / Announcer */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-slate-200 truncate max-w-xs">
            {statusMessage}
          </span>
        </div>

        {/* Right: Sound, Rules, Pause */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const updated = { ...settings, soundEnabled: !settings.soundEnabled };
              onUpdateSettings(updated);
            }}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition"
            title={settings.soundEnabled ? 'Mute' : 'Unmute'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
            )}
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setShowRules(true);
            }}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition"
            title="Rules"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setIsPaused(!isPaused);
            }}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </header>

      {/* Main Board Arena */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-3 sm:px-4 py-1 sm:py-2 flex flex-col items-center justify-center">
        {/* Top Players Row */}
        <div className="w-full flex items-center justify-between mb-2 max-w-[500px] sm:max-w-[540px] md:max-w-[580px]">
          {players[0] && (
            <PlayerCorner
              player={players[0]}
              isActive={activePlayerIndex === 0}
              position="top-left"
            />
          )}
          {players[1] && (
            <PlayerCorner
              player={players[1]}
              isActive={activePlayerIndex === 1}
              position="top-right"
            />
          )}
        </div>

        {/* 15x15 Ludo Board */}
        <LudoBoard
          players={players}
          activeColor={activePlayer.color}
          legalMoves={legalMoves}
          onSelectToken={(tok) => {
            const move = legalMoves.find((m) => m.tokenId === tok.id && m.token.color === tok.color);
            if (move) executeMove(move);
          }}
          interactive={!isComputerTurn && !isPaused && !winner}
        />

        {/* Bottom Players Row (if 3 or 4 players) */}
        <div className="w-full flex items-center justify-between mt-2 max-w-[500px] sm:max-w-[540px] md:max-w-[580px]">
          {players[3] ? (
            <PlayerCorner
              player={players[3]}
              isActive={activePlayerIndex === 3}
              position="bottom-left"
            />
          ) : (
            <div />
          )}
          {players[2] && (
            <PlayerCorner
              player={players[2]}
              isActive={activePlayerIndex === 2}
              position="bottom-right"
            />
          )}
        </div>
      </main>

      {/* Bottom Dashboard / Action Bar (Screenshot 1 style!) */}
      <footer className="w-full max-w-lg mx-auto px-4 pb-3 sm:pb-5 pt-1 z-20">
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-900/90 via-slate-900/95 to-blue-900/90 border-2 border-amber-400/80 shadow-2xl p-2.5 sm:p-3 flex items-center justify-between">
          {/* Active Player Tag */}
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-white shadow animate-pulse"
              style={{ backgroundColor: currentColorConfig.primary }}
            />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-white leading-tight">
                {activePlayer.name}
              </span>
              <span className="text-[10px] text-amber-300 font-semibold">
                {isComputerTurn ? 'Thinking...' : canRoll ? 'Tap Dice!' : 'Select Token'}
              </span>
            </div>
          </div>

          {/* Interactive Dice Dock */}
          <div className="relative -mt-6 sm:-mt-8">
            <Dice
              value={diceValue}
              isRolling={isRolling}
              canRoll={canRoll && !isComputerTurn && !isPaused}
              activeColor={activePlayer.color}
              onRoll={handleRollDice}
              size="large"
            />
          </div>

          {/* Turn status indicator badge */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
            <span className="text-xs font-bold text-amber-400 font-mono">
              {consecutiveSixes > 0 ? `${consecutiveSixes}x SIX!` : `Turn #${activePlayerIndex + 1}`}
            </span>
          </div>
        </div>

        {/* Mobile Status Toast */}
        <div className="sm:hidden text-center mt-2">
          <span className="text-[11px] font-semibold text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            {statusMessage}
          </span>
        </div>
      </footer>

      {/* Pause Menu Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 text-center shadow-2xl space-y-3">
            <h3 className="text-xl font-black text-amber-300 uppercase tracking-wide">
              Game Paused
            </h3>
            <button
              onClick={() => {
                sounds.playClick();
                setIsPaused(false);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4" /> Resume
            </button>
            <button
              onClick={handleRestart}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Restart Match
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onBackToHome();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" /> Main Menu
            </button>
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {winner && (
        <WinnerModal
          winner={winner}
          allPlayers={players}
          onPlayAgain={handleRestart}
          onHome={onBackToHome}
        />
      )}

      {/* Rules Modal */}
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />

      {/* Settings Modal */}
      <SettingsModal
        settings={settings}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onUpdateSettings={onUpdateSettings}
      />
    </div>
  );
};
