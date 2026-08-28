import React from 'react';

export const BackgroundOrbs: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="hero-bg-orb orb1" />
      <div className="hero-bg-orb orb2" />
      <div className="hero-bg-orb orb3" />
    </div>
  );
};
