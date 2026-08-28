import React from 'react';

export const MarqueeRibbon: React.FC = () => {
  const items = [
    'Autonomous Multi-Agent Evaluation',
    'Forensic Cross-Examination',
    'Verbatim Quote Verification',
    'Dynamic Stance-Shift Auditing',
    'Non-Averaging Confidence Matrix',
    'Live 2-Way Voice Interview',
    'Zero Data Leakage',
  ];

  return (
    <div className="py-4 overflow-hidden whitespace-nowrap select-none"
      style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="flex gap-10 animate-marquee w-max">
        {[...items, ...items].map((item, idx) => (
          <span key={idx} className="font-sans text-xs tracking-widest uppercase flex items-center gap-4"
            style={{ color: 'var(--muted)' }}>
            <span>{item}</span>
            <span className="w-1 h-1 rounded-full opacity-40" style={{ background: 'var(--text)' }} />
          </span>
        ))}
      </div>
    </div>
  );
};
