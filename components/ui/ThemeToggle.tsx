'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed top-4 right-4 z-[60] w-[52px] h-[52px]" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-[60] p-3 glass rounded-full hover:bg-white/20 transition-all duration-300 group shadow-lg"
      aria-label="Toggle theme"
      type="button"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-90 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600 group-hover:-rotate-90 transition-transform duration-300" />
      )}
    </button>
  );
}
