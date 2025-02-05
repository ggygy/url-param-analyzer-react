import { useState, useEffect } from 'react';
import { storageSettings } from '../utils/storage';

export const useHoverSetting = () => {
    const [isHoverEnabled, setIsHoverEnabled] = useState(storageSettings.getHoverEnabled());

    useEffect(() => {
        const handleStorageChange = () => {
            setIsHoverEnabled(storageSettings.getHoverEnabled());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const toggleHoverEnabled = (enabled: boolean) => {
        setIsHoverEnabled(enabled);
        storageSettings.setHoverEnabled(enabled);
    };

    return { isHoverEnabled, toggleHoverEnabled };
};
