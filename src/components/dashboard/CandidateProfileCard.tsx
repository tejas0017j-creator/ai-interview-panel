import React from 'react';
import { CandidateProfile } from '../../types';

interface CandidateProfileCardProps {
  profile: CandidateProfile;
}

export const CandidateProfileCard: React.FC<CandidateProfileCardProps> = ({ profile }) => {
  return (
    <div className="glass-panel p-5 sm:p-7 rounded-2xl mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <span className="section-label block mb-1">
            Candidate Evidence Dossier
          </span>
          <h3 className="font-syne text-xl sm:text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
            {profile.candidate_name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {profile.target_role} · {profile.experience_years} Years Experience
          </p>
        </div>

        {/* Skill Pills */}
        <div className="flex flex-wrap gap-1.5 max-w-md">
          {profile.skills_declared.map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg text-xs font-mono"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Verifiable Claims */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider block mb-2.5" style={{ color: 'var(--muted)' }}>
          Verifiable Evidence Quotes ({profile.verifiable_claims.length})
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {profile.verifiable_claims.map((claim, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl text-xs flex flex-col justify-between"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-center gap-2 mb-2 text-[10px] font-mono">
                <span className="px-1.5 py-0.5 rounded font-bold"
                  style={{ background: 'rgba(163,230,53,0.1)', color: 'var(--accent1)', border: '1px solid rgba(163,230,53,0.2)' }}>
                  {claim.source_document}
                </span>
                <span className="truncate" style={{ color: 'var(--muted)' }}>{claim.claim_text}</span>
              </div>
              <p className="font-serif italic text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                "{claim.source_context}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
