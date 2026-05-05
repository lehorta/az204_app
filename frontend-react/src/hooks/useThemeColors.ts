import { useTheme } from '../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../styles/theme';

export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme === 'dark' ? darkTheme : lightTheme;
};
