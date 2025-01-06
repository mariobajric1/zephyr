import { createContext, useContext, useState, useEffect } from "react";

export interface Theme {
  variant: "professional" | "tint" | "vibrant";
  primary: string;
  appearance: "light" | "dark" | "system";
  radius: number;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const defaultTheme: Theme = {
  variant: "professional",
  primary: "hsl(190 70% 50%)", 
  appearance: "dark",
  radius: 0.5,
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem("kai-theme");
      return stored ? JSON.parse(stored) : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("kai-theme", JSON.stringify(theme));
      const root = window.document.documentElement;

      // Add a class to trigger transitions
      root.classList.add('theme-transition');

      // Remove existing theme classes
      root.classList.remove('light', 'dark');

      // Add new theme class based on appearance
      if (theme.appearance === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme.appearance);
      }

      // Extract HSL values from the color string
      const hslMatch = theme.primary.match(/hsl\(([0-9.]+)\s+([0-9.]+%)\s+([0-9.]+%)\)/);
      if (hslMatch) {
        const [_, h, s, l] = hslMatch;
        // Set the primary color as space-separated HSL values
        root.style.setProperty('--primary', `${h} ${s} ${l}`);
      }

      root.style.setProperty('--radius', `${theme.radius}rem`);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (theme.appearance === 'system') {
          root.classList.remove('light', 'dark');
          root.classList.add(e.matches ? 'dark' : 'light');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);

    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Theme colors using space-separated HSL values
export const themes = {
  aqua: "hsl(190 70% 50%)", 
  emerald: "hsl(155 60% 50%)",
  purple: "hsl(270 60% 50%)",
  rose: "hsl(350 60% 50%)",
  amber: "hsl(40 60% 50%)",
} as const;