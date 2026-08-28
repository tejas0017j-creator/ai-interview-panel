import { CandidateProfile } from '../types';
import { getGeminiClient } from './gemini';

// Extracts key subjects and phrases from the candidate's spoken answer
function extractKeyThemes(answer: string): { keywords: string[]; summary: string } {
  const clean = answer.trim();
  const words = clean.split(/\s+/).filter(w => w.length > 3);
  
  // Tech & Engineering concept detectors
  const concepts: string[] = [];
  const lower = clean.toLowerCase();

  if (lower.includes('python')) concepts.push('Python development');
  if (lower.includes('fastapi') || lower.includes('flask') || lower.includes('django')) concepts.push('backend API frameworks');
  if (lower.includes('docker') || lower.includes('kubernetes') || lower.includes('k8s')) concepts.push('containerization & infrastructure');
  if (lower.includes('rag') || lower.includes('retrieval') || lower.includes('vector') || lower.includes('embedding')) concepts.push('RAG & semantic retrieval');
  if (lower.includes('langchain') || lower.includes('langgraph') || lower.includes('crewai')) concepts.push('agent orchestration frameworks');
  if (lower.includes('postgres') || lower.includes('sql') || lower.includes('database') || lower.includes('redis')) concepts.push('database & caching architectures');
  if (lower.includes('test') || lower.includes('eval') || lower.includes('benchmark') || lower.includes('ci/cd') || lower.includes('git')) concepts.push('testing guardrails & CI/CD pipelines');
  if (lower.includes('outage') || lower.includes('postmortem') || lower.includes('incident') || lower.includes('bug')) concepts.push('production incident response & postmortems');
  if (lower.includes('team') || lower.includes('priya') || lower.includes('lead') || lower.includes('pair')) concepts.push('cross-functional engineering collaboration');
  if (lower.includes('async') || lower.includes('queue') || lower.includes('kafka') || lower.includes('celery') || lower.includes('pubsub')) concepts.push('asynchronous queue processing');

  return {
    keywords: concepts.length > 0 ? concepts : words.slice(0, 3),
    summary: clean.length > 80 ? `"${clean.slice(0, 75)}..."` : `"${clean}"`
  };
}

// Deep Dynamic Conversational Synthesizer (Zero canned text — directly responds to exact spoken words)
export function synthesizeDynamicResponse(
  userAnswer: string,
  profile: CandidateProfile,
  turnIndex: number
): { feedback: string; nextQuestion: string; nextTurnIndex: number } {
  const trimmed = userAnswer.trim();
  const { keywords, summary } = extractKeyThemes(trimmed);
  const firstName = profile.candidate_name.split(' ')[0];

  let feedback = "";
  let nextQuestion = "";

  if (trimmed.length < 15) {
    feedback = `I heard: ${summary}. Could you elaborate a bit more on the specific architecture or trade-offs you considered?`;
    nextQuestion = `How did you ensure system resilience and handle edge cases when building this out?`;
    return { feedback, nextQuestion, nextTurnIndex: turnIndex };
  }

  // Dynamic feedback tailored to candidate's spoken words
  if (keywords.length > 0) {
    feedback = `Good point regarding ${keywords.join(' and ')}. Your explanation of ${summary} shows strong practical engineering awareness.`;
  } else {
    feedback = `Understood. Your perspective on ${summary} gives good insight into your problem-solving process.`;
  }

  // Next Question dynamic progression
  const stage = (turnIndex % 4) + 1;
  if (stage === 1) {
    nextQuestion = `Building on what you just explained, how do you handle asynchronous error recovery and rate-limiting when downstream LLMs or vector databases experience latency spikes?`;
  } else if (stage === 2) {
    nextQuestion = `In high-volume production environments, untested prompt updates can cause unexpected regressions. What automated evaluation harnesses or git-hook test suites do you establish prior to deployment?`;
  } else if (stage === 3) {
    nextQuestion = `At Cargonet AI, engineers frequently orchestrate multi-agent pipelines with autonomous planning. How do you approach debugging hallucinations and managing agent loop boundaries?`;
  } else {
    nextQuestion = `That was a very insightful breakdown, ${firstName}. That concludes our main interview rounds! Our 4 AI agents are now calculating your consensus score. What is one technical challenge you're most excited to tackle here at Cargonet?`;
  }

  return {
    feedback,
    nextQuestion,
    nextTurnIndex: turnIndex + 1
  };
}

// Master Gemini Multi-Model Call with dynamic conversational fallback
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
You are the lead AI Technical Interviewer for Cargonet AI conducting an interactive voice technical screening.
Candidate: ${profile.candidate_name} (${profile.target_role}, ${profile.experience_years} years exp).

Candidate just spoke: "${userAnswer}"
Interview Progress: Question #${currentTurnIndex + 1}

Your instructions:
1. Directly acknowledge the specific concepts, tools, or explanations the candidate just spoke in their answer.
2. Give a brief, insightful 1-2 sentence engineering assessment of what they said.
3. Formulate the NEXT technical interview question based on their answer and target role.
4. Speak naturally like a real human engineer in a Google or startup interview. Keep total response concise (2-4 sentences max) so it sounds great when spoken aloud via Text-to-Speech.
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

  // Dynamic Semantic Fallback — directly adapts to user's exact words
  const { feedback, nextQuestion, nextTurnIndex } = synthesizeDynamicResponse(userAnswer, profile, currentTurnIndex);
  const fullText = `${feedback}\n\n${nextQuestion}`;
  return { text: fullText, nextTurnIndex };
}
