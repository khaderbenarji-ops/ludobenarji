import React, { useState } from 'react';
import { GameMode, GameSettings, UserProfile } from './types/ludo';
import {
  loadProfile,
  loadSettings,
  saveProfile,
  saveSettings,
} from './utils/storage';
import { sounds } from './utils/audio';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { ProfileModal } from './components/ProfileModal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [view, setView] = useState<'HOME' | 'GAME'>('HOME');
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [activeMode, setActiveMode] = useState<GameMode>('vs-computer');
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(2);

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    handleUpdateSettings(updated);
  };

  const handleStartGame = (mode: GameMode, count: 2 | 3 | 4) => {
    setActiveMode(mode);
    setPlayerCount(count);
    setView('GAME');
  };

  const handleBackToHome = () => {
    setView('HOME');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 font-sans selection:bg-amber-400 selection:text-slate-950">
      {view === 'HOME' ? (
        <HomeScreen
          userProfile={profile}
          settings={settings}
          onStartGame={handleStartGame}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
          onUpdateProfile={handleUpdateProfile}
          onToggleSound={handleToggleSound}
        />
      ) : (
        <GameScreen
          mode={activeMode}
          playerCount={playerCount}
          userProfile={profile}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onUpdateProfile={handleUpdateProfile}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* Global Modals */}
      <ProfileModal
        profile={profile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={handleUpdateProfile}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
