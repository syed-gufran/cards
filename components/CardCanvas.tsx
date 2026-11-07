'use client';

import React, { useState } from 'react';
import { CardSideDesign, CardTextElement } from '@/types/wedding-card';
import { BorderFrame } from './BordersAndFrames';
import { MotifIcon } from './MotifIcons';
import { ZoomIn, ZoomOut, RotateCcw, Layers, Eye, Sparkles } from 'lucide-react';

interface CardCanvasProps {
  frontDesign: CardSideDesign;
  backDesign: CardSideDesign;
  currentSide: 'front' | 'back';
  onSideChange: (side: 'front' | 'back') => void;
  selectedElementId: string | null;
  onSelectElement: (elementId: string) => void;
  showPrintGuides?: boolean;
  onTogglePrintGuides?: () => void;
  hasFoilFinish?: boolean;
}

export const CardCanvas: React.FC<CardCanvasProps> = ({
  frontDesign,
  backDesign,
  currentSide,
  onSideChange,
  selectedElementId,
  onSelectElement,
  showPrintGuides = true,
  onTogglePrintGuides,
  hasFoilFinish = true,
}) => {
  const [zoomScale, setZoomScale] = useState<number>(1.0);

  const activeDesign = currentSide === 'front' ? frontDesign : backDesign;

  const handleZoom = (delta: number) => {
    setZoomScale((prev) => Math.min(1.4, Math.max(0.7, prev + delta)));
  };

  const resetZoom = () => {
    setZoomScale(1.0);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full min-h-[580px] p-4 lg:p-8 select-none bg-gradient-to-b from-[#F7F4EC] to-[#ECE5D8] overflow-hidden">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
        {/* Front / Back Side Switcher */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-1.5 py-1 rounded-full shadow-md border border-gold-200">
          <button
            type="button"
            onClick={() => onSideChange('front')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
              currentSide === 'front'
                ? 'bg-gold-500 text-white shadow-sm'
                : 'text-stone-700 hover:text-gold-700'
            }`}
          >
            Front Side
          </button>
          <button
            type="button"
            onClick={() => onSideChange('back')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
              currentSide === 'back'
                ? 'bg-gold-500 text-white shadow-sm'
                : 'text-stone-700 hover:text-gold-700'
            }`}
          >
            Back Side (Events)
          </button>
        </div>

        {/* View Tools: Zoom, Print Guides, Shimmer */}
        <div className="flex items-center gap-2">
          {onTogglePrintGuides && (
            <button
              type="button"
              onClick={onTogglePrintGuides}
              title="Toggle Safe Margins & Bleed Guides"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-md transition-all shadow-sm border ${
                showPrintGuides
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white/90 text-stone-600 border-stone-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Guides</span>
            </button>
          )}

          <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-stone-200 px-1 py-0.5">
            <button
              type="button"
              onClick={() => handleZoom(-0.1)}
              className="p-1.5 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-stone-600">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(0.1)}
              className="p-1.5 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors ml-0.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Center 3D Stage with Physical Card Preview */}
      <div className="relative flex items-center justify-center w-full flex-1 my-8">
        <div
          className="relative transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomScale})` }}
        >
          {/* Card Realistic Shadow Floor */}
          <div className="absolute -inset-4 bg-black/15 blur-2xl rounded-3xl transform translate-y-6 pointer-events-none" />

          {/* Outer Bleed Container (3mm Bleed visualization when guides on) */}
          <div
            className={`relative w-[340px] sm:w-[420px] md:w-[460px] aspect-[5/7] rounded-sm transition-all duration-300 shadow-2xl overflow-hidden ${
              showPrintGuides ? 'ring-2 ring-red-400/40 ring-offset-2' : ''
            }`}
            style={{
              backgroundColor: activeDesign.backgroundValue.startsWith('#')
                ? activeDesign.backgroundValue
                : '#FAF8F2',
            }}
          >
            {/* Subtle Metallic / Paper Grain Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 75%)',
              }}
            />

            {/* Optional Foil Shimmer Sweep */}
            {hasFoilFinish && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-transparent via-amber-200 to-transparent"
                style={{ mixBlendMode: 'color-dodge' }}
              />
            )}

            {/* Bleed Margin & Safe Margin Visual Guides */}
            {showPrintGuides && (
              <>
                {/* 3mm Safe Zone Dotted Line */}
                <div className="absolute inset-[14px] border border-dashed border-emerald-500/50 pointer-events-none z-20">
                  <span className="absolute bottom-1 right-1 text-[8px] tracking-widest text-emerald-600/70 uppercase font-mono font-bold bg-white/60 px-1 rounded">
                    Safe Margin
                  </span>
                </div>
              </>
            )}

            {/* Border and Frame SVG */}
            <BorderFrame
              style={activeDesign.borderStyle}
              color={activeDesign.borderColor}
              isFoil={activeDesign.borderFoilEffect && hasFoilFinish}
            />

            {/* Traditional Indian Motifs Layer */}
            {activeDesign.motifs.map((motif) => (
              <div
                key={motif.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-15"
                style={{
                  left: `${motif.position.xPercent}%`,
                  top: `${motif.position.yPercent}%`,
                }}
              >
                <MotifIcon
                  type={motif.type}
                  color={motif.color}
                  size={motif.size}
                  className="drop-shadow-sm"
                />
              </div>
            ))}

            {/* User Uploaded Photo / Monogram if present */}
            {activeDesign.userPhotoUrl && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15 rounded-full overflow-hidden border-2 border-gold-400 shadow-md"
                style={{
                  left: `${activeDesign.userPhotoPosition?.xPercent || 50}%`,
                  top: `${activeDesign.userPhotoPosition?.yPercent || 25}%`,
                  width: `${activeDesign.userPhotoPosition?.widthPercent || 20}%`,
                  aspectRatio: '1/1',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeDesign.userPhotoUrl}
                  alt="Couple monogram or photo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Interactive Text Elements Layer */}
            <div className="absolute inset-0 z-20">
              {activeDesign.elements.map((element: CardTextElement) => {
                const isSelected = selectedElementId === element.id;

                return (
                  <div
                    key={element.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectElement(element.id);
                    }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-150 group px-2 py-0.5 rounded ${
                      isSelected
                        ? 'ring-2 ring-gold-400 bg-gold-400/10 shadow-sm'
                        : 'hover:ring-1 hover:ring-gold-300/60'
                    }`}
                    style={{
                      left: `${element.xPercent}%`,
                      top: `${element.yPercent}%`,
                      width: element.widthPercent ? `${element.widthPercent}%` : '85%',
                    }}
                  >
                    {/* Hover Tag */}
                    <span
                      className={`absolute -top-4 left-1/2 transform -translate-x-1/2 text-[9px] font-sans font-medium px-1.5 py-0.2 rounded whitespace-nowrap pointer-events-none transition-opacity ${
                        isSelected
                          ? 'opacity-100 bg-gold-600 text-white'
                          : 'opacity-0 group-hover:opacity-100 bg-stone-800 text-stone-200'
                      }`}
                    >
                      {element.label}
                    </span>

                    {/* Rendered Text */}
                    <div
                      className="whitespace-pre-line leading-relaxed"
                      style={{
                        fontSize: `clamp(9px, ${element.fontSize * 0.38}px, 28px)`,
                        color: element.color,
                        fontWeight: element.fontWeight || 'normal',
                        fontStyle: element.fontStyle || 'normal',
                        letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : 'normal',
                        textAlign: element.textAlign || 'center',
                        fontFamily:
                          element.fontFamily === 'serif'
                            ? 'var(--font-cormorant), Georgia, serif'
                            : element.fontFamily === 'cinzel'
                            ? 'var(--font-cinzel), serif'
                            : element.fontFamily === 'script'
                            ? 'var(--font-script), cursive'
                            : 'var(--font-jakarta), sans-serif',
                      }}
                    >
                      {element.text || element.defaultText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Quick Card Switcher Pill */}
      <div className="flex items-center gap-3 z-30">
        <span className="text-xs text-stone-500 font-serif italic">
          Viewing: <strong className="text-stone-800 font-medium capitalize">{currentSide} side</strong>
        </span>
        <button
          type="button"
          onClick={() => onSideChange(currentSide === 'front' ? 'back' : 'front')}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/80 hover:bg-white text-stone-700 text-xs rounded-full border border-stone-300 shadow-sm transition-all"
        >
          <Layers className="w-3.5 h-3.5 text-gold-600" />
          <span>Flip to {currentSide === 'front' ? 'Back (Events)' : 'Front'}</span>
        </button>
      </div>
    </div>
  );
};

