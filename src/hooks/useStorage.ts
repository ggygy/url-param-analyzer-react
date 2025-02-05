import { useState, useEffect } from 'react';
import { storageSettings } from '../utils/storage';

export const useStorage = () => {
  const [isEnabled, setIsEnabled] = useState(storageSettings.getStorageEnabled());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsEnabled(storageSettings.getStorageEnabled());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleStorageEnabled = (enabled: boolean) => {
    setIsEnabled(enabled);
    storageSettings.setStorageEnabled(enabled);
  };

  return {
    isStorageEnabled: isEnabled,
    setStorageEnabled: toggleStorageEnabled
  };
};