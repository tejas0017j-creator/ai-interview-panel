import { CandidateProfile } from '../types';
import { getGeminiClient } from './gemini';

export interface InterviewTurn {
  questionNumber: number;
  question: string;
  topic: string;
}

export const INTERVIEW_QUESTIONS: Record<string, InterviewTurn[]> = {
  'rohan-malhotra': [
    {
      questionNumber: 1,
      topic: 'Architecture & Multi-Agent Routing',
      question: "On your resume, you listed designing a multi-agent exception-handling engine reducing manual review by 40%. Can you walk me through how you routed tasks between GPT-4 and SLMs, and what specific part of the production pipeline you personally built versus your teammate Priya?"
    },
    {
      questionNumber: 2,
      topic: 'Production Incidents & On-Call',
      question: "Cargonet's freight systems run mission-critical 24/7 quoting and booking pipelines. In your interview, you mentioned Voltrix had a small pilot base with low outage volumes. How would you handle a cascading queue failure at 2 AM where hundreds of freight quotes are failing?"
    },
    {
      questionNumber: 3,
      topic: 'Career Retention & Ownership',
      question: "You've had 3 roles in 3.5 years. Cargonet emphasizes long-term ownership of living AI systems rather than build-once-and-leave. What ensures you'll stay to maintain and iterate this multi-agent system over the next 2 to 3 years?"
    },
    {
      questionNumber: 4,
      topic: 'AI Code Generation & Tooling',
      question: "Our engineers direct AI coding agents like Claude Code to build and debug systems rapidly. How do you verify and write automated evaluation harnesses for AI-generated code to prevent prompt regressions?"
    }
  ],
  'ananya-iyer': [
    {
      questionNumber: 1,
      topic: 'RAG Architecture & Metrics',
      question: "You mentioned building a single-agent RAG support assistant at Bridgepoint Systems that improved accuracy by ~40%. Can you explain how you structured your chunking, embedding retrieval with ChromaDB, and how you validated that 40% accuracy metric?"
    },
    {
      questionNumber: 2,
      topic: 'Production Failures & Incident Postmortems',
      question: "You demonstrated great ownership by taking public responsibility for a 2-hour production outage caused by an untested prompt change. What exact pre-deploy checklists and git-hook evaluation suites did you institute afterwards to prevent it from ever happening again?"
    },
    {
      questionNumber: 3,
      topic: 'Multi-Agent Frameworks Ramp-Up',
      question: "You noted you haven't yet deployed multi-agent orchestrations like LangGraph or CrewAI in production. How do you plan to ramp up on our live planner-executor-reviewer multi-agent freight pipeline during your first 30 days?"
    },
    {
      questionNumber: 4,
      topic: 'Long-Term Ownership',
      question: "You spent 6 continuous years at Bridgepoint Systems refactoring monoliths into Python microservices. How does your experience maintaining long-lived production systems align with Cargonet's philosophy of treating AI agents as living software products?"
    }
  ]
};

// Generates evaluation of candidate's answer + asks the NEXT interview question
export function evaluateAnswerAndGetNextQuestion(
  userAnswer: string,
  profile: CandidateProfile,
  currentTurnIndex: number
): { feedback: string; nextQuestion: string; nextTurnIndex: number } {
  const isRohan = profile.id === 'rohan-malhotra';
  const questionsList = isRohan ? INTERVIEW_QUESTIONS['rohan-malhotra'] : INTERVIEW_QUESTIONS['ananya-iyer'];
  const totalQuestions = questionsList.length;

  const currentQ = questionsList[Math.min(currentTurnIndex, totalQuestions - 1)];
  const nextIdx = currentTurnIndex + 1;
  const isLast = nextIdx >= totalQuestions;

  let feedback = "";
  const ansLower = userAnswer.toLowerCase();

  if (ansLower.length < 15) {
    feedback = `Thank you for that brief note. In an engineering panel, we look for deeper technical specifics and architectural rationales.`;
  } else if (ansLower.includes('priya') || ansLower.includes('team') || ansLower.includes('architect') || ansLower.includes('slm') || ansLower.includes('routing')) {
    feedback = `Great transparency regarding the system architecture and team collaboration. High clarity on the division of responsibilities.`;
  } else if (ansLower.includes('outage') || ansLower.includes('postmortem') || ansLower.includes('checklist') || ansLower.includes('test') || ansLower.includes('eval')) {
    feedback = `Excellent focus on production reliability, preventative testing guardrails, and root-cause postmortems.`;
  } else if (ansLower.includes('ramp') || ansLower.includes('pair') || ansLower.includes('learn') || ansLower.includes('langgraph') || ansLower.includes('code')) {
    feedback = `Strong growth mindset. Being proactive about ramping up on new multi-agent patterns is exactly what we look for.`;
  } else {
    feedback = `Good response. That provides useful context on your engineering methodology and problem-solving approach.`;
  }

  if (isLast) {
    const nextQuestion = `That concludes all our technical interview rounds for today! You've covered architecture, production incident handling, and long-term system ownership. Our 4 agents are now ready to synthesize your final consensus score in the dashboard. Is there anything else you'd like to ask the panel before we conclude?`;
    return { feedback, nextQuestion, nextTurnIndex: nextIdx };
  }

  const nextQObj = questionsList[nextIdx];
  const nextQuestion = `Next question (${nextQObj.topic}): ${nextQObj.question}`;

  return { feedback, nextQuestion, nextTurnIndex: nextIdx };
}

// Master Gemini Multi-Model Call with 2-way interview mode
export async function askGeminiInterviewAssistant(
  userAnswer: string,
  profile: CandidateProfile,
  apiKey: string,
  currentTurnIndex: number,
  chatHistory: { role: string; parts: { text: string }[] }[]
): Promise<{ text: string; nextTurnIndex: number }> {
  const modelsToTry = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-pro'
  ];

  if (apiKey && apiKey.trim().length > 10) {
    const genAI = getGeminiClient(apiKey);

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const contextPrompt = `
You are the lead AI Technical Interviewer for Cargonet AI conducting a live voice/text technical interview.
Candidate: ${profile.candidate_name} (${profile.target_role}, ${profile.experience_years} yrs exp).
Dossier Context: ${JSON.stringify(profile.verifiable_claims)}

Candidate just answered: "${userAnswer}"
Interview Stage: Question #${currentTurnIndex + 1}

Your task:
1. Provide a brief 1-2 sentence constructive evaluation of their answer (mentioning technical depth or honesty).
2. Ask the next technical interview question on freight automation, multi-agent RAG, or production incident response.
3. Speak naturally like a human interviewer. Keep total response under 4 sentences so it can be comfortably spoken aloud in voice.
`;
        const result = await model.generateContent(contextPrompt);
        const text = result.response.text();
        if (text && text.trim().length > 0) {
          return { text: text.trim(), nextTurnIndex: currentTurnIndex + 1 };
        }
      } catch (err: any) {
        console.warn(`[Gemini Interviewer] Model ${modelName} call:`, err?.message || err);
      }
    }
  }

  // Fallback to grounded 2-way evaluation + next question pipeline
  const { feedback, nextQuestion, nextTurnIndex } = evaluateAnswerAndGetNextQuestion(userAnswer, profile, currentTurnIndex);
  const fullText = `${feedback}\n\n${nextQuestion}`;
  return { text: fullText, nextTurnIndex };
}
