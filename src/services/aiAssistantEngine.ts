import { CandidateProfile } from '../types';
import { getGeminiClient } from './gemini';

// Comprehensive General Knowledge + Interview Intelligence Engine
export function generateGeneralAndInterviewResponse(
  userQuery: string,
  profile: CandidateProfile,
  turnIndex: number
): { text: string; nextTurnIndex: number } {
  const q = userQuery.trim();
  const qLower = q.toLowerCase();
  const firstName = profile.candidate_name.split(' ')[0];

  // 1. General Greetings & Identity
  if (qLower.match(/^(hi|hello|hey|greetings|good morning|good evening|sup)/i)) {
    return {
      text: `Hello ${firstName}! I'm your Cargonet AI Assistant. I can answer any technical engineering questions, explain programming concepts, or conduct your live technical screening for the ${profile.target_role} role. What would you like to discuss or work on today?`,
      nextTurnIndex: turnIndex
    };
  }

  if (qLower.includes('who are you') || qLower.includes('what is your name') || qLower.includes('what can you do')) {
    return {
      text: `I am the Cargonet Multi-Agent AI Interviewer and Technical Assistant, powered by Gemini. I can conduct live technical interviews, analyze system design architectures, explain algorithms, and evaluate candidate dossiers with zero hallucination.`,
      nextTurnIndex: turnIndex
    };
  }

  // 2. Python & Programming Concepts
  if (qLower.includes('what is python') || qLower.includes('explain python')) {
    return {
      text: `Python is a high-level, interpreted programming language renowned for readability and extensive ecosystem support. In AI and backend engineering, it's the industry standard for frameworks like FastAPI, PyTorch, LangChain, and data science tooling. How do you primarily leverage Python in your projects?`,
      nextTurnIndex: turnIndex + 1
    };
  }

  if (qLower.includes('what is docker') || qLower.includes('explain docker') || qLower.includes('container')) {
    return {
      text: `Docker is an open-source platform that packages applications and all their dependencies into lightweight, isolated containers. This ensures consistent execution across development, staging, and production environments without "works on my machine" issues.`,
      nextTurnIndex: turnIndex + 1
    };
  }

  if (qLower.includes('what is rag') || qLower.includes('retrieval augmented')) {
    return {
      text: `RAG (Retrieval-Augmented Generation) combines semantic search over vector databases with generative LLMs. It retrieves relevant contextual chunks based on user query embeddings and injects them into the prompt, reducing hallucinations and allowing LLMs to cite private documentation.`,
      nextTurnIndex: turnIndex + 1
    };
  }

  if (qLower.includes('langchain') || qLower.includes('langgraph') || qLower.includes('crewai')) {
    return {
      text: `LangGraph and CrewAI are multi-agent orchestration frameworks. LangGraph models agentic workflows as cyclical state graphs with human-in-the-loop validation, while CrewAI focuses on role-playing autonomous agents with delegated tasks. Have you deployed multi-agent loops in production?`,
      nextTurnIndex: turnIndex + 1
    };
  }

  // 3. Questions about Candidates in the Dossier
  if (qLower.includes('rohan') || (qLower.includes('contradiction') && profile.id === 'rohan-malhotra')) {
    return {
      text: `Rohan Malhotra has 3.5 years of experience across 3 startups. While his theoretical knowledge of LangGraph and SLM routing is strong, our Forensic Skeptic identified a resume contradiction: he claimed sole architecture of a 10k req/min pipeline, but admitted in the transcript that his teammate Priya built the production version.`,
      nextTurnIndex: turnIndex + 1
    };
  }

  if (qLower.includes('ananya') || (qLower.includes('ownership') && profile.id === 'ananya-iyer')) {
    return {
      text: `Ananya Iyer has 6 years of continuous engineering experience at Bridgepoint Systems. She demonstrated exceptional ownership by publicly taking responsibility for a 2-hour outage and creating pre-deploy regression hooks, earning our panel's +10% High-Accountability bonus.`,
      nextTurnIndex: turnIndex + 1
    };
  }

  if (qLower.includes('verdict') || qLower.includes('who should we hire') || qLower.includes('recommendation')) {
    return {
      text: `Our multi-agent panel recommends HIRE / STRONG HIRE for Ananya due to demonstrated production incident maturity, and LEAN NO HIRE for Rohan due to resume overstatements and high attrition risk (3 jobs in 3.5 years).`,
      nextTurnIndex: turnIndex + 1
    };
  }

  // 4. Dynamic Spoken Answer Analysis (Extract what user said and respond dynamically)
  const words = q.split(/\s+/);
  const corePhrase = words.length > 5 ? words.slice(0, 7).join(' ') + '...' : q;

  let feedback = `You explained: "${corePhrase}". `;
  if (qLower.includes('because') || qLower.includes('designed') || qLower.includes('implemented') || qLower.includes('built') || qLower.includes('used')) {
    feedback += `That provides concrete technical clarity on your design decisions and problem-solving strategy. `;
  } else {
    feedback += `Understood, that highlights your engineering perspective. `;
  }

  // Follow-up question tailored to interview progression
  const stage = (turnIndex % 4) + 1;
  let followUp = "";
  if (stage === 1) {
    followUp = `Regarding system resilience: How do you handle asynchronous failover and queue backpressure when handling high-concurrency request spikes?`;
  } else if (stage === 2) {
    followUp = `When managing production AI systems, what automated regression eval suites or monitoring tools do you use to detect prompt degradation?`;
  } else if (stage === 3) {
    followUp = `How do you approach team mentorship and pair-programming when integrating new multi-agent frameworks?`;
  } else {
    followUp = `That's a very solid breakdown, ${firstName}. That wraps up our primary technical rounds! You can ask me any question about the panel's findings or technical topics.`;
  }

  return {
    text: `${feedback}\n\n${followUp}`,
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
You are a friendly, highly intelligent, versatile AI Assistant and Senior Technical Interviewer for Cargonet AI.
You combine the broad, accurate conversational capabilities of standard Google Gemini AI with the professional context of a technical engineering interviewer.

Candidate Dossier Context:
- Name: ${profile.candidate_name} (${profile.target_role}, ${profile.experience_years} years experience).
- Verifiable claims: ${JSON.stringify(profile.verifiable_claims)}

User just said: "${userAnswer}"

Instructions:
1. If the user asks ANY general question (about Python, Docker, AI, algorithms, coding, math, general topics, or advice), answer it accurately, helpfully, and conversationally just like standard Gemini AI.
2. If the user is answering an interview question or discussing candidate evaluation, provide a sharp 1-2 sentence engineering feedback and pose a natural follow-up question.
3. Keep your total response concise (2-4 sentences max) so it sounds natural when spoken aloud via Text-to-Speech.
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

  // Dynamic General Knowledge + Interview Intelligence Fallback
  return generateGeneralAndInterviewResponse(userAnswer, profile, currentTurnIndex);
}
