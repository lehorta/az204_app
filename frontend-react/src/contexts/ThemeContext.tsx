import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Recupera tema do localStorage ou usa 'dark' como padrão
    const saved = localStorage.getItem('gym-theme') as Theme | null;
    return saved || 'dark';
  });

  // Salva tema no localStorage e aplica ao documento
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('gym-theme', newTheme);
    
    // Aplica classe ao elemento raiz para temas CSS
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', newTheme);
    htmlElement.classList.toggle('dark', newTheme === 'dark');
    htmlElement.classList.toggle('light', newTheme === 'light');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Aplica tema ao montar
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', theme);
    htmlElement.classList.toggle('dark', theme === 'dark');
    htmlElement.classList.toggle('light', theme === 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};
