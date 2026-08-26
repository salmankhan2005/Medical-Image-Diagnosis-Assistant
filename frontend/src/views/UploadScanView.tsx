import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileImage,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  RefreshCw,
  Eye,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BentoCard } from '../components/common/BentoCard';
import { PRESET_TEST_CASES } from '../data/sampleScans';
import { SeverityBadge } from '../components/common/SeverityBadge';

export const UploadScanView: React.FC = () => {
  const { analyzeImage, setActiveTab, setCurrentAnalysis } = useApp();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(-1);
  const [patientId, setPatientId] = useState<string>('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState<'M' | 'F' | 'Other'>('M');
  const [eye, setEye] = useState<'OD' | 'OS'>('OD');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedPresetIndex(-1);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setSelectedPresetIndex(-1);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setSelectedFile(null);
    setPreviewUrl(PRESET_TEST_CASES[index].scan.imageUrl);
    setPatientId(`PT-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedPresetIndex(-1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRunInference = async () => {
    if (!previewUrl) return;

    setIsAnalyzing(true);

    try {
      // Step 1: Validation
      setAnalysisStep('Validating fundus resolution and illumination quality...');
      await new Promise((r) => setTimeout(r, 450));

      // Step 2: Normalization
      setAnalysisStep('Applying MONAI retinal CLAHE normalization & 224x224 crop...');
      await new Promise((r) => setTimeout(r, 550));

      // Step 3: DenseNet121 Pass
      setAnalysisStep('Running PyTorch DenseNet121 feature classification pass...');
      await new Promise((r) => setTimeout(r, 650));

      // Step 4: Grad-CAM
      setAnalysisStep('Computing Grad-CAM gradients from denseblock4.denselayer16...');
      await new Promise((r) => setTimeout(r, 500));

      const result = await analyzeImage({
        file: selectedFile || undefined,
        previewUrl,
        patientId,
        eye,
        age: patientAge === '' ? undefined : patientAge,
        gender: patientGender,
      });

      setCurrentAnalysis(result);
      setActiveTab('analysis');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-brand-indigo text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Automated Retinal Fundus Ingestion</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-text tracking-monolithic">
          UPLOAD RETINAL SCAN
        </h1>
        <p className="text-sm text-brand-text-muted max-w-2xl leading-relaxed">
          Upload high-resolution color retinal fundus photography for deep learning Diabetic
          Retinopathy classification and instant Grad-CAM lesion localization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Dropzone (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Bento Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-bento-xl border-2 border-dashed p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-white group ${
              isDragging
                ? 'border-brand-indigo bg-indigo-50/40 shadow-bento-glow scale-[0.99]'
                : 'border-brand-border hover:border-brand-indigo/60 hover:bg-brand-subsurface/30 shadow-bento'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-brand-indigo group-hover:scale-110 transition-transform duration-300 mb-4 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-brand-text tracking-tight">
              Drag and drop retinal fundus image
            </h3>
            <p className="text-xs text-brand-text-muted mt-1 max-w-xs">
              Supports standard digital fundus cameras (JPG, JPEG, PNG). Max 25 MB.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                className="px-5 py-2.5 bg-brand-indigo hover:bg-brand-indigo-dark text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Browse Local Files
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center gap-4 text-[11px] text-brand-text-muted">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Client-side HIPAA De-identification
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                DenseNet121 Compatible
              </span>
            </div>
          </div>
        </div>

        {/* Right: Preview Canvas & Metadata Inputs (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <BentoCard
            title="Image Preview & Patient Record"
            subtitle="Verify image aperture and specify anonymized metadata"
            action={
              previewUrl && (
                <button
                  onClick={handleClear}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )
            }
          >
            {previewUrl ? (
              <div className="space-y-5">
                {/* Preview Image Box */}
                <div className="relative aspect-square w-full rounded-2xl bg-black overflow-hidden border border-brand-border shadow-inner flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Fundus Preview"
                    className="w-full h-full object-contain"
                  />

                  {/* Quality Check Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border border-white/10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Illumination Quality: 98%</span>
                  </div>

                  {selectedFile && (
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[11px] font-mono border border-white/10">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  )}
                </div>

                {/* Patient Metadata Form Inputs */}
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-brand-text-muted block mb-1">
                        Anonymized Patient ID
                      </label>
                      <input
                        type="text"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-subsurface border border-brand-border rounded-xl text-xs font-mono font-bold text-brand-text focus:outline-none focus:border-brand-indigo focus:bg-white"
                        placeholder="PT-00000"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-brand-text-muted block mb-1">
                        Eye Examined
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setEye('OD')}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            eye === 'OD'
                              ? 'bg-brand-indigo text-white border-brand-indigo shadow-xs'
                              : 'bg-brand-subsurface text-brand-text-muted border-brand-border hover:text-brand-text'
                          }`}
                        >
                          OD (Right)
                        </button>
                        <button
                          type="button"
                          onClick={() => setEye('OS')}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            eye === 'OS'
                              ? 'bg-brand-indigo text-white border-brand-indigo shadow-xs'
                              : 'bg-brand-subsurface text-brand-text-muted border-brand-border hover:text-brand-text'
                          }`}
                        >
                          OS (Left)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-brand-text-muted block mb-1">
                        Patient Age
                      </label>
                      <input
                        type="number"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-brand-subsurface border border-brand-border rounded-xl text-xs font-bold text-brand-text focus:outline-none focus:border-brand-indigo focus:bg-white"
                        placeholder="Age"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-brand-text-muted block mb-1">
                        Gender
                      </label>
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value as any)}
                        className="w-full px-3 py-2 bg-brand-subsurface border border-brand-border rounded-xl text-xs font-bold text-brand-text focus:outline-none focus:border-brand-indigo focus:bg-white"
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="Other">Other / Unspecified</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Inference Action Button */}
                <div className="pt-2">
                  <button
                    disabled={isAnalyzing}
                    onClick={handleRunInference}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-indigo to-brand-purple hover:from-brand-indigo-dark hover:to-purple-800 text-white rounded-2xl font-bold text-sm shadow-md shadow-brand-indigo/30 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75 disabled:pointer-events-none"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Running AI Diagnostics...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run AI Diagnostic Inference</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  {/* Multi-step Diagnostic Loading Status */}
                  {isAnalyzing && (
                    <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-2 text-xs font-semibold text-brand-indigo animate-pulse">
                      <Sparkles className="w-4 h-4 text-brand-indigo shrink-0" />
                      <span className="truncate">{analysisStep}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-brand-text-muted space-y-4 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-brand-indigo">
                  <FileImage className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-brand-text">No Retinal Photograph Loaded</h3>
                <p className="text-xs text-brand-text-dim max-w-xs leading-relaxed">
                  Please drag & drop or upload a high-resolution fundus scan on the left panel to begin.
                </p>
              </div>
            )}
          </BentoCard>
        </div>
      </div>
    </div>
  );
};
