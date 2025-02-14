import { useState, useEffect } from 'react';
import { storageSettings } from '../utils/storage';

export const useIncognitoSetting = () => {
    const [isIncognitoEnabled, setIsIncognitoEnabled] = useState(storageSettings.getIncognitoEnabled());

    useEffect(() => {
        const handleStorageChange = () => {
            setIsIncognitoEnabled(storageSettings.getIncognitoEnabled());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const toggleIncognitoEnabled = (enabled: boolean) => {
        setIsIncognitoEnabled(enabled);
        storageSettings.setIncognitoEnabled(enabled);
    };

    return { isIncognitoEnabled, toggleIncognitoEnabled };
};
