import React, { useState } from 'react';
import { 
  Swords, 
  Sparkles, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  Quote, 
  Play
} from 'lucide-react';
import { DebateTurn, DebateTranscript, AgentPersona } from '../../types';

interface DebateArenaProps {
  debateTranscript?: DebateTranscript;
  isDebating: boolean;
  onTriggerDebate: () => void;
  canDebate: boolean;
}

const AGENT_COLORS: Record<AgentPersona, { color: string; label: string }> = {
  Technical: { color: 'var(--accent1)', label: 'Technical Lead' },
  HR_Culture: { color: 'var(--accent2)', label: 'HR / Culture' },
  Hiring_Manager: { color: 'var(--accent4)', label: 'Hiring Manager' },
  Skeptic: { color: 'var(--accent3)', label: 'Forensic Skeptic' },
};

export const DebateArena: React.FC<DebateArenaProps> = ({
  debateTranscript,
  isDebating,
  onTriggerDebate,
  canDebate,
}) => {
  const [speakingTurnId, setSpeakingTurnId] = useState<number | null>(null);

  const speakTurn = (turn: DebateTurn) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (speakingTurnId === turn.turn_id) {
        setSpeakingTurnId(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(`${turn.speaking_agent} says: ${turn.statement}`);
      utterance.rate = 1.0;
      utterance.pitch = turn.speaking_agent === 'Skeptic' ? 0.95 : 1.05;
      utterance.onend = () => setSpeakingTurnId(null);
      utterance.onerror = () => setSpeakingTurnId(null);
      setSpeakingTurnId(turn.turn_id);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="glass-panel p-5 sm:p-7 rounded-2xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <span className="section-label block mb-1">
            Phase 3: The Cross-Examination Arena
          </span>
          <h3 className="font-syne text-xl sm:text-2xl font-extrabold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Swords className="w-5 h-5" style={{ color: 'var(--accent3)' }} />
            Multi-Agent Debate & Stance Tracking
          </h3>
          <p className="text-xs mt-0.5 font-light" style={{ color: 'var(--text-secondary)' }}>
            The Skeptic challenges peer agent findings using verbatim quotes. Stance shifts are recorded in real-time.
          </p>
        </div>

        {canDebate && !debateTranscript && (
          <button
            onClick={onTriggerDebate}
            disabled={isDebating}
            className="btn-primary self-start sm:self-auto shrink-0"
          >
            {isDebating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Simulating Debate...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Debate</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Empty State */}
      {!debateTranscript && !isDebating && (
        <div className="py-12 text-center rounded-xl" style={{ border: '1px dashed var(--border)' }}>
          <Swords className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: 'var(--muted)' }} />
          <p className="font-syne text-sm font-bold" style={{ color: 'var(--text)' }}>Debate Arena Idle</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Run the 4 parallel evaluations first to start cross-examination.
          </p>
        </div>
      )}

      {/* Loading */}
      {isDebating && (
        <div className="py-12 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto animate-bounce"
            style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid var(--accent3)' }}>
            <Swords className="w-5 h-5 animate-spin" style={{ color: 'var(--accent3)' }} />
          </div>
          <div className="font-syne text-sm font-bold" style={{ color: 'var(--text)' }}>
            Skeptic Cross-Examining Findings...
          </div>
          <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
            Checking transcript quotes for discrepancies and stance adjustments
          </p>
        </div>
      )}

      {/* Transcript */}
      {debateTranscript && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--muted)' }}>Total Turns: {debateTranscript.turns.length}</span>
            <span className="font-bold" style={{ color: 'var(--accent1)' }}>
              ⚡ Stance Shifts Recorded: {debateTranscript.total_stance_shifts}
            </span>
          </div>

          <div className="space-y-3">
            {debateTranscript.turns.map((turn) => {
              const info = AGENT_COLORS[turn.speaking_agent];
              const isShift = turn.stance_shift && turn.stance_shift.occurred;

              return (
                <div
                  key={turn.turn_id}
                  className="p-4 rounded-xl transition-all"
                  style={{
                    background: 'var(--surface)',
                    border: `1px solid ${isShift ? 'var(--accent1)' : 'var(--border)'}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold" style={{ color: info.color }}>
                        {info.label}
                      </span>
                      <ArrowRight className="w-3 h-3" style={{ color: 'var(--muted)' }} />
                      <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
                        {turn.target_agent}
                      </span>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                        {turn.argument_type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakTurn(turn)}
                        className="p-1 rounded transition-colors hover:opacity-80"
                        style={{ color: 'var(--muted)' }}
                        title="Listen to agent statement"
                      >
                        {speakingTurnId === turn.turn_id ? (
                          <VolumeX className="w-3.5 h-3.5 animate-pulse" style={{ color: 'var(--accent1)' }} />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>
                        #{turn.turn_id}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-light leading-relaxed mb-2.5" style={{ color: 'var(--text)' }}>
                    {turn.statement}
                  </p>

                  {/* Verbatim quote */}
                  <div className="p-2.5 rounded-lg text-xs flex items-start gap-2"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <Quote className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--accent1)' }} />
                    <span className="font-serif italic text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {turn.referenced_quote}
                    </span>
                  </div>

                  {/* Stance shift alert */}
                  {isShift && turn.stance_shift && (
                    <div className="mt-2.5 p-2.5 rounded-lg flex items-center justify-between text-xs font-mono"
                      style={{ background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.25)', color: 'var(--accent1)' }}>
                      <div className="flex items-center gap-2 font-bold">
                        {turn.stance_shift.updated_score < turn.stance_shift.previous_score ? (
                          <TrendingDown className="w-4 h-4" style={{ color: 'var(--accent3)' }} />
                        ) : (
                          <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent1)' }} />
                        )}
                        <span>
                          STANCE SHIFT: {turn.stance_shift.previous_score.toFixed(1)} → {turn.stance_shift.updated_score.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-[10px] hidden sm:inline" style={{ color: 'var(--muted)' }}>
                        Triggered by {turn.stance_shift.triggering_agent}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
