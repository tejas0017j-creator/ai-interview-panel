import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  X,
  Bot,
  Sparkles,
  Send,
  Radio,
  Volume2,
  VolumeX,
  CheckCircle,
  Activity,
} from 'lucide-react';
import { CandidateProfile, VoiceMessage } from '../../types';
import { askGeminiInterviewAssistant } from '../../services/aiAssistantEngine';

interface VoiceAndCameraAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: CandidateProfile;
  apiKey: string;
}

export const VoiceAndCameraAssistant: React.FC<VoiceAndCameraAssistantProps> = ({
  isOpen,
  onClose,
  activeProfile,
  apiKey,
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isSimulatedCam, setIsSimulatedCam] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [interimText, setInterimText] = useState('');
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [hasStartedInterview, setHasStartedInterview] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<{ role: string; parts: { text: string }[] }[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<any>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial Welcome + Question 1 on open
  useEffect(() => {
    if (isOpen && !hasStartedInterview) {
      const firstName = activeProfile.candidate_name.split(' ')[0];
      const isRohan = activeProfile.id === 'rohan-malhotra';
      
      const q1 = isRohan
        ? "On your resume, you listed designing a multi-agent exception-handling engine reducing manual review by 40%. Can you walk me through how you routed tasks between GPT-4 and SLMs, and what specific part of the production pipeline you personally built?"
        : "You mentioned building a single-agent RAG support assistant at Bridgepoint Systems that improved accuracy by ~40%. Can you explain how you structured your chunking, embedding retrieval with ChromaDB, and how you validated that accuracy metric?";

      const welcomeText = `Hi ${firstName}! Welcome to your live technical interview for Cargonet AI. I'll be listening to your answers and asking follow-up engineering questions.\n\nLet's begin with Question 1:\n"${q1}"`;

      const welcomeMsg: VoiceMessage = {
        id: `turn-0-${Date.now()}`,
        sender: 'assistant',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages([welcomeMsg]);
      setHasStartedInterview(true);
      setCurrentQuestionIndex(0);

      setTimeout(() => speakText(welcomeText), 600);
    }
  }, [isOpen, hasStartedInterview, activeProfile]);

  // Reset interview state when candidate profile changes
  useEffect(() => {
    setHasStartedInterview(false);
    setCurrentQuestionIndex(0);
    setMessages([]);
    chatHistoryRef.current = [];
  }, [activeProfile.id]);

  // Animated Canvas HUD for Biometric / Camera Fallback
  useEffect(() => {
    if (isOpen && isSimulatedCam && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let frame = 0;
      const render = () => {
        frame++;
        ctx.fillStyle = '#0a0a14';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = 'rgba(200, 255, 87, 0.07)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Facial Landmark Oval
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        ctx.strokeStyle = 'rgba(200, 255, 87, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 60, 80, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Eye tracking reticles
        const eyeOffset = Math.sin(frame * 0.05) * 4;
        ctx.fillStyle = '#c8ff57';
        ctx.beginPath();
        ctx.arc(cx - 25 + eyeOffset, cy - 20, 4, 0, Math.PI * 2);
        ctx.arc(cx + 25 + eyeOffset, cy - 20, 4, 0, Math.PI * 2);
        ctx.fill();

        // Scanning line
        const scanY = (frame * 2) % canvas.height;
        ctx.strokeStyle = 'rgba(200, 255, 87, 0.35)';
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(canvas.width, scanY);
        ctx.stroke();

        // HUD Text
        ctx.font = '10px monospace';
        ctx.fillStyle = '#c8ff57';
        ctx.fillText('BIOMETRIC HUD // CANDIDATE TRACKING', 12, 20);
        ctx.fillText(`CANDIDATE: ${activeProfile.candidate_name.toUpperCase()}`, 12, 35);
        ctx.fillText(`GAZE: OPTIMAL  |  PULSE: 72 BPM`, 12, canvas.height - 15);

        animFrameRef.current = requestAnimationFrame(render);
      };
      render();
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isSimulatedCam, activeProfile]);

  // Real Hardware Webcam Start
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
        setIsSimulatedCam(false);
      } else {
        setIsSimulatedCam(true);
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('Webcam permission blocked. Switching to Biometric HUD simulator:', err);
      setIsSimulatedCam(true);
      setCameraActive(true);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsSimulatedCam(false);
  };

  // Close cleanup
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
    }
  }, [isOpen]);

  // Continuous Speech Recognition (Mic) with Live Real-Time Transcription
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setInputQuery(prev => (prev ? prev + ' ' + finalTranscript.trim() : finalTranscript.trim()));
        }
        setInterimText(interim);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e?.error);
        if (e?.error === 'not-allowed') {
          alert('Microphone access was denied. Please allow microphone permissions in your browser URL bar.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const cleanText = text.replace(/\*\*/g, '').replace(/\[.*?\]/g, '').replace(/#/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v =>
      (v.name.includes('Google') || v.name.includes('Natural')) && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition requires Chrome, Edge, or a Web Speech-compatible browser.');
      return;
    }
    if (isListening) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsListening(false);
      setInterimText('');
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  // Submit Answer -> AI Dynamically Analyzes Exactly What You Said & Asks Next Question
  const handleSendAnswer = async (answerText?: string) => {
    const answer = answerText || (inputQuery + (interimText ? ' ' + interimText : '')).trim();
    if (!answer || isAiThinking) return;

    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsListening(false);
      setInterimText('');
    }

    // 1. Post User Answer
    const userMsg: VoiceMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: answer,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setInterimText('');
    setIsAiThinking(true);

    chatHistoryRef.current.push({ role: 'user', parts: [{ text: answer }] });

    // 2. AI Evaluates & Generates Dynamic Next Question
    const { text: responseText, nextTurnIndex } = await askGeminiInterviewAssistant(
      answer,
      activeProfile,
      apiKey,
      currentQuestionIndex,
      chatHistoryRef.current
    );

    chatHistoryRef.current.push({ role: 'model', parts: [{ text: responseText }] });
    setCurrentQuestionIndex(nextTurnIndex);

    // 3. Post AI Question & Feedback
    const aiMsg: VoiceMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: responseText,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsAiThinking(false);

    // 4. AI Speaks the response aloud in voice
    speakText(responseText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl rounded-2xl border overflow-hidden flex flex-col md:flex-row max-h-[88vh] shadow-2xl"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>

        {/* Left: Camera & Voice Waveform Stream */}
        <div className="w-full md:w-5/12 p-5 border-b md:border-b-0 md:border-r flex flex-col justify-between gap-4"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>

          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="section-label text-xs flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" style={{ color: cameraActive ? 'var(--color-primary)' : 'var(--muted)' }} />
                <span>Candidate Video HUD</span>
              </span>
              <button
                onClick={cameraActive ? stopCamera : startCamera}
                className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                style={{
                  background: cameraActive ? 'rgba(248,113,113,0.1)' : 'var(--bg)',
                  border: `1px solid ${cameraActive ? 'var(--accent3)' : 'var(--border)'}`,
                  color: cameraActive ? 'var(--accent3)' : 'var(--text)',
                }}
              >
                {cameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />}
                <span>{cameraActive ? 'Stop Camera' : 'Start Camera'}</span>
              </button>
            </div>

            {/* Video / Biometric Canvas */}
            <div className="w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center relative"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              
              {/* Hardware Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover scale-x-[-1] ${cameraActive && !isSimulatedCam ? 'block' : 'hidden'}`}
              />

              {/* Simulated Biometric Canvas */}
              <canvas
                ref={canvasRef}
                width={320}
                height={240}
                className={`w-full h-full object-cover ${cameraActive && isSimulatedCam ? 'block' : 'hidden'}`}
              />

              {/* Camera Off Placeholder */}
              {!cameraActive && (
                <div className="text-center p-4" style={{ color: 'var(--muted)' }}>
                  <Camera className="w-8 h-8 mx-auto mb-1.5 opacity-30" />
                  <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>Webcam Off</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                    Click "Start Camera" to enable video feed
                  </p>
                </div>
              )}
            </div>

            {/* Candidate Stage Info */}
            <div className="mt-3.5 p-3 rounded-xl text-xs flex justify-between items-center"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div>
                <span className="text-[10px] font-mono uppercase block" style={{ color: 'var(--muted)' }}>Interviewee</span>
                <div className="font-syne font-bold text-sm" style={{ color: 'var(--text)' }}>
                  {activeProfile.candidate_name}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase block" style={{ color: 'var(--muted)' }}>Round</span>
                <span className="font-mono font-bold text-xs" style={{ color: 'var(--color-primary)' }}>
                  Question {Math.min(currentQuestionIndex + 1, 4)} / 4
                </span>
              </div>
            </div>

            {/* Real-Time Audio Activity Visualizer */}
            {isListening && (
              <div className="mt-3 p-2.5 rounded-xl flex items-center justify-between animate-fadeIn"
                style={{ background: 'rgba(200,255,87,0.1)', border: '1px solid rgba(200,255,87,0.3)' }}>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" style={{ color: 'var(--color-primary)' }} />
                  <span className="text-xs font-medium font-mono" style={{ color: 'var(--color-primary)' }}>
                    Mic Active — Listening...
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-1 h-4 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '450ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Voice Mic Controller */}
          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
                {isListening ? '🔴 Recording voice...' : isSpeaking ? '🔊 AI is speaking...' : 'Tap mic to speak answer'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isListening && (
                <button
                  onClick={() => handleSendAnswer()}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-text-on-primary)' }}
                >
                  Submit Answer ➔
                </button>
              )}
              <button
                onClick={toggleListening}
                className="p-3 rounded-full transition-all"
                style={{
                  background: isListening ? 'rgba(248,113,113,0.15)' : 'rgba(200,255,87,0.1)',
                  border: isListening ? '2px solid var(--accent3)' : '2px solid var(--color-primary)',
                  color: isListening ? 'var(--accent3)' : 'var(--color-primary)',
                  boxShadow: isListening ? '0 0 16px rgba(248,113,113,0.3)' : 'none',
                }}
                title={isListening ? 'Click to stop recording' : 'Click to start speaking'}
              >
                {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Interview Dialogue Stream */}
        <div className="w-full md:w-7/12 p-5 flex flex-col justify-between" style={{ background: 'var(--card)' }}>
          
          {/* Header */}
          <div className="flex justify-between items-center mb-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(200,255,87,0.1)' }}>
                <Bot className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <h4 className="font-syne font-bold text-sm" style={{ color: 'var(--text)' }}>
                  Interactive AI Technical Interviewer
                </h4>
                <span className="text-[10px] font-mono" style={{ color: isSpeaking ? 'var(--color-primary)' : 'var(--muted)' }}>
                  {isAiThinking ? 'Analyzing your answer...' : isSpeaking ? '🔊 Asking Question...' : '● Live 2-Way Session'}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:opacity-80" style={{ background: 'var(--bg)', color: 'var(--muted)' }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dialogue Message Stream */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 min-h-[260px] max-h-[50vh]">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed"
                  style={{
                    background: m.sender === 'user' ? 'rgba(200,255,87,0.1)' : 'var(--surface)',
                    border: `1px solid ${m.sender === 'user' ? 'rgba(200,255,87,0.25)' : 'var(--border)'}`,
                    color: 'var(--text)',
                    borderBottomRightRadius: m.sender === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: m.sender === 'assistant' ? '4px' : '16px',
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1" style={{ color: 'var(--muted)' }}>
                    <span>{m.sender === 'user' ? 'Candidate (You)' : 'AI Interviewer'}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.sender === 'assistant' && (
                    <button
                      onClick={() => speakText(m.text)}
                      className="mt-2 flex items-center gap-1 text-[10px] font-mono transition-colors hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <Volume2 className="w-3 h-3" /> Replay Question in Voice
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Live Real-Time Speech Preview Bubble while speaking */}
            {isListening && interimText && (
              <div className="flex justify-end animate-fadeIn">
                <div className="max-w-[85%] p-3 rounded-2xl text-xs italic border"
                  style={{ background: 'rgba(200,255,87,0.05)', borderColor: 'rgba(200,255,87,0.3)', color: 'var(--text)' }}>
                  <span className="text-[10px] font-mono block not-italic mb-1 opacity-60">Transcribing live voice...</span>
                  "{interimText}"
                </div>
              </div>
            )}

            {isAiThinking && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl text-xs flex items-center gap-2"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--color-primary)' }}>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating answer & formulating follow-up question...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Answer Suggestion Pills */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <button
              onClick={() => handleSendAnswer("I led the prompt engineering & model routing between SLMs and GPT-4, while my teammate implemented the async message queue in production.")}
              className="px-2.5 py-1 rounded-md text-[10px] font-mono transition-colors hover:border-accent1 truncate max-w-[280px]"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              "I led prompt design & SLM routing..."
            </button>
            <button
              onClick={() => handleSendAnswer("We instituted a mandatory pre-deploy evaluation test set with a git-hook checklist to guarantee prompt regression testing.")}
              className="px-2.5 py-1 rounded-md text-[10px] font-mono transition-colors hover:border-accent1 truncate max-w-[280px]"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              "We instituted pre-deploy checklists..."
            </button>
          </div>

          {/* Answer Input Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendAnswer(); }}
            className="flex gap-2 pt-2"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <input
              type="text"
              value={inputQuery + (interimText ? ' ' + interimText : '')}
              onChange={(e) => { setInputQuery(e.target.value); setInterimText(''); }}
              placeholder={isListening ? '🎤 Listening... your voice will appear here live' : 'Type your answer or tap mic to speak...'}
              className="flex-1 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
            <button
              type="submit"
              disabled={isAiThinking || (!inputQuery.trim() && !interimText.trim())}
              className="px-4 py-2.5 rounded-xl transition-all disabled:opacity-30 flex items-center justify-center"
              style={{ background: 'var(--color-primary)', color: 'var(--color-text-on-primary)' }}
              title="Submit your answer to AI interviewer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
