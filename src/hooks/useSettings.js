import { useState, useEffect } from 'react';

const DEFAULT_SETTINGS = {
  sound: true,
  reducedMotion: false,
  highContrast: false,
  language: 'ru'
};

export const useSettings = () => {
  const [settings, setSettingsState] = useState(() => {
    const saved = localStorage.getItem('bayan_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const setSettings = (key, value) => {
    setSettingsState(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('bayan_settings', JSON.stringify(next));
      return next;
    });
  };

  return [settings, setSettings];
};
