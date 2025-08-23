import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  sound: boolean;
}

interface AppState {
  isLoading: boolean;
  isInitialized: boolean;
  settings: AppSettings;
}

interface GlobalStateContextType extends AppState {
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  setLoading: (loading: boolean) => void;
  initializeApp: () => Promise<void>;
  clearAllState: () => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

interface GlobalStateProviderProps {
  children: ReactNode;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'en',
  notifications: true,
  sound: true,
};

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>({
    isLoading: true,
    isInitialized: false,
    settings: defaultSettings,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('app_settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setAppState(prev => ({
            ...prev,
            settings: { ...defaultSettings, ...parsedSettings }
          }));
        }
      } catch (error) {
        console.error('Failed to load app settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('app_settings', JSON.stringify(appState.settings));
    } catch (error) {
      console.error('Failed to save app settings:', error);
    }
  }, [appState.settings]);

  // Apply theme setting
  useEffect(() => {
    const applyTheme = () => {
      const { theme } = appState.settings;
      const root = document.documentElement;

      // Remove existing theme classes
      root.classList.remove('light', 'dark');

      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme();
  }, [appState.settings.theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (appState.settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = () => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [appState.settings.theme]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setAppState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const resetSettings = () => {
    setAppState(prev => ({
      ...prev,
      settings: defaultSettings
    }));
  };

  const setLoading = (loading: boolean) => {
    setAppState(prev => ({ ...prev, isLoading: loading }));
  };

  const initializeApp = async () => {
    try {
      // Wait for critical services to initialize
      // This could include API health checks, etc.
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAppState(prev => ({
        ...prev,
        isInitialized: true,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setAppState(prev => ({
        ...prev,
        isInitialized: false,
        isLoading: false
      }));
    }
  };

  const clearAllState = () => {
    // Reset app state to initial values
    setAppState({
      isLoading: false,
      isInitialized: false,
      settings: defaultSettings,
    });

    // Clear any app-related data from localStorage
    try {
      localStorage.removeItem('app_settings');
    } catch (error) {
      console.error('Failed to clear app settings from localStorage:', error);
    }
  };

  // Initialize app on component mount
  useEffect(() => {
    initializeApp();
  }, []);

  const value: GlobalStateContextType = {
    ...appState,
    updateSettings,
    resetSettings,
    setLoading,
    initializeApp,
    clearAllState,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};