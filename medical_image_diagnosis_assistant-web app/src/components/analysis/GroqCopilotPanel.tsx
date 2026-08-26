import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  RefreshCw,
  Copy,
  Check,
  Bot,
  User,
  Zap,
  FileText,
  HeartHandshake,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { AnalysisResult } from '../../types';
import {
  generateClinicalAssessment,
  generatePatientFriendlySummary,
  askCopilotQuestion,
  ChatMessage,
  DEFAULT_GROQ_MODEL,
} from '../../services/groqService';

const parseInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-brand-text">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const renderMarkdown = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Headings
        if (trimmed.startsWith('### ')) {
          return <h4 key={idx} className="text-xs font-extrabold text-brand-indigo uppercase tracking-wider mt-3 mb-1.5">{parseInline(trimmed.substring(4))}</h4>;
        }
        if (trimmed.startsWith('## ')) {
          return <h3 key={idx} className="text-sm font-black text-brand-text mt-4 mb-2">{parseInline(trimmed.substring(3))}</h3>;
        }
        if (trimmed.startsWith('# ')) {
          return <h2 key={idx} className="text-base font-black text-brand-indigo mt-5 mb-2.5">{parseInline(trimmed.substring(2))}</h2>;
        }

        // List item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-3 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo shrink-0 mt-1.5" />
              <span className="text-xs text-brand-text leading-relaxed font-normal">{parseInline(trimmed.substring(2))}</span>
            </div>
          );
        }

        // Numbered list item
        const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-3 mb-1">
              <span className="font-bold text-brand-indigo shrink-0 text-xs">{numMatch[1]}.</span>
              <span className="text-xs text-brand-text leading-relaxed font-normal">{parseInline(numMatch[2])}</span>
            </div>
          );
        }

        // Paragraph
        return (
          <p key={idx} className="text-xs text-brand-text leading-relaxed font-normal mb-1.5">
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
};

interface GroqCopilotPanelProps {
  analysis: AnalysisResult;
}

export const GroqCopilotPanel: React.FC<GroqCopilotPanelProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'patient' | 'chat'>('assessment');
  const [assessmentText, setAssessmentText] = useState<string>('');
  const [patientText, setPatientText] = useState<string>('');
  const [isLoadingAssessment, setIsLoadingAssessment] = useState<boolean>(false);
  const [isLoadingPatient, setIsLoadingPatient] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-generate clinical assessment on initial mount or analysis change
  useEffect(() => {
    handleGenerateAssessment();
  }, [analysis.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleGenerateAssessment = async () => {
    setIsLoadingAssessment(true);
    try {
      const response = await generateClinicalAssessment(analysis);
      setAssessmentText(response);
    } catch (err: any) {
      setAssessmentText(
        `⚠️ Failed to generate assessment via Groq: ${err.message || 'Network error'}. Please check your API key.`
      );
    } finally {
      setIsLoadingAssessment(false);
    }
  };

  const handleGeneratePatientSummary = async () => {
    if (patientText) return;
    setIsLoadingPatient(true);
    try {
      const response = await generatePatientFriendlySummary(analysis);
      setPatientText(response);
    } catch (err: any) {
      setPatientText(`⚠️ Error generating patient summary: ${err.message}`);
    } finally {
      setIsLoadingPatient(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isSendingChat) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const newHistory: ChatMessage[] = [...chatMessages, { role: 'user', content: userText }];
    setChatMessages(newHistory);
    setIsSendingChat(true);

    try {
      const reply = await askCopilotQuestion(userText, analysis, chatMessages);
      setChatMessages([...newHistory, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setChatMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: `⚠️ Groq Copilot Error: ${err.message || 'Could not connect to Groq API.'}`,
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickQuestions = [
    'What are the urgent referral criteria for this stage?',
    'Should an Optical Coherence Tomography (OCT) be ordered?',
    'What is the risk of macular edema in this eye?',
    'Compare Anti-VEGF vs Panretinal Photocoagulation for this grade.',
  ];

  return (
    <div className="bg-white rounded-bento-lg border border-brand-indigo/30 p-6 shadow-bento-glow relative overflow-hidden flex flex-col gap-5">
      {/* Top Banner with Groq Branding */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-brand-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-indigo via-brand-purple to-pink-500 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-brand-text tracking-tight">
                AI Clinical Copilot
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-brand-purple bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3 fill-brand-purple" /> GROQ LLaMA 3.3 70B
              </span>
            </div>
            <p className="text-xs text-brand-text-muted">
              Real-time ophthalmic reasoning & decision support for {analysis.patientId}
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-brand-subsurface p-1 rounded-xl border border-brand-border text-xs">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'assessment'
                ? 'bg-white text-brand-indigo shadow-xs'
                : 'text-brand-text-muted hover:text-brand-text'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Clinical Narrative</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('patient');
              handleGeneratePatientSummary();
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'patient'
                ? 'bg-white text-brand-indigo shadow-xs'
                : 'text-brand-text-muted hover:text-brand-text'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Patient Letter</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-white text-brand-indigo shadow-xs'
                : 'text-brand-text-muted hover:text-brand-text'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Live Q&A</span>
            {chatMessages.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-brand-indigo" />
            )}
          </button>
        </div>
      </div>

      {/* 1. Clinical Assessment Tab */}
      {activeTab === 'assessment' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-text flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-indigo" />
              Automated Doctor-Grade Clinical Evaluation
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyText(assessmentText)}
                disabled={isLoadingAssessment || !assessmentText}
                className="p-1.5 text-xs text-brand-text-muted hover:text-brand-indigo rounded-lg border border-brand-border hover:bg-brand-subsurface transition-colors flex items-center gap-1 font-medium"
                title="Copy Assessment"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleGenerateAssessment}
                disabled={isLoadingAssessment}
                className="p-1.5 text-xs text-brand-text-muted hover:text-brand-indigo rounded-lg border border-brand-border hover:bg-brand-subsurface transition-colors flex items-center gap-1 font-medium"
                title="Regenerate Assessment"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAssessment ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          <div className="bg-brand-subsurface/70 rounded-2xl p-5 border border-brand-border text-xs text-brand-text leading-relaxed max-h-96 overflow-y-auto font-normal prose-sm">
            {isLoadingAssessment ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-brand-indigo">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="font-semibold text-xs animate-pulse">
                  Synthesizing clinical findings via Groq LLaMA 3.3 70B (under 1 second)...
                </span>
              </div>
            ) : (
              <div className="font-sans space-y-1">
                {renderMarkdown(assessmentText)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Patient-Friendly Translation Tab */}
      {activeTab === 'patient' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-text flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              Patient Communication & Care Guidance
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyText(patientText)}
                disabled={isLoadingPatient || !patientText}
                className="p-1.5 text-xs text-brand-text-muted hover:text-brand-indigo rounded-lg border border-brand-border hover:bg-brand-subsurface transition-colors flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleGeneratePatientSummary}
                disabled={isLoadingPatient}
                className="p-1.5 text-xs text-brand-text-muted hover:text-brand-indigo rounded-lg border border-brand-border hover:bg-brand-subsurface transition-colors flex items-center gap-1 font-medium"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPatient ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          <div className="bg-emerald-50/40 rounded-2xl p-5 border border-emerald-200/60 text-xs text-brand-text leading-relaxed max-h-96 overflow-y-auto">
            {isLoadingPatient ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-emerald-600">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="font-semibold text-xs animate-pulse">
                  Drafting empathetic patient translation...
                </span>
              </div>
            ) : (
              <div className="font-sans space-y-1">
                {renderMarkdown(patientText)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Interactive Live Chat Q&A Tab */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          {/* Quick Prompts Suggestions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-brand-text-muted shrink-0">
              Suggested:
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputQuery(q);
                }}
                className="px-2.5 py-1 rounded-lg bg-brand-subsurface hover:bg-indigo-50 hover:text-brand-indigo border border-brand-border text-[11px] font-medium text-brand-text-muted shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="bg-brand-subsurface/60 rounded-2xl p-4 border border-brand-border h-72 overflow-y-auto space-y-3">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-brand-text-muted space-y-2">
                <Bot className="w-8 h-8 text-brand-indigo/60" />
                <p className="text-xs font-semibold">
                  Ask Groq Copilot any clinical or pharmacological question regarding this scan.
                </p>
                <p className="text-[11px] text-brand-text-dim max-w-sm">
                  Trained on ophthalmic clinical guidelines and powered by ultra-low-latency Groq hardware.
                </p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-brand-indigo text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-brand-indigo text-white rounded-tr-xs'
                        : 'bg-white border border-brand-border text-brand-text rounded-tl-xs shadow-xs whitespace-pre-wrap'
                    }`}
                  >
                    {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-brand-text text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      MD
                    </div>
                  )}
                </div>
              ))
            )}
            {isSendingChat && (
              <div className="flex items-center gap-2 text-xs text-brand-indigo font-semibold py-1 animate-pulse">
                <Bot className="w-4 h-4 animate-bounce" />
                <span>Groq Copilot is reasoning...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about lesions, treatment timeline, laser options, HbA1c targets..."
              className="flex-1 px-4 py-2.5 bg-brand-subsurface border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-text-muted focus:outline-none focus:border-brand-indigo focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isSendingChat}
              className="px-4 py-2.5 bg-brand-indigo hover:bg-brand-indigo-dark disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
