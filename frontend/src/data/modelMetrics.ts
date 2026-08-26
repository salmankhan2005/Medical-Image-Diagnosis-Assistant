import { ModelMetricData, ModelTelemetry, TelemetryPoint } from '../types';

export const PRIMARY_METRICS = {
  totalAnalyses: {
    value: '1,248',
    numeric: 1248,
    change: '+12.5%',
    period: 'vs last month',
    trend: 'up' as const,
    label: 'Total Analyses',
  },
  modelAccuracy: {
    value: '92.4%',
    numeric: 0.924,
    change: '+3.2%',
    period: 'vs benchmark',
    trend: 'up' as const,
    label: 'Model Accuracy',
  },
  aucScore: {
    value: '0.940',
    numeric: 0.940,
    change: '+0.021',
    period: 'AUC-ROC validated',
    trend: 'up' as const,
    label: 'AUC Score',
  },
  avgInferenceTime: {
    value: '1.24s',
    numeric: 1.24,
    change: '-0.30s',
    period: 'latency optimized',
    trend: 'down' as const, // Down is good for latency!
    label: 'Avg Inference Time',
  },
};

export const PREDICTION_DISTRIBUTION = [
  { name: 'No DR', count: 318, percentage: 25.5, color: '#10B981', grade: 0 },
  { name: 'Mild DR', count: 412, percentage: 33.0, color: '#0EA5A9', grade: 1 },
  { name: 'Moderate DR', count: 298, percentage: 23.9, color: '#7C3AED', grade: 2 },
  { name: 'Severe DR', count: 156, percentage: 12.5, color: '#F59E0B', grade: 3 },
  { name: 'Proliferative DR', count: 64, percentage: 5.1, color: '#EF4444', grade: 4 },
];

export const MODEL_PERFORMANCE_METRICS: ModelMetricData[] = [
  { name: 'Accuracy', value: 92.4, benchmark: 85.0, status: 'optimal', description: 'Overall correct classification across all 5 DR grades' },
  { name: 'Precision', value: 89.1, benchmark: 82.0, status: 'optimal', description: 'Positive predictive value for diabetic lesions' },
  { name: 'Recall', value: 90.3, benchmark: 84.0, status: 'optimal', description: 'Sensitivity to referable diabetic retinopathy' },
  { name: 'F1 Score', value: 89.7, benchmark: 83.0, status: 'optimal', description: 'Harmonic mean of precision and recall' },
  { name: 'Specificity', value: 93.2, benchmark: 88.0, status: 'optimal', description: 'True negative rate for healthy fundus images' },
  { name: 'AUC-ROC', value: 94.0, benchmark: 88.0, status: 'optimal', description: 'Area under the receiver operating characteristic curve' },
];

export const MODEL_SPECIFICATIONS = {
  modelName: 'DenseNet121',
  framework: 'PyTorch + MONAI',
  task: 'Diabetic Retinopathy Classification (5-Class)',
  inputSize: '224 × 224 × 3',
  parameters: '6.95 Million',
  weights: 'Pretrained ImageNet + Fine-tuned Aptos & Kaggle DR',
  targetLayer: 'features.denseblock4.denselayer16',
  explainability: 'Grad-CAM (Gradient-weighted Class Activation Mapping)',
  version: 'v1.0.0',
  lastUpdated: 'May 20, 2026',
  license: 'Clinical Research / HIPAA Compliant Sandbox',
};

export const HOURLY_TELEMETRY: TelemetryPoint[] = [
  { time: '08:00', latencyMs: 1210, volume: 24, accuracy: 92.1, gpuUsage: 42, vramMb: 2450 },
  { time: '10:00', latencyMs: 1180, volume: 85, accuracy: 92.8, gpuUsage: 68, vramMb: 3120 },
  { time: '12:00', latencyMs: 1240, volume: 110, accuracy: 92.4, gpuUsage: 78, vramMb: 3450 },
  { time: '14:00', latencyMs: 1190, volume: 145, accuracy: 93.0, gpuUsage: 82, vramMb: 3680 },
  { time: '16:00', latencyMs: 1250, volume: 130, accuracy: 92.2, gpuUsage: 74, vramMb: 3320 },
  { time: '18:00', latencyMs: 1120, volume: 60, accuracy: 92.7, gpuUsage: 51, vramMb: 2800 },
  { time: '20:00', latencyMs: 1090, volume: 32, accuracy: 92.5, gpuUsage: 38, vramMb: 2400 },
];

export const SYSTEM_TELEMETRY: ModelTelemetry = {
  version: 'v1.0.0',
  status: 'Online',
  uptimePercentage: 99.98,
  avgLatencyMs: 1240,
  analysesToday: 586,
  totalAnalyses: 1248,
  accuracy: 0.924,
  aucRoc: 0.940,
  f1Score: 0.897,
  precision: 0.891,
  recall: 0.903,
  specificity: 0.932,
  historicalTelemetry: HOURLY_TELEMETRY,
};
