// RESPONSIBILITY: Client-side button component that allows users to toggle between dark and light themes. Hydration-safe (waits for mount before rendering correct icon).
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!mounted) {
    return (
      <button className="relative p-2 text-secondary rounded-lg border border-transparent opacity-0">
        <Sun size={19} />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative p-2 text-secondary hover:text-foreground hover:bg-input rounded-lg transition-colors border border-transparent hover:border-border"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
