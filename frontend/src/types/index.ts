export type DRGrade = 0 | 1 | 2 | 3 | 4;

export interface DRClassInfo {
  grade: DRGrade;
  name: string;
  shortName: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe' | 'proliferative';
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  clinicalAction: string;
}

export interface PathologicalFinding {
  id: string;
  name: string;
  detected: boolean;
  confidence: number;
  location?: string;
  description: string;
}

export interface ProbabilityDistribution {
  grade: DRGrade;
  name: string;
  probability: number; // 0 to 1
  color: string;
}

export interface AnalysisResult {
  id: string;
  patientId: string;
  patientAge?: number;
  patientGender?: 'M' | 'F' | 'Other';
  eye: 'OD' | 'OS'; // Right eye vs Left eye
  imageName: string;
  imageUrl: string;
  gradcamUrl: string;
  overlayUrl: string;
  predictionGrade: DRGrade;
  predictionLabel: string;
  confidence: number; // e.g. 0.942
  probabilityDistribution: ProbabilityDistribution[];
  findings: PathologicalFinding[];
  inferenceTimeMs: number;
  modelName: string;
  modelVersion: string;
  timestamp: string;
  status: 'Completed' | 'Processing' | 'Failed';
  recommendations: string[];
  notes?: string;
  reviewedByDoctor?: boolean;
  doctorNotes?: string;
}

export interface ModelMetricData {
  name: string;
  value: number;
  benchmark: number;
  status: 'optimal' | 'warning' | 'normal';
  description: string;
}

export interface TelemetryPoint {
  time: string;
  latencyMs: number;
  volume: number;
  accuracy: number;
  gpuUsage: number;
  vramMb: number;
}

export interface ModelTelemetry {
  version: string;
  status: 'Online' | 'Calibrating' | 'Offline';
  uptimePercentage: number;
  avgLatencyMs: number;
  analysesToday: number;
  totalAnalyses: number;
  accuracy: number;
  aucRoc: number;
  f1Score: number;
  precision: number;
  recall: number;
  specificity: number;
  historicalTelemetry: TelemetryPoint[];
}

export type ActiveTab = 
  | 'dashboard' 
  | 'upload' 
  | 'analysis' 
  | 'explainability' 
  | 'history' 
  | 'reports' 
  | 'monitoring' 
  | 'settings';

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
