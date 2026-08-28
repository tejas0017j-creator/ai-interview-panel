import React, { useState } from 'react';
import { Upload, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CandidateProfile } from '../../types';
import { SAMPLE_CANDIDATE_ROHAN, SAMPLE_CANDIDATE_ANANYA } from '../../data/sampleCandidates';

interface CandidateSelectorProps {
  currentProfile: CandidateProfile;
  onSelectCandidate: (profile: CandidateProfile) => void;
  onCustomUpload: (profile: CandidateProfile) => void;
}

export const CandidateSelector: React.FC<CandidateSelectorProps> = ({
  currentProfile,
  onSelectCandidate,
  onCustomUpload,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('Senior AI Engineer');
  const [customResume, setCustomResume] = useState('');
  const [customTranscript, setCustomTranscript] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customResume) return;

    const newProfile: CandidateProfile = {
      id: `custom-${Date.now()}`,
      candidate_name: customName,
      target_role: customRole,
      experience_years: 4.0,
      skills_declared: ['Python', 'LLMs', 'FastAPI', 'RAG', 'Agent Systems'],
      verifiable_claims: [
        {
          claim_text: "Extracted claims from uploaded custom candidate documents.",
          source_document: "Resume",
          source_context: customResume.substring(0, 150) + "..."
        }
      ],
      raw_resume_text: customResume,
      raw_transcript_text: customTranscript,
      admitted_gaps: ["Custom document evaluation in progress"],
      ownership_evidence: ["Custom input"]
    };

    onCustomUpload(newProfile);
    setShowUploadModal(false);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <span className="section-label block mb-0.5">
            Candidate Evaluation Target
          </span>
          <h2 className="font-syne text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Select Active Candidate
          </h2>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-ghost text-xs self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" style={{ color: 'var(--accent1)' }} />
          <span>Upload Custom PDF / Text</span>
        </button>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rohan Card */}
        <div
          onClick={() => onSelectCandidate(SAMPLE_CANDIDATE_ROHAN)}
          className="p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden"
          style={{
            background: currentProfile.id === 'rohan-malhotra' ? 'var(--card)' : 'var(--surface)',
            borderColor: currentProfile.id === 'rohan-malhotra' ? 'var(--accent3)' : 'var(--border)',
            boxShadow: currentProfile.id === 'rohan-malhotra' ? '0 0 24px rgba(248,113,113,0.15)' : 'none',
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-semibold"
                  style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--accent3)', border: '1px solid rgba(248,113,113,0.2)' }}>
                  Candidate A
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>3.5 Yrs Exp</span>
              </div>
              <h3 className="font-syne text-lg font-bold mt-1" style={{ color: 'var(--text)' }}>
                Rohan Malhotra
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Senior AI / Backend Engineer · Ex-Voltrix Logistics
              </p>
            </div>
            <ShieldAlert className="w-5 h-5 shrink-0" style={{ color: 'var(--accent3)' }} />
          </div>

          <div className="space-y-1.5 text-xs pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 font-mono" style={{ color: 'var(--text)' }}>
              <span style={{ color: 'var(--accent1)' }}>✓</span> LangGraph, CrewAI, Pinecone, SLM Routing
            </div>
            <div className="flex items-start gap-2" style={{ color: 'var(--accent3)' }}>
              <span>⚠</span>
              <span><strong>Red Flag:</strong> Claimed 'Sole Architect', transcript revealed Priya built it.</span>
            </div>
            <div className="flex items-start gap-2" style={{ color: 'var(--muted)' }}>
              <span>•</span>
              <span>3 jobs in 3.5 yrs (compensation hopping). Untested in high incidents.</span>
            </div>
          </div>
        </div>

        {/* Ananya Card */}
        <div
          onClick={() => onSelectCandidate(SAMPLE_CANDIDATE_ANANYA)}
          className="p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden"
          style={{
            background: currentProfile.id === 'ananya-iyer' ? 'var(--card)' : 'var(--surface)',
            borderColor: currentProfile.id === 'ananya-iyer' ? 'var(--accent4)' : 'var(--border)',
            boxShadow: currentProfile.id === 'ananya-iyer' ? '0 0 24px rgba(45,212,191,0.15)' : 'none',
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-semibold"
                  style={{ background: 'rgba(45,212,191,0.1)', color: 'var(--accent4)', border: '1px solid rgba(45,212,191,0.2)' }}>
                  Candidate B
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>6.0 Yrs Exp</span>
              </div>
              <h3 className="font-syne text-lg font-bold mt-1" style={{ color: 'var(--text)' }}>
                Ananya Iyer
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Software & AI Engineer · 6 Yrs Bridgepoint Systems
              </p>
            </div>
            <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--accent4)' }} />
          </div>

          <div className="space-y-1.5 text-xs pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 font-mono" style={{ color: 'var(--text)' }}>
              <span style={{ color: 'var(--accent4)' }}>✓</span> Python, LangChain, ChromaDB, Regression Harnesses
            </div>
            <div className="flex items-start gap-2" style={{ color: 'var(--accent4)' }}>
              <span>★</span>
              <span><strong>High Ownership:</strong> Owned 2-hour outage postmortem & created pre-deploy checklists.</span>
            </div>
            <div className="flex items-start gap-2" style={{ color: 'var(--muted)' }}>
              <span>•</span>
              <span>Transparent about RAG spot-check metrics & ready to learn multi-agent workflows.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Custom Candidate Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-2xl max-w-xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-syne font-bold text-xl mb-1 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Upload className="w-5 h-5" style={{ color: 'var(--accent1)' }} /> Custom Candidate Dossier
            </h3>
            <p className="text-xs mb-5 font-light" style={{ color: 'var(--muted)' }}>
              Input candidate details for automated multi-agent parallel processing.
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono block mb-1" style={{ color: 'var(--muted)' }}>Candidate Name</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Maya Patel"
                    className="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-mono block mb-1" style={{ color: 'var(--muted)' }}>Target Role</label>
                  <input
                    type="text"
                    required
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g. Cargonet AI Engineer"
                    className="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono block mb-1" style={{ color: 'var(--muted)' }}>Resume Key Claims</label>
                <textarea
                  rows={3}
                  required
                  value={customResume}
                  onChange={(e) => setCustomResume(e.target.value)}
                  placeholder="Paste resume content and claims..."
                  className="w-full rounded-xl px-3.5 py-2 text-xs focus:outline-none font-mono"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>

              <div>
                <label className="text-xs font-mono block mb-1" style={{ color: 'var(--muted)' }}>Interview Transcript (Optional)</label>
                <textarea
                  rows={3}
                  value={customTranscript}
                  onChange={(e) => setCustomTranscript(e.target.value)}
                  placeholder="Paste interview dialogue extracts..."
                  className="w-full rounded-xl px-3.5 py-2 text-xs focus:outline-none font-mono"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn-ghost text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs px-5 py-2"
                >
                  Load Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
