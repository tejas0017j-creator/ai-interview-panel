import React from 'react';
import { Play, Sparkles, Mic } from 'lucide-react';

interface HeroProps {
  onStartEvaluation: () => void;
  onOpenVoiceAssistant: () => void;
  isEvaluating: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onStartEvaluation, onOpenVoiceAssistant, isEvaluating }) => {
  return (
    <section className="min-h-[78vh] flex flex-col justify-center px-6 sm:px-12 relative pt-28 pb-16 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full text-center">
        {/* Subtle classic badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-8"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent1)' }} />
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
            Autonomous Multi-Agent Evaluation
          </span>
        </div>

        {/* Timeless Editorial Serif Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight mb-7"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: 'var(--text)' }}>
          The Art of <em className="italic font-serif" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Multi-Agent</em><br />
          Interview Evaluation
        </h1>

        {/* Editorial Subtitle with generous spacing */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed mb-10"
          style={{ color: 'var(--text-secondary)' }}>
          Four autonomous agents independently analyze candidate dossiers, cross-examine claims in a structured debate, and synthesize hiring verdicts with mathematical precision.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button onClick={onStartEvaluation} disabled={isEvaluating} className="btn-primary">
            {isEvaluating ? (
              <><Sparkles className="w-4 h-4 animate-spin" /><span>Evaluating Panel...</span></>
            ) : (
              <><Play className="w-4 h-4 fill-current" /><span>Run 4-Agent Evaluation</span></>
            )}
          </button>
          <button onClick={onOpenVoiceAssistant} className="btn-ghost">
            <Mic className="w-4 h-4" style={{ color: 'var(--accent2)' }} />
            <span>Live 2-Way Voice Interview</span>
          </button>
        </div>
      </div>
    </section>
  );
};
