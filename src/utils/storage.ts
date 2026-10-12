import { GameSettings, UserProfile } from '../types/ludo';
import { sounds } from './audio';

const STORAGE_KEYS = {
  PROFILE: 'ludo_royale_profile',
  SETTINGS: 'ludo_royale_settings',
  DAILY_CLAIM: 'ludo_royale_daily_claim',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'BayMajor',
  avatar: 'cool-shades',
  country: 'IN',
  coins: 2250,
  gems: 50,
  level: 5,
  gamesPlayed: 14,
  gamesWon: 9,
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  fastPlay: false,
  threeSixesPenalty: true,
  autoMoveSingle: true,
};

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Failed to load profile:', err);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      sounds.setMuted(!parsed.soundEnabled);
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
  sounds.setMuted(!DEFAULT_SETTINGS.soundEnabled);
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    sounds.setMuted(!settings.soundEnabled);
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function canClaimDailyReward(): boolean {
  try {
    const lastClaim = localStorage.getItem(STORAGE_KEYS.DAILY_CLAIM);
    if (!lastClaim) return true;
    const lastTime = parseInt(lastClaim, 10);
    const now = Date.now();
    // 24 hours cooldown
    return now - lastTime >= 24 * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

export function markDailyRewardClaimed(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_CLAIM, Date.now().toString());
  } catch {
    // ignore
  }
}
