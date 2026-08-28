# ⚡ Cargonet AI — Multi-Agent AI Interview Panel Simulator

An autonomous, production-ready multi-agent candidate evaluation platform built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Google Gemini Flash**. 

Instead of simplistic keyword matching or flat score averages, Cargonet AI deploys **4 specialized AI agents in parallel isolation**, subjects claims to a **forensic cross-examination debate arena**, applies **non-averaging mathematical multipliers**, and features an interactive **2-Way Live Voice & Camera Mock Interview Simulator**.

---

## 🌟 Key Features

### 1. 🤖 4 Parallel Specialized AI Agents
- **Technical Lead:** Evaluates architecture depth, SLM vs GPT-4 model routing, and vector store knowledge.
- **HR & Cultural Alignment Lead:** Analyzes intellectual honesty, candor regarding past mistakes, and job-hopping flight risk.
- **Hiring Manager:** Assesses day-one autonomy, long-term product ownership, and mission-critical incident readiness.
- **Forensic Skeptic:** Fact-checks resume claims against verbatim interview transcript admissions to actively detect exaggerations and fabricated metrics.

### 2. 🛡️ Strict Zero-Hallucination Grounding Rule
Every score, strength, and concern **must cite an exact verbatim quote** from the candidate's resume or interview transcript.

### 3. ⚔️ Live Cross-Examination Debate Arena
- The **Forensic Skeptic** challenges peer agent conclusions using transcript quotes.
- If a candidate admitted to an unverified claim (e.g., claiming to be the *sole architect* when a teammate built the production pipeline), peer agents dynamically adjust scores with real-time **Stance-Shift tracking**.
- Built-in **Text-to-Speech audio** allows listening to every agent's debate argument.

### 4. 📐 Non-Averaging Mathematical Synthesis Matrix
Calculates the final hiring verdict using domain weighting (Tech 40%, HM 40%, HR 20%) combined with non-averaging multiplier penalties:
- **-15% Contradiction Penalty:** Applied when resume exaggerations or contradictions are identified.
- **+10% High-Accountability Bonus:** Applied when candidates demonstrate proven incident leadership and postmortem ownership.

### 5. 🎙️ 2-Way Interactive Live AI Mock Interview (Voice + Text + Camera)
- **AI Speaks Questions Aloud:** Greets the candidate by name and presents technical interview questions in voice and text.
- **Answer in Voice or Text:** Respond via microphone (Speech-to-Text) or by typing.
- **Live Video HUD:** Real-time hardware webcam stream with an automatic animated Biometric HUD canvas fallback.
- **AI Evaluates & Advances:** AI evaluates your response and immediately speaks the next technical follow-up question.

### 6. 🎨 Aesthetic Classic & Luxury Dark/Light Mode
- **Typography:** Playfair Display, Cormorant Garamond, and Plus Jakarta Sans.
- **Palette:** Signature Electric Green / Emerald accents with theme toggle.
- **No Private Keys Exposed:** Runs seamlessly with zero user-facing key prompts.

---

## 🏗️ Architecture & Pipeline Flow

```
[Candidate Dossier: Resume & Transcript Quotes]
                      │
      ┌───────────────┼───────────────┬───────────────┐
      ▼               ▼               ▼               ▼
[Technical Lead] [HR/Culture]   [Hiring Manager]  [Forensic Skeptic]
   (Score 1-10)    (Score 1-10)     (Score 1-10)    (Audit & Quotes)
      └───────────────┬───────────────┴───────────────┘
                      │
                      ▼
   [Phase 3: Multi-Turn Cross-Examination Arena]
   (Skeptic Challenges ➔ Dynamic Stance-Shifts Logged)
                      │
                      ▼
   [Phase 4: Mathematical Decision Synthesis]
   • Domain Weights (Tech 40%, HM 40%, HR 20%)
   • Contradiction Penalty (-15%) & Accountability Bonus (+10%)
                      │
                      ▼
   [Final Verdict: STRONG HIRE / HIRE / LEAN NO HIRE / STRONG NO HIRE]
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18.0 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/tejas0017j-creator/ai-interview-panel.git
cd ai-interview-panel
```

### 2. Install Dependencies
```bash
npm install
```

### 3. (Optional) Configure Gemini API Key
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(If omitted, the platform automatically runs with grounded evaluation engines).*

### 4. Start Local Development Server
```bash
npm run dev
```
Open **[http://localhost:3000/](http://localhost:3000/)** in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
ai-interview-panel/
├── src/
│   ├── components/
│   │   ├── assistant/
│   │   │   └── VoiceAndCameraAssistant.tsx   # 2-way Voice & Camera Interview HUD
│   │   ├── dashboard/
│   │   │   ├── AgentCard.tsx                 # 4-Agent Evaluation Cards
│   │   │   ├── CandidateProfileCard.tsx      # Grounded Dossier & Quotes
│   │   │   └── CandidateSelector.tsx         # Target Switcher & Upload
│   │   ├── debate/
│   │   │   └── DebateArena.tsx               # Forensic Cross-Examination Timeline
│   │   ├── decision/
│   │   │   └── DecisionPanel.tsx             # Final Weighted Decision Synthesis
│   │   ├── hero/
│   │   │   └── Hero.tsx                      # Header & 1-Click Pipeline Trigger
│   │   ├── layout/
│   │   │   ├── BackgroundOrbs.tsx            # Ambient Drifting Orbs
│   │   │   ├── Footer.tsx                    # Footer with Social Links
│   │   │   └── Navbar.tsx                    # Theme Toggle & Links
│   │   └── marquee/
│   │       └── MarqueeRibbon.tsx             # Feature Marquee Strip
│   ├── data/
│   │   └── sampleCandidates.ts               # Rohan Malhotra & Ananya Iyer Dossiers
│   ├── services/
│   │   ├── agentEngine.ts                    # Parallel Agent, Debate & Decision Engine
│   │   ├── aiAssistantEngine.ts              # 2-Way Live Interview Engine
│   │   └── gemini.ts                         # Google Generative AI Client & Prompts
│   ├── types/
│   │   └── index.ts                          # TypeScript Definitions
│   ├── App.tsx                               # Master Application Orchestrator
│   ├── index.css                             # Global CSS, Palettes, Dark/Light Mode
│   └── main.tsx                              # React Entry Point
├── index.html                                # HTML Entry with Google Fonts
├── tailwind.config.js                        # Tailwind Configuration
├── tsconfig.json                             # TypeScript Configuration
└── vite.config.ts                            # Vite Bundler Configuration
```

---

## 👤 Author & Connect

**Tejaswa Ghadai**
- **LinkedIn:** [https://www.linkedin.com/in/tejaswa-ghadai-198341295/](https://www.linkedin.com/in/tejaswa-ghadai-198341295/)
- **GitHub:** [https://github.com/tejas0017j-creator](https://github.com/tejas0017j-creator)

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
