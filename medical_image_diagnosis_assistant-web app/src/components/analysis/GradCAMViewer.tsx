import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Eye,
  Sliders,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Crosshair,
} from 'lucide-react';
import { AnalysisResult } from '../../types';

interface GradCAMViewerProps {
  analysis: AnalysisResult;
}

export const GradCAMViewer: React.FC<GradCAMViewerProps> = ({ analysis }) => {
  const [viewMode, setViewMode] = useState<'overlay' | 'original' | 'heatmap' | 'split'>('overlay');
  const [opacity, setOpacity] = useState<number>(0.6);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showCrosshairs, setShowCrosshairs] = useState<boolean>(true);
  const [colormap, setColormap] = useState<'jet' | 'turbo' | 'thermal'>('jet');
  const [splitPos, setSplitPos] = useState<number>(50); // percentage for split view

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setOpacity(0.6);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.25, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  return (
    <div className="bg-white rounded-bento-lg border border-brand-border p-6 shadow-bento flex flex-col gap-5">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-border/60">
        {/* Segmented View Mode Tabs */}
        <div className="flex items-center bg-brand-subsurface p-1 rounded-xl border border-brand-border">
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'overlay'
                ? 'bg-white text-brand-indigo shadow-xs'
                : 'text-brand-text-muted hover:text-brand-text'
            }`}
          >
            Overlay
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'original'
                ? 'bg-white text-brand-indigo shadow-xs'
                : 'text-brand-text-muted hover:text-brand-text'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'heatmap'
                ? 'bg-white text-brand-indigo shadow-xs'
                : 'text-brand-text-muted hover:text-brand-text'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'split'
                ? 'bg-white text-brand-indigo shadow-xs'
                : 'text-brand-text-muted hover:text-brand-text'
            }`}
          >
            Split View
          </button>
        </div>

        {/* Action Controls (Zoom, Reset, Crosshairs) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCrosshairs(!showCrosshairs)}
            className={`p-2 rounded-xl border text-xs font-medium transition-all ${
              showCrosshairs
                ? 'bg-indigo-50 border-indigo-200 text-brand-indigo'
                : 'border-brand-border text-brand-text-muted hover:bg-brand-subsurface'
            }`}
            title="Toggle Feature Hotspots"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl border border-brand-border text-brand-text-muted hover:text-brand-text hover:bg-brand-subsurface transition-colors"
            title="Zoom In (+25%)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl border border-brand-border text-brand-text-muted hover:text-brand-text hover:bg-brand-subsurface transition-colors"
            title="Zoom Out (-25%)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl border border-brand-border text-brand-text-muted hover:text-brand-text hover:bg-brand-subsurface transition-colors"
            title="Reset Transform"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Canvas / Image Viewer Display Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full aspect-square max-h-[460px] bg-black rounded-2xl overflow-hidden border border-brand-border shadow-inner select-none ${
          zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
      >
        {/* Layer Rendering depending on viewMode */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-75"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          }}
        >
          {/* Base Original Fundus */}
          {(viewMode === 'original' || viewMode === 'overlay' || viewMode === 'split') && (
            <img
              src={analysis.imageUrl}
              alt="Retinal Fundus Scan"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          )}

          {/* Grad-CAM Heatmap Layer with Opacity Control */}
          {(viewMode === 'heatmap' || viewMode === 'overlay') && (
            <img
              src={analysis.gradcamUrl}
              alt="Grad-CAM Heatmap"
              className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${
                viewMode === 'heatmap' ? 'opacity-100' : ''
              }`}
              style={{
                opacity: viewMode === 'heatmap' ? 1.0 : opacity,
                mixBlendMode: viewMode === 'overlay' ? 'screen' : 'normal',
                filter: colormap === 'turbo' ? 'hue-rotate(25deg) contrast(1.1)' : colormap === 'thermal' ? 'hue-rotate(180deg)' : 'none',
              }}
            />
          )}

          {/* Split Mode Masked Layer */}
          {viewMode === 'split' && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${splitPos}%`, borderRight: '2px solid #818CF8' }}
            >
              <img
                src={analysis.gradcamUrl}
                alt="Grad-CAM Split"
                className="w-full h-full object-contain"
                style={{ width: `${(100 / splitPos) * 100}%`, maxWidth: 'none' }}
              />
            </div>
          )}

          {/* Hotspot Markers */}
          {showCrosshairs && analysis.predictionGrade > 0 && (
            <>
              <div className="absolute top-[48%] left-[54%] w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-full h-full rounded-full border-2 border-dashed border-rose-400 animate-ping opacity-75" />
                <div className="absolute inset-0 rounded-full border-2 border-rose-500 bg-rose-500/20" />
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                  Focal DR
                </span>
              </div>

              {analysis.predictionGrade >= 2 && (
                <div className="absolute top-[38%] left-[36%] w-7 h-7 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="absolute inset-0 rounded-full border-2 border-amber-400 bg-amber-500/20" />
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    Exudates
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Floating Zoom & Pan Indicator Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-2 border border-white/10">
          <span>{Math.round(zoom * 100)}%</span>
          {zoom > 1 && <span className="text-white/60">Drag to pan</span>}
        </div>

        {/* Active Layer Badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border border-white/10 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-indigo-light" />
          <span>Layer: DenseBlock4</span>
        </div>
      </div>

      {/* Interactive Controls Bar: Opacity Slider, Colormap & Split Slider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-subsurface/60 p-4 rounded-2xl border border-brand-border">
        {/* Opacity Slider */}
        {viewMode === 'overlay' ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-brand-text">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-indigo" />
                Heatmap Opacity
              </span>
              <span className="font-mono text-brand-indigo">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
          </div>
        ) : viewMode === 'split' ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-brand-text">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-indigo" />
                Split Position
              </span>
              <span className="font-mono text-brand-indigo">{splitPos}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="1"
              value={splitPos}
              onChange={(e) => setSplitPos(parseInt(e.target.value))}
              className="w-full h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
          </div>
        ) : (
          <div className="flex items-center text-xs text-brand-text-muted">
            Viewing <span className="font-bold text-brand-text capitalize ml-1">{viewMode} mode</span>
          </div>
        )}

        {/* Colormap Selector */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
          <span className="font-semibold text-brand-text-muted">Colormap:</span>
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-brand-border">
            {(['jet', 'turbo', 'thermal'] as const).map((cm) => (
              <button
                key={cm}
                onClick={() => setColormap(cm)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  colormap === cm
                    ? 'bg-brand-indigo text-white shadow-2xs'
                    : 'text-brand-text-muted hover:text-brand-text'
                }`}
              >
                {cm}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clinical Attention & Disclaimer Callout */}
      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-indigo shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-brand-indigo">
            Grad-CAM Attention Visualization
          </p>
          <p className="text-brand-text-muted leading-relaxed">
            Red/amber zones signify high DenseNet121 gradient activation on microvascular lesions and exudates.{' '}
            <strong className="text-brand-text">
              Notice: Model attention does not represent clinical proof or standalone diagnostic certainty.
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};
