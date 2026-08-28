import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, Sun, Moon, Linkedin, Github } from 'lucide-react';

interface NavbarProps {
  onResetDemo: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onResetDemo, isDarkMode, onToggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-10 py-4 flex justify-between items-center transition-all duration-300"
      style={{
        background: scrolled ? (isDarkMode ? 'rgba(12,12,18,0.88)' : 'rgba(245,245,247,0.92)') : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)' }}>
          <Bot className="w-4 h-4" style={{ color: 'var(--accent1)' }} />
        </div>
        <div>
          <span className="font-syne font-extrabold text-base tracking-tight" style={{ color: 'var(--text)' }}>
            CARGONET<span style={{ color: 'var(--accent1)' }}>.AI</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* LinkedIn Link */}
        <a
          href="https://www.linkedin.com/in/tejaswa-ghadai-198341295/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all hover:scale-105"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: '#0a66c2' }}
          title="Tejaswa Ghadai on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
          <span className="hidden sm:inline font-sans text-xs" style={{ color: 'var(--text)' }}>LinkedIn</span>
        </a>

        {/* GitHub Link */}
        <a
          href="https://github.com/tejas0017j-creator"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all hover:scale-105"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          title="Tejaswa Ghadai on GitHub"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline font-sans text-xs">GitHub</span>
        </a>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg transition-all hover:scale-105"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" style={{ color: '#fbbf24' }} /> : <Moon className="w-4 h-4" style={{ color: 'var(--accent2)' }} />}
        </button>

        {/* Reset */}
        <button
          onClick={onResetDemo}
          className="px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all hover:scale-[1.02]"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          title="Reset Simulation"
        >
          <RefreshCw className="w-3.5 h-3.5" style={{ color: 'var(--accent4)' }} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </nav>
  );
};
