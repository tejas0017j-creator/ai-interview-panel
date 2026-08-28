export type AgentPersona = 'Technical' | 'HR_Culture' | 'Hiring_Manager' | 'Skeptic';

export interface VerifiableClaim {
  claim_text: string;
  source_document: 'Resume' | 'Transcript' | 'Job_Description';
  source_context: string;
}

export interface CandidateProfile {
  id: string;
  candidate_name: string;
  target_role: string;
  experience_years: number;
  skills_declared: string[];
  verifiable_claims: VerifiableClaim[];
  raw_resume_text?: string;
  raw_transcript_text?: string;
  raw_jd_text?: string;
  admitted_gaps?: string[];
  ownership_evidence?: string[];
}

export interface EvidenceItem {
  quote: string;
  source_document: 'Resume' | 'Transcript' | 'Job_Description';
  finding: string;
}

export interface AgentIndependentEvaluation {
  agent_persona: AgentPersona;
  initial_score: number; // 1.0 - 10.0
  confidence_level: number; // 0.0 - 1.0
  key_verdict: string;
  strengths: string[];
  concerns: string[];
  evidence_trail: EvidenceItem[];
  analyzed_at?: string;
}

export interface StanceShift {
  occurred: boolean;
  previous_score: number;
  updated_score: number;
  triggering_agent: string;
  rationale_for_change: string;
}

export interface DebateTurn {
  turn_id: number;
  speaking_agent: AgentPersona;
  target_agent: AgentPersona | 'All';
  argument_type: 'challenge' | 'concession' | 'counter_evidence' | 'critique' | 'synthesis';
  statement: string;
  referenced_quote: string;
  stance_shift?: StanceShift | null;
  timestamp?: string;
}

export interface DebateTranscript {
  turns: DebateTurn[];
  total_stance_shifts: number;
}

export type RecommendationType = 'STRONG HIRE' | 'HIRE' | 'LEAN NO HIRE' | 'STRONG NO HIRE';

export interface FinalAssessmentReport {
  candidate_name: string;
  final_recommendation: RecommendationType;
  overall_confidence_score: number; // 0.0 - 1.0
  final_calculated_index: number; // 1.0 - 10.0
  weights_breakdown: {
    technical_weight: number;
    technical_final_score: number;
    hiring_manager_weight: number;
    hiring_manager_score: number;
    hr_culture_weight: number;
    hr_culture_score: number;
  };
  contradiction_penalty_applied: boolean;
  contradiction_penalty_multiplier: number;
  ownership_bonus_applied: boolean;
  ownership_bonus_multiplier: number;
  executive_summary: string;
  synthesized_strengths: string[];
  critical_concerns: string[];
  unresolved_agent_disagreements: string[];
  audit_trail: EvidenceItem[];
}

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant' | 'agent_technical' | 'agent_skeptic';
  text: string;
  timestamp: string;
  audioUrl?: string;
}
