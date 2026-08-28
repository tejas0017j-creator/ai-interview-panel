import { CandidateProfile } from '../types';

export const SAMPLE_JOB_DESCRIPTION = `
Role Overview: Cargonet AI Engineer
Core Responsibilities: The position requires improving a live multi-agent AI system (including a planner, executor, and reviewer) that automates freight operations like quoting, booking, and document processing.
Technical Stack & Workflow: The engineer will direct AI coding tools like Claude Code rather than exclusively writing code manually, while working with a Python backend, MongoDB, and a React.js frontend.
Key Expectations: The company emphasizes long-term ownership, requiring candidates to handle real production failures, integrate OCR and APIs, and refine RAG/vector searches without treating it as a "build it once and move on" project.
`;

export const SAMPLE_CANDIDATE_ROHAN: CandidateProfile = {
  id: 'rohan-malhotra',
  candidate_name: 'Rohan Malhotra',
  target_role: 'Senior AI / Backend Engineer',
  experience_years: 3.5,
  skills_declared: ['Python', 'LangGraph', 'CrewAI', 'Pinecone', 'FAISS', 'FastAPI', 'Multi-Agent Routing', 'Model Routing'],
  verifiable_claims: [
    {
      claim_text: "Designed multi-agent exception-handling engine reducing manual review time by 40% and inference costs by 30%.",
      source_document: "Resume",
      source_context: "Resume line 14: 'Architected and implemented multi-agent exception-handling engine reducing manual freight review by 40% and inference costs by 30% through intelligent GPT-4/SLM routing.'"
    },
    {
      claim_text: "Sole architect of the production exception-handling system at Voltrix Logistics Tech.",
      source_document: "Resume",
      source_context: "Resume line 12: 'Sole architect of enterprise multi-agent pipeline handling 10k requests/min.'"
    },
    {
      claim_text: "Admitted during interview that resume claim of 'sole architect' was an exaggeration.",
      source_document: "Transcript",
      source_context: "Transcript [00:14:22] Rohan: 'To be completely honest, claiming sole architect on my resume was a bit strong. I led the architectural blueprint and prompt design, but my teammate Priya built out most of the actual production pipeline and error handling.'"
    },
    {
      claim_text: "Held 3 jobs across 3.5 years primarily chasing salary and titles.",
      source_document: "Transcript",
      source_context: "Transcript [00:28:10] Rohan: 'My moves between the three startups in 3.5 years were driven mostly by compensation bumps and senior title upgrades rather than project completions.'"
    },
    {
      claim_text: "Has not handled high-volume production incident outages due to low user base.",
      source_document: "Transcript",
      source_context: "Transcript [00:36:45] Rohan: 'I am okay with being on-call, but truth is Voltrix had a small pilot user base, so we never really experienced high-severity midnight outage spikes or cascading queue failures.'"
    }
  ],
  admitted_gaps: [
    "Overstated architectural ownership on resume",
    "Short tenures across multiple companies (job hopping)",
    "Unproven in high-incident production scale environments"
  ],
  ownership_evidence: [
    "Willing to be on-call, but untested under real incident pressure"
  ],
  raw_resume_text: `Rohan Malhotra - Senior AI / Backend Engineer
Education: B.Tech in Computer Science (2022)
Experience: 3.5 Years across 3 logistics & AI tech startups (Voltrix Logistics Tech, NovaRoute, ApexData).
Key Accomplishments:
- Sole architect of enterprise multi-agent pipeline handling 10k requests/min.
- Designed multi-agent exception-handling engine reducing manual review time by 40% and inference costs by 30% via SLM/GPT-4 routing.
- Technologies: Python, LangGraph, CrewAI, Pinecone, FAISS, FastAPI, Docker.`,
  raw_transcript_text: `Interview Transcript - Rohan Malhotra (Cargonet AI Engineer Interview)
Interviewer: Let's discuss your work at Voltrix. You mentioned being the sole architect of the multi-agent exception system.
Rohan [00:14:22]: To be completely honest, claiming sole architect on my resume was a bit strong. I led the architectural blueprint and prompt design, but my teammate Priya built out most of the actual production pipeline and error handling.
Interviewer: How do you handle production incidents and on-call rotations?
Rohan [00:36:45]: I am okay with being on-call, but truth is Voltrix had a small pilot user base, so we never really experienced high-severity midnight outage spikes or cascading queue failures.
Interviewer: What guided your career transitions over the last 3.5 years?
Rohan [00:28:10]: My moves between the three startups in 3.5 years were driven mostly by compensation bumps and senior title upgrades rather than project completions.`
};

export const SAMPLE_CANDIDATE_ANANYA: CandidateProfile = {
  id: 'ananya-iyer',
  candidate_name: 'Ananya Iyer',
  target_role: 'Cargonet AI Engineer',
  experience_years: 6.0,
  skills_declared: ['Python', 'LangChain', 'ChromaDB', 'PostgreSQL', 'MongoDB', 'FastAPI', 'RAG', 'Eval Pipelines', 'Docker'],
  verifiable_claims: [
    {
      claim_text: "Spent 6 consecutive years at Bridgepoint Systems, transitioning from traditional backend to AI engineering.",
      source_document: "Resume",
      source_context: "Resume line 8: 'Bridgepoint Systems (2019 - Present): Software Engineer -> Senior Software & AI Engineer. 6 years continuous tenure.'"
    },
    {
      claim_text: "Built single-agent RAG support-ticket assistant with 40% estimated accuracy improvement.",
      source_document: "Resume",
      source_context: "Resume line 15: 'Developed internal RAG assistant using LangChain and Chroma, boosting support resolution accuracy by ~40%.'"
    },
    {
      claim_text: "Transparent that 40% metric was based on internal spot-checks, not formal benchmarks.",
      source_document: "Transcript",
      source_context: "Transcript [00:11:05] Ananya: 'I want to clarify the 40% accuracy number on my CV—it was measured through structured weekly spot-checks on 150 customer tickets rather than an automated offline eval benchmark suite.'"
    },
    {
      claim_text: "Openly acknowledged lack of production experience with complex multi-agent frameworks.",
      source_document: "Transcript",
      source_context: "Transcript [00:19:40] Ananya: 'I have not deployed multi-agent orchestrations like LangGraph or CrewAI in production yet. My AI experience is single-agent RAG. I am ready to ramp up by studying your code and pairing on PRs from day one.'"
    },
    {
      claim_text: "Took full accountability for a 2-hour production outage caused by an untested prompt change.",
      source_document: "Transcript",
      source_context: "Transcript [00:32:15] Ananya: 'Last year I pushed an untested prompt change directly that corrupted support answers for 2 hours. In the retrospective, I took full public responsibility, wrote the root-cause postmortem, and instituted a mandatory pre-deploy evaluation test set with a git-hook checklist.'"
    }
  ],
  admitted_gaps: [
    "No prior production deployment with multi-agent orchestration frameworks (CrewAI/LangGraph)",
    "RAG metrics were calculated via spot-checks rather than automated CI/CD eval harnesses"
  ],
  ownership_evidence: [
    "High accountability: publicly owned a 2-hour outage and authored postmortem",
    "Systemic problem solver: engineered pre-deploy checklists to prevent repeat failures",
    "6-year continuous tenure demonstrating deep loyalty and long-term ownership"
  ],
  raw_resume_text: `Ananya Iyer - Software & AI Engineer
Education: B.E. in Information Technology (2019)
Experience: 6 Years at Bridgepoint Systems (2019 - Present)
Key Accomplishments:
- Transitioned core backend services from monolith to microservices with Python and MongoDB.
- Developed internal RAG assistant using LangChain and Chroma, boosting support resolution accuracy by ~40%.
- Established automated CI testing and pre-deploy regression suites for engineering team.`,
  raw_transcript_text: `Interview Transcript - Ananya Iyer (Cargonet AI Engineer Interview)
Interviewer: Let's talk about the accuracy metric on your RAG assistant.
Ananya [00:11:05]: I want to clarify the 40% accuracy number on my CV—it was measured through structured weekly spot-checks on 150 customer tickets rather than an automated offline eval benchmark suite.
Interviewer: Have you worked with multi-agent frameworks like LangGraph or CrewAI?
Ananya [00:19:40]: I have not deployed multi-agent orchestrations like LangGraph or CrewAI in production yet. My AI experience is single-agent RAG. I am ready to ramp up by studying your code and pairing on PRs from day one.
Interviewer: Tell me about a time you made a critical mistake in production.
Ananya [00:32:15]: Last year I pushed an untested prompt change directly that corrupted support answers for 2 hours. In the retrospective, I took full public responsibility, wrote the root-cause postmortem, and instituted a mandatory pre-deploy evaluation test set with a git-hook checklist.`
};
