import { createContext, useContext, useEffect, useState } from 'react';
import { ChildrenType } from '../types/children-type';

interface ThemeContextType {
  darkTheme: boolean;
  setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }: ChildrenType) => {
  const [darkTheme, setDarkTheme] = useState<boolean>(localStorage.getItem('darkTheme') === 'true' || true);

  useEffect(() => {
    localStorage.setItem('darkTheme', darkTheme.toString());
  }, [darkTheme]);

  return (
    <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
      <div className={darkTheme ? 'dark' : ''}>{children}</div>
    </ThemeContext.Provider>
  );
};
