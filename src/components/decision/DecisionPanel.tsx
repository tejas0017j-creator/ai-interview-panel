import React, { useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Scale,
  Sparkles,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FinalAssessmentReport, RecommendationType } from '../../types';

interface DecisionPanelProps {
  report?: FinalAssessmentReport;
  isSynthesizing: boolean;
  onTriggerDecision: () => void;
  canSynthesize: boolean;
}

const REC_STYLES: Record<RecommendationType, { color: string; label: string }> = {
  'STRONG HIRE': { color: 'var(--accent1)', label: 'STRONG HIRE' },
  'HIRE': { color: 'var(--accent4)', label: 'HIRE' },
  'LEAN NO HIRE': { color: 'var(--accent3)', label: 'LEAN NO HIRE' },
  'STRONG NO HIRE': { color: '#ef4444', label: 'STRONG NO HIRE' },
};

export const DecisionPanel: React.FC<DecisionPanelProps> = ({
  report,
  isSynthesizing,
  onTriggerDecision,
  canSynthesize,
}) => {
  useEffect(() => {
    if (report && (report.final_recommendation === 'STRONG HIRE' || report.final_recommendation === 'HIRE')) {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#c8ff57', '#818cf8', '#2dd4bf']
      });
    }
  }, [report]);

  const handleExportJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cargonet_evaluation_${report.candidate_name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
  };

  return (
    <div className="glass-panel p-5 sm:p-8 rounded-2xl mb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <span className="section-label block mb-1">
            Phase 4: Mathematical Decision Synthesis
          </span>
          <h3 className="font-syne text-xl sm:text-2xl font-extrabold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Scale className="w-5 h-5" style={{ color: 'var(--accent1)' }} />
            Final Hiring Verdict
          </h3>
          <p className="text-xs mt-0.5 font-light" style={{ color: 'var(--text-secondary)' }}>
            Weighted domain matrix (Tech 40%, HM 40%, HR 20%) with -15% contradiction penalty and +10% ownership bonus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!report && (
            <button
              onClick={onTriggerDecision}
              disabled={isSynthesizing}
              className="btn-primary"
            >
              {isSynthesizing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Math...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Generate Final Verdict</span>
                </>
              )}
            </button>
          )}

          {report && (
            <button
              onClick={handleExportJSON}
              className="btn-ghost text-xs"
            >
              <Download className="w-3.5 h-3.5" style={{ color: 'var(--accent1)' }} />
              <span>Export Audit JSON</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State / Call to Action */}
      {!report && !isSynthesizing && (
        <div className="py-12 text-center rounded-xl p-6" style={{ border: '1px dashed var(--border)', background: 'var(--surface)' }}>
          <Scale className="w-9 h-9 mx-auto mb-3 opacity-30" style={{ color: 'var(--accent1)' }} />
          <p className="font-syne text-base font-bold mb-1" style={{ color: 'var(--text)' }}>Decision Engine Ready</p>
          <p className="text-xs max-w-md mx-auto mb-5" style={{ color: 'var(--muted)' }}>
            Click below to synthesize the 4-agent weighted confidence matrix and compute the final hiring verdict.
          </p>
          <button onClick={onTriggerDecision} className="btn-primary">
            <Award className="w-4 h-4" />
            <span>Compute Verdict Now</span>
          </button>
        </div>
      )}

      {/* Synthesizing Loading */}
      {isSynthesizing && (
        <div className="py-12 text-center space-y-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto animate-spin"
            style={{ background: 'rgba(200,255,87,0.12)', border: '1px solid var(--accent1)' }}>
            <Scale className="w-5 h-5" style={{ color: 'var(--accent1)' }} />
          </div>
          <div className="font-syne text-base font-bold" style={{ color: 'var(--text)' }}>
            Calculating Mathematical Multipliers...
          </div>
          <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
            Applying domain weights · Checking contradiction penalty · Computing ownership bonus
          </p>
        </div>
      )}

      {/* Report Result */}
      {report && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Verdict Card */}
          {(() => {
            const style = REC_STYLES[report.final_recommendation];
            return (
              <div className="p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{ background: 'var(--surface)', border: `2px solid ${style.color}` }}>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: 'var(--muted)' }}>
                    Consensus Recommendation
                  </span>
                  <h2 className="font-syne text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: style.color }}>
                    {style.label}
                  </h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Candidate: <strong style={{ color: 'var(--text)' }}>{report.candidate_name}</strong>
                  </p>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0" style={{ borderColor: 'var(--border)' }}>
                  <div className="font-syne text-3xl sm:text-4xl font-extrabold" style={{ color: 'var(--text)' }}>
                    {report.final_calculated_index.toFixed(2)}
                    <span className="text-xs font-normal" style={{ color: 'var(--muted)' }}> / 10</span>
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                    {(report.overall_confidence_score * 100).toFixed(0)}% Confidence
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Domain Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5" style={{ color: 'var(--muted)' }}>
                <span>Technical (40%)</span>
                <span className="font-bold" style={{ color: 'var(--accent1)' }}>{report.weights_breakdown.technical_final_score.toFixed(1)}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full" style={{ width: `${(report.weights_breakdown.technical_final_score / 10) * 100}%`, background: 'var(--accent1)' }} />
              </div>
              <p className="text-[10px]" style={{ color: 'var(--muted)' }}>Post-debate adjusted score.</p>
            </div>

            <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5" style={{ color: 'var(--muted)' }}>
                <span>Hiring Manager (40%)</span>
                <span className="font-bold" style={{ color: 'var(--accent4)' }}>{report.weights_breakdown.hiring_manager_score.toFixed(1)}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full" style={{ width: `${(report.weights_breakdown.hiring_manager_score / 10) * 100}%`, background: 'var(--accent4)' }} />
              </div>
              <p className="text-[10px]" style={{ color: 'var(--muted)' }}>Autonomy & incident readiness.</p>
            </div>

            <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5" style={{ color: 'var(--muted)' }}>
                <span>HR / Culture (20%)</span>
                <span className="font-bold" style={{ color: 'var(--accent2)' }}>{report.weights_breakdown.hr_culture_score.toFixed(1)}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full" style={{ width: `${(report.weights_breakdown.hr_culture_score / 10) * 100}%`, background: 'var(--accent2)' }} />
              </div>
              <p className="text-[10px]" style={{ color: 'var(--muted)' }}>Integrity & retention probability.</p>
            </div>
          </div>

          {/* Mathematical Multipliers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl text-xs font-mono flex items-center justify-between"
              style={{
                background: report.contradiction_penalty_applied ? 'rgba(248,113,113,0.08)' : 'var(--surface)',
                border: `1px solid ${report.contradiction_penalty_applied ? 'rgba(248,113,113,0.3)' : 'var(--border)'}`,
                color: report.contradiction_penalty_applied ? 'var(--accent3)' : 'var(--muted)',
              }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Contradiction Penalty (x0.85)</span>
              </div>
              <span className="font-bold">
                {report.contradiction_penalty_applied ? '-15% APPLIED' : 'NONE'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl text-xs font-mono flex items-center justify-between"
              style={{
                background: report.ownership_bonus_applied ? 'rgba(200,255,87,0.08)' : 'var(--surface)',
                border: `1px solid ${report.ownership_bonus_applied ? 'rgba(200,255,87,0.3)' : 'var(--border)'}`,
                color: report.ownership_bonus_applied ? 'var(--accent1)' : 'var(--muted)',
              }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Accountability Bonus (x1.10)</span>
              </div>
              <span className="font-bold">
                {report.ownership_bonus_applied ? '+10% APPLIED' : 'NONE'}
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 sm:p-5 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <span className="text-[10px] font-mono uppercase tracking-wider block mb-1.5" style={{ color: 'var(--accent1)' }}>
              Executive Decision Summary
            </span>
            <p className="text-xs sm:text-sm font-light leading-relaxed" style={{ color: 'var(--text)' }}>
              {report.executive_summary}
            </p>
          </div>

          {/* Strengths vs Concerns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h4 className="font-syne text-sm font-bold flex items-center gap-1.5 mb-3" style={{ color: 'var(--accent1)' }}>
                <CheckCircle2 className="w-4 h-4" /> Synthesized Strengths
              </h4>
              <ul className="space-y-1.5 text-xs font-light" style={{ color: 'var(--text-secondary)' }}>
                {report.synthesized_strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span style={{ color: 'var(--accent1)' }}>•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 sm:p-5 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h4 className="font-syne text-sm font-bold flex items-center gap-1.5 mb-3" style={{ color: 'var(--accent3)' }}>
                <AlertTriangle className="w-4 h-4" /> Critical Concerns & Red Flags
              </h4>
              <ul className="space-y-1.5 text-xs font-light" style={{ color: 'var(--text-secondary)' }}>
                {report.critical_concerns.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span style={{ color: 'var(--accent3)' }}>•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
