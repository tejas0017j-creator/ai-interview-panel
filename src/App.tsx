import React, { useState } from 'react';
import { BackgroundOrbs } from './components/layout/BackgroundOrbs';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/hero/Hero';
import { MarqueeRibbon } from './components/marquee/MarqueeRibbon';
import { CandidateSelector } from './components/dashboard/CandidateSelector';
import { CandidateProfileCard } from './components/dashboard/CandidateProfileCard';
import { AgentCard } from './components/dashboard/AgentCard';
import { DebateArena } from './components/debate/DebateArena';
import { DecisionPanel } from './components/decision/DecisionPanel';
import { VoiceAndCameraAssistant } from './components/assistant/VoiceAndCameraAssistant';

import { CandidateProfile, AgentIndependentEvaluation, AgentPersona, DebateTranscript, FinalAssessmentReport } from './types';
import { SAMPLE_CANDIDATE_ROHAN, SAMPLE_CANDIDATE_ANANYA } from './data/sampleCandidates';
import { runParallelEvaluations, runDebate, synthesizeFinalDecision } from './services/agentEngine';

export const App: React.FC = () => {
  // Theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
      }
      return next;
    });
  };

  // State
  const [apiKey] = useState('');
  const [activeProfile, setActiveProfile] = useState<CandidateProfile>(SAMPLE_CANDIDATE_ROHAN);

  // Pipeline State
  const [evaluations, setEvaluations] = useState<Record<AgentPersona, AgentIndependentEvaluation> | null>(null);
  const [debateTranscript, setDebateTranscript] = useState<DebateTranscript | null>(null);
  const [finalReport, setFinalReport] = useState<FinalAssessmentReport | null>(null);

  // Loading
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isDebating, setIsDebating] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Assistant
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const resetPipeline = (profile: CandidateProfile) => {
    setActiveProfile(profile);
    setEvaluations(null);
    setDebateTranscript(null);
    setFinalReport(null);
  };

  const handleStartEvaluation = async () => {
    setIsEvaluating(true);
    setEvaluations(null);
    setDebateTranscript(null);
    setFinalReport(null);
    try {
      const evals = await runParallelEvaluations(activeProfile, apiKey);
      setEvaluations(evals);
      document.getElementById('eval-grid')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleTriggerDebate = async () => {
    if (!evaluations) return;
    setIsDebating(true);
    try {
      const debate = await runDebate(activeProfile, evaluations, apiKey);
      setDebateTranscript(debate);
      document.getElementById('debate-arena')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Debate error:', err);
    } finally {
      setIsDebating(false);
    }
  };

  const handleTriggerDecision = () => {
    if (!evaluations || !debateTranscript) return;
    setIsSynthesizing(true);
    setTimeout(() => {
      const report = synthesizeFinalDecision(activeProfile, evaluations, debateTranscript);
      setFinalReport(report);
      setIsSynthesizing(false);
      document.getElementById('decision-panel')?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <BackgroundOrbs />

      <Navbar
        onResetDemo={() => resetPipeline(activeProfile)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      <Hero
        onStartEvaluation={handleStartEvaluation}
        onOpenVoiceAssistant={() => setIsAssistantOpen(true)}
        isEvaluating={isEvaluating}
      />

      <MarqueeRibbon />

      <main className="max-w-6xl mx-auto px-5 sm:px-10 py-14 relative z-10">
        <CandidateSelector
          currentProfile={activeProfile}
          onSelectCandidate={resetPipeline}
          onCustomUpload={resetPipeline}
        />

        <CandidateProfileCard profile={activeProfile} />

        {/* 4-Agent Evaluations Grid */}
        <div id="eval-grid" className="mb-12 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <span className="section-label block mb-1">Phase 2: Parallel Agent Isolation</span>
              <h2 className="font-syne text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
                Independent Agent Evaluations
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <AgentCard persona="Technical" evaluation={evaluations?.['Technical']} isLoading={isEvaluating} />
            <AgentCard persona="HR_Culture" evaluation={evaluations?.['HR_Culture']} isLoading={isEvaluating} />
            <AgentCard persona="Hiring_Manager" evaluation={evaluations?.['Hiring_Manager']} isLoading={isEvaluating} />
            <AgentCard persona="Skeptic" evaluation={evaluations?.['Skeptic']} isLoading={isEvaluating} />
          </div>
        </div>

        {/* Debate Arena */}
        <div id="debate-arena" className="scroll-mt-28">
          <DebateArena
            debateTranscript={debateTranscript || undefined}
            isDebating={isDebating}
            onTriggerDebate={handleTriggerDebate}
            canDebate={Boolean(evaluations)}
          />
        </div>

        {/* Decision Panel */}
        <div id="decision-panel" className="scroll-mt-28">
          <DecisionPanel
            report={finalReport || undefined}
            isSynthesizing={isSynthesizing}
            onTriggerDecision={handleTriggerDecision}
            canSynthesize={Boolean(evaluations && debateTranscript)}
          />
        </div>
      </main>

      {/* Voice + Camera Assistant */}
      <VoiceAndCameraAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        activeProfile={activeProfile}
        apiKey={apiKey}
      />

      <Footer />
    </div>
  );
};
