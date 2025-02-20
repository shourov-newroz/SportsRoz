import { theme as antTheme } from 'antd';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { applyTheme, darkTheme, lightTheme } from '../config/theme';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  algorithm: (typeof antTheme.defaultAlgorithm)[];
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  algorithm: [antTheme.defaultAlgorithm],
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const theme = isDark ? darkTheme : lightTheme;
    applyTheme(theme);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const algorithm = isDark ? [antTheme.darkAlgorithm] : [antTheme.defaultAlgorithm];

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, algorithm }}>
      {children}
    </ThemeContext.Provider>
  );
};
