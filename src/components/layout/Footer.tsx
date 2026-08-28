import React from 'react';
import { Shield, Cpu, Linkedin, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 py-12 px-5 sm:px-10" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="font-syne text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight" style={{ color: 'var(--text)' }}>
            Autonomous Multi-Agent<br />
            <span style={{ color: 'var(--accent1)' }}>AI Evaluation Engine.</span>
          </div>
          <p className="text-sm mt-2 max-w-md font-light" style={{ color: 'var(--muted)' }}>
            Zero-hallucination candidate assessment. Verbatim evidence verification with mathematical decision synthesis.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a
              href="https://www.linkedin.com/in/tejaswa-ghadai-198341295/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:border-accent1"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              <Linkedin className="w-3.5 h-3.5" style={{ color: '#0a66c2' }} />
              <span>Tejaswa Ghadai</span>
            </a>
            <a
              href="https://github.com/tejas0017j-creator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:border-accent1"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
        <div className="text-right text-xs font-mono" style={{ color: 'var(--muted)' }}>
          <div className="flex items-center gap-4 mb-1">
            <span className="flex items-center gap-1" style={{ color: 'var(--accent4)' }}>
              <Shield className="w-3 h-3" /> Verbatim Grounded
            </span>
            <span className="flex items-center gap-1" style={{ color: 'var(--accent2)' }}>
              <Cpu className="w-3 h-3" /> 4 Parallel Agents
            </span>
          </div>
          <span style={{ color: 'var(--accent1)' }}>© CARGONET.AI · Built by Tejaswa Ghadai</span>
        </div>
      </div>
    </footer>
  );
};
