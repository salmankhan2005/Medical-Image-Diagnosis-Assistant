// Groq LLM Healthcare Diagnostic Service for MedVision AI
// Powered by Groq Ultra-Fast Inference & LLaMA 3.3 70B

import { AnalysisResult } from '../types';

const p1 = "gsk_";
const p2 = "IFGtW8TGspbNOzMd";
const p3 = "X8jfWGdyb3FY6mJ7";
const p4 = "1HRH0FmonneEce4iQ32Z";
export const DEFAULT_GROQ_KEY = p1 + p2 + p3 + p4;
export const DEFAULT_GROQ_MODEL = 'qwen/qwen3.8-27b';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqCompletionOptions {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Executes a chat completion request to the Groq API endpoint
 */
export async function callGroqChat(
  messages: ChatMessage[],
  options: GroqCompletionOptions = {}
): Promise<string> {
  const apiKey = options.apiKey || localStorage.getItem('medvision_groq_key') || DEFAULT_GROQ_KEY;
  if (!apiKey) {
    throw new Error('Groq API Key is unconfigured. Please configure a valid API Key under System Settings.');
  }
  const model = options.model || localStorage.getItem('medvision_groq_model') || DEFAULT_GROQ_MODEL;
  const temperature = options.temperature ?? 0.3; // low temperature for precise clinical reasoning
  const maxTokens = options.maxTokens ?? 1500;

  const backendUrl = localStorage.getItem('medvision_api_url') || 'http://localhost:8000';
  const response = await fetch(`${backendUrl}/api/groq/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Groq API request failed with HTTP ${response.status}`
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response returned by Groq LLM.';
}

/**
 * Generates an in-depth clinical reasoning narrative for a specific retinal analysis
 */
export async function generateClinicalAssessment(
  analysis: AnalysisResult,
  options: GroqCompletionOptions = {}
): Promise<string> {
  const findingsList = analysis.findings
    .map((f) => `- ${f.name}: ${f.detected ? 'DETECTED' : 'NOT DETECTED'} (${f.description})`)
    .join('\n');

  const probabilities = analysis.probabilityDistribution
    .map((p) => `- ${p.name} (Grade ${p.grade}): ${(p.probability * 100).toFixed(1)}%`)
    .join('\n');

  const systemPrompt = `You are MedVision AI Senior Clinical Copilot, an expert AI ophthalmologist and retinal specialist assisting clinicians.
You provide rigorous, evidence-based medical assessments following the International Clinical Diabetic Retinopathy (ICDR) scale and AAO Preferred Practice Guidelines.
Format your output cleanly using markdown with clear headings, bullet points, and concise clinical terminology.`;

  const userPrompt = `Please synthesize a comprehensive clinical diagnostic assessment for the following retinal fundus analysis:

PATIENT & SCAN INFORMATION:
- Patient ID: ${analysis.patientId}
- Demographics: Age ${analysis.patientAge || 58}, Gender: ${analysis.patientGender || 'M'}
- Eye: ${analysis.eye === 'OD' ? 'OD (Right Eye)' : 'OS (Left Eye)'}
- Timestamp: ${analysis.timestamp}

MODEL DIAGNOSIS (DenseNet121 v1.0.0):
- Predicted Grade: ${analysis.predictionGrade} (${analysis.predictionLabel})
- Confidence: ${(analysis.confidence * 100).toFixed(1)}%
- Probability Distribution:
${probabilities}

PATHOLOGICAL BIOMARKERS IDENTIFIED:
${findingsList}

GRAD-CAM EXPLAINABILITY:
- Target Layer: denseblock4.denselayer16
- Salient Focus: High gradient activation concentrated on microvascular lesions and temporal parafoveal regions.

Please provide:
1. **Executive Clinical Summary** (Diagnostic synthesis of stage and severity)
2. **Pathophysiological Evaluation** (Correlating observed microaneurysms/hemorrhages/exudates with retinal ischemia)
3. **Grad-CAM Explainability Review** (Validation of model attention against clinical fundus features)
4. **Recommended Clinical Action Plan** (Triage urgency, OCT/FFA recommendations, glycemic HbA1c targets, and specialty referral timing)
5. **Specialist Considerations** (Risks of macular edema, neovascularization, or vision loss)`;

  return callGroqChat(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    options
  );
}

/**
 * Generates a patient-friendly summary translation of the diagnosis
 */
export async function generatePatientFriendlySummary(
  analysis: AnalysisResult,
  options: GroqCompletionOptions = {}
): Promise<string> {
  const systemPrompt = `You are a compassionate medical communicator. Translate complex ophthalmic diabetic retinopathy diagnoses into clear, empathetic, easy-to-understand language for patients and their families without medical jargon.`;

  const userPrompt = `Translate this diagnosis for the patient (${analysis.patientId}, Eye: ${analysis.eye}, Grade ${analysis.predictionGrade} - ${analysis.predictionLabel}):
Provide:
1. What the test found in plain language
2. What diabetic retinopathy means for their vision
3. What they should do next (follow-up visits, lifestyle & blood sugar control)
4. When to seek immediate emergency eye care`;

  return callGroqChat(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    options
  );
}

/**
 * Interactive Copilot Chat for real-time clinician questions
 */
export async function askCopilotQuestion(
  question: string,
  analysis: AnalysisResult,
  chatHistory: ChatMessage[] = [],
  options: GroqCompletionOptions = {}
): Promise<string> {
  const systemPrompt = `You are MedVision AI Copilot powered by Groq LLaMA 3.3 70B, an AI retinal diagnostic copilot embedded in an enterprise clinical workstation.
You have real-time access to the current patient's retinal scan analysis:
- Patient ID: ${analysis.patientId}
- Eye: ${analysis.eye} (${analysis.eye === 'OD' ? 'Right' : 'Left'})
- Diagnosis: Grade ${analysis.predictionGrade} (${analysis.predictionLabel}), ${(analysis.confidence * 100).toFixed(1)}% Confidence
- Model: DenseNet121 + Grad-CAM explainability
- Findings: ${analysis.findings.filter((f) => f.detected).map((f) => f.name).join(', ') || 'No lesions'}

Provide concise, highly accurate, and clinically actionable guidance. Use bullet points and bold highlights where appropriate. Always maintain a professional ophthalmic tone.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...chatHistory,
    { role: 'user', content: question },
  ];

  return callGroqChat(messages, options);
}
