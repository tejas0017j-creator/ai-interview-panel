import React, { useState } from 'react';
import { 
  Code2, 
  HeartHandshake, 
  Briefcase, 
  SearchCode, 
  Quote, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { AgentIndependentEvaluation, AgentPersona } from '../../types';

interface AgentCardProps {
  evaluation?: AgentIndependentEvaluation;
  persona: AgentPersona;
  isLoading?: boolean;
}

const PERSONA_CONFIG: Record<AgentPersona, {
  title: string;
  role: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  fillClass: string;
}> = {
  Technical: {
    title: 'Technical Lead',
    role: 'Architecture, SLM/LLM Routing & Code Execution',
    icon: Code2,
    accentColor: 'var(--accent1)',
    fillClass: 'bg-lime-500',
  },
  HR_Culture: {
    title: 'HR & Culture Lead',
    role: 'Integrity, Transparency & Retention Probability',
    icon: HeartHandshake,
    accentColor: 'var(--accent2)',
    fillClass: 'bg-purple-500',
  },
  Hiring_Manager: {
    title: 'Hiring Manager',
    role: 'Day-One Autonomy & Long-Term Ownership',
    icon: Briefcase,
    accentColor: 'var(--accent4)',
    fillClass: 'bg-teal-500',
  },
  Skeptic: {
    title: 'Forensic Skeptic',
    role: 'Discrepancy Detection & Exaggeration Auditing',
    icon: SearchCode,
    accentColor: 'var(--accent3)',
    fillClass: 'bg-red-500',
  },
};

export const AgentCard: React.FC<AgentCardProps> = ({
  evaluation,
  persona,
  isLoading = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const config = PERSONA_CONFIG[persona];
  const Icon = config.icon;

  if (isLoading) {
    return (
      <div className="bento-card flex flex-col justify-between min-h-[260px] animate-pulse">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono uppercase font-bold" style={{ color: config.accentColor }}>
              {config.title}
            </span>
            <Sparkles className="w-4 h-4 animate-spin" style={{ color: 'var(--muted)' }} />
          </div>
          <div className="h-4 rounded-lg w-3/4 mb-2.5" style={{ background: 'var(--border)' }} />
          <div className="h-3 rounded-lg w-full mb-2" style={{ background: 'var(--border)' }} />
          <div className="h-3 rounded-lg w-2/3" style={{ background: 'var(--border)' }} />
        </div>
        <div className="mt-6">
          <div className="h-1.5 rounded-full w-full" style={{ background: 'var(--border)' }} />
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="bento-card flex flex-col justify-between min-h-[240px] opacity-75">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold" style={{ color: config.accentColor }}>
            {config.title}
          </span>
          <h3 className="font-syne text-base font-bold mt-2" style={{ color: 'var(--text)' }}>{config.title}</h3>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{config.role}</p>
        </div>
        <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>Awaiting evaluation run...</p>
      </div>
    );
  }

  const scorePercentage = (evaluation.initial_score / 10) * 100;

  return (
    <div className="bento-card flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--surface)', 
                border: '1px solid var(--border)' 
              }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: config.accentColor }} />
            </div>
            <span className="text-[11px] font-mono uppercase font-bold" style={{ color: config.accentColor }}>
              {config.title}
            </span>
          </div>

          <div className="text-right">
            <div className="font-syne text-xl font-extrabold" style={{ color: 'var(--text)' }}>
              {evaluation.initial_score.toFixed(1)}
              <span className="text-xs font-normal" style={{ color: 'var(--muted)' }}>/10</span>
            </div>
          </div>
        </div>

        {/* Verdict */}
        <h4 className="font-syne text-xs font-bold mb-2.5 line-clamp-2" style={{ color: 'var(--text)' }}>
          {evaluation.key_verdict}
        </h4>

        {/* Strengths & Concerns */}
        <div className="space-y-1.5 text-xs">
          {evaluation.strengths.slice(0, 1).map((s, idx) => (
            <div key={idx} className="flex items-start gap-1.5" style={{ color: 'var(--text)' }}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--accent1)' }} />
              <span className="font-light leading-tight">{s}</span>
            </div>
          ))}
          {evaluation.concerns.slice(0, 1).map((c, idx) => (
            <div key={idx} className="flex items-start gap-1.5" style={{ color: 'var(--accent3)' }}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="font-light leading-tight">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Progress & Expander */}
      <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex justify-between items-center text-[10px] font-mono mb-1" style={{ color: 'var(--muted)' }}>
          <span>Score</span>
          <span className="font-bold" style={{ color: 'var(--text)' }}>{evaluation.initial_score.toFixed(1)} / 10</span>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 rounded-full overflow-hidden mb-2" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${scorePercentage}%`, background: config.accentColor }}
          />
        </div>

        {/* Evidence Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-[10px] font-mono pt-1 transition-colors"
          style={{ color: 'var(--muted)' }}
        >
          <span className="flex items-center gap-1">
            <Quote className="w-2.5 h-2.5" style={{ color: 'var(--accent1)' }} />
            <span>Quotes ({evaluation.evidence_trail.length})</span>
          </span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Expanded Quotes */}
        {expanded && (
          <div className="mt-2.5 pt-2.5 space-y-2 animate-fadeIn" style={{ borderTop: '1px solid var(--border)' }}>
            {evaluation.evidence_trail.map((ev, i) => (
              <div key={i} className="p-2 rounded-lg text-[11px]" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between text-[9px] font-mono mb-0.5" style={{ color: 'var(--muted)' }}>
                  <span className="font-bold" style={{ color: 'var(--accent1)' }}>[{ev.source_document}]</span>
                </div>
                <p className="italic font-serif mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                  "{ev.quote}"
                </p>
                <p className="text-[10px]" style={{ color: 'var(--muted)' }}>
                  ↳ {ev.finding}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
