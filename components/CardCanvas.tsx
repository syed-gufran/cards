'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSideDesign, CardTextElement, SuitePageKey } from '@/types/wedding-card';
import { BorderFrame } from './BordersAndFrames';
import { MotifIcon } from './MotifIcons';
import { SUITE_PAGE_LABELS } from '@/utils/suite-pages';
import { InteractiveEnvelopePreview } from './InteractiveEnvelopePreview';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Eye,
  Download,
  Move,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Mail,
  Lock,
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface CardCanvasProps {
  frontDesign: CardSideDesign;
  backDesign: CardSideDesign;
  suitePages?: Record<SuitePageKey, CardSideDesign>;
  currentSuitePage?: SuitePageKey;
  onSuitePageChange?: (page: SuitePageKey) => void;
  currentSide?: 'front' | 'back';
  onSideChange?: (side: 'front' | 'back') => void;
  selectedElementId: string | null;
  onSelectElement: (elementId: string) => void;
  onUpdateElementPosition?: (elementId: string, xPercent: number, yPercent: number) => void;
  showPrintGuides?: boolean;
  onTogglePrintGuides?: () => void;
  hasFoilFinish?: boolean;
}

export const CardCanvas: React.FC<CardCanvasProps> = ({
  frontDesign,
  backDesign,
  suitePages,
  currentSuitePage = 'coverFront',
  onSuitePageChange,
  currentSide = 'front',
  onSideChange,
  selectedElementId,
  onSelectElement,
  onUpdateElementPosition,
  showPrintGuides = true,
  onTogglePrintGuides,
  hasFoilFinish = true,
}) => {
  const [zoomScale, setZoomScale] = useState<number>(0.92);
  const [isExportingPng, setIsExportingPng] = useState<boolean>(false);
  const [envelopePreviewOpen, setEnvelopePreviewOpen] = useState<boolean>(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Auto-fit initial zoom for mobile screens
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setZoomScale(0.82);
    }
  }, []);

  // Determine active design
  const activeDesign: CardSideDesign = suitePages
    ? suitePages[currentSuitePage] || suitePages.coverFront || frontDesign
    : currentSide === 'front'
    ? frontDesign
    : backDesign;

  const isBaraatCard = currentSuitePage === 'baraatCard';

  // Dragging state
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initXPercent: number;
    initYPercent: number;
    rectWidth: number;
    rectHeight: number;
  } | null>(null);

  const handleZoom = (delta: number) => {
    setZoomScale((prev) => Math.min(1.35, Math.max(0.65, prev + delta)));
  };

  const resetZoom = () => {
    setZoomScale(typeof window !== 'undefined' && window.innerWidth < 640 ? 0.82 : 0.95);
  };

  // Drag-and-drop position handlers (Mouse & Touch)
  const startDrag = (clientX: number, clientY: number, element: CardTextElement) => {
    if (element.isLocked) return;
    onSelectElement(element.id);

    if (!cardContainerRef.current) return;
    const cardRect = cardContainerRef.current.getBoundingClientRect();

    setDraggingElementId(element.id);
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initXPercent: element.xPercent,
      initYPercent: element.yPercent,
      rectWidth: cardRect.width,
      rectHeight: cardRect.height,
    };
  };

  const updateDrag = (clientX: number, clientY: number, elementId: string) => {
    if (!dragStartRef.current || !onUpdateElementPosition) return;
    const deltaX = clientX - dragStartRef.current.startX;
    const deltaY = clientY - dragStartRef.current.startY;

    const deltaXPercent = (deltaX / (dragStartRef.current.rectWidth * zoomScale)) * 100;
    const deltaYPercent = (deltaY / (dragStartRef.current.rectHeight * zoomScale)) * 100;

    const newX = Math.round(
      Math.max(12, Math.min(88, dragStartRef.current.initXPercent + deltaXPercent))
    );
    const newY = Math.round(
      Math.max(8, Math.min(92, dragStartRef.current.initYPercent + deltaYPercent))
    );

    onUpdateElementPosition(elementId, newX, newY);
  };

  const endDrag = () => {
    setDraggingElementId(null);
    dragStartRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent, element: CardTextElement) => {
    e.stopPropagation();
    startDrag(e.clientX, e.clientY, element);

    const onMouseMove = (moveEvent: MouseEvent) => {
      updateDrag(moveEvent.clientX, moveEvent.clientY, element.id);
    };

    const onMouseUp = () => {
      endDrag();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent, element: CardTextElement) => {
    e.stopPropagation();
    const touch = e.touches[0];
    if (!touch) return;
    startDrag(touch.clientX, touch.clientY, element);

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.cancelable) {
        moveEvent.preventDefault();
      }
      const moveTouch = moveEvent.touches[0];
      if (moveTouch) {
        updateDrag(moveTouch.clientX, moveTouch.clientY, element.id);
      }
    };

    const onTouchEnd = () => {
      endDrag();
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  };

  // Instant High-Res PNG Capture
  const handleDownloadPng = async () => {
    if (!cardContainerRef.current || isExportingPng) return;
    setIsExportingPng(true);
    try {
      const canvas = await html2canvas(cardContainerRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Wedding_Invitation_${currentSuitePage.toUpperCase()}_PREVIEW.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG export error', err);
    } finally {
      setIsExportingPng(false);
    }
  };

  const suitePageKeys: SuitePageKey[] = [
    'coverFront',
    'insideLeft',
    'insideRight',
    'coverBack',
    'baraatCard',
    'sangeetCard',
  ];

  return (
    <div className="relative flex flex-col items-center justify-between w-full h-full min-h-[500px] select-none bg-gradient-to-b from-[#F7F4EC] to-[#ECE5D8] overflow-hidden p-2 sm:p-6">
      {/* Top Floating Control Bar */}
      <div className="w-full flex flex-col gap-2 z-30 pointer-events-auto shrink-0 mb-2">
        {/* Upper Tool Strip: Page Selector & Zoom */}
        <div className="flex items-center justify-between gap-2 px-1">
          {/* Active Page Info Title */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-serif font-bold text-stone-900 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-gold-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
              <span>{SUITE_PAGE_LABELS[currentSuitePage]?.label || 'Invitation Page'}</span>
            </span>

            <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] text-stone-600 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-stone-200 shadow-xs">
              <Lock className="w-2.5 h-2.5 text-gold-600" />
              <span>Artwork &amp; Borders Locked • Only Text is Editable</span>
            </span>
          </div>

          {/* Quick Actions (PNG, Guides, Zoom) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isExportingPng}
              title="Download Instant High-Res PNG Image"
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-white/90 hover:bg-white text-stone-700 rounded-full backdrop-blur-md border border-stone-200 shadow-xs transition-all"
            >
              <Download className="w-3 h-3 text-gold-600" />
              <span className="hidden sm:inline">{isExportingPng ? 'Saving...' : 'Save PNG'}</span>
            </button>

            {onTogglePrintGuides && (
              <button
                type="button"
                onClick={onTogglePrintGuides}
                title="Toggle Safe Margins & Bleed Guides"
                className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full backdrop-blur-md transition-all shadow-xs border ${
                  showPrintGuides
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white/90 text-stone-600 border-stone-200'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">Guides</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setEnvelopePreviewOpen(true)}
              title="Interactive 3D Envelope Unboxing Preview"
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-gradient-to-r from-gold-500/15 via-amber-400/20 to-gold-500/15 hover:from-gold-500/25 hover:to-amber-500/30 text-amber-950 rounded-full backdrop-blur-md border border-gold-300 shadow-xs transition-all transform hover:scale-105"
            >
              <Mail className="w-3 h-3 text-gold-600" />
              <span className="hidden sm:inline">3D Envelope</span>
            </button>

            {/* Zoom controls */}
            <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-xs border border-stone-200 px-1 py-0.5">
              <button
                type="button"
                onClick={() => handleZoom(-0.1)}
                className="p-1 text-stone-600 hover:text-stone-900 rounded-full"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="text-[10px] font-mono px-1 text-stone-600">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => handleZoom(0.1)}
                className="p-1 text-stone-600 hover:text-stone-900 rounded-full"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="p-1 text-stone-400 hover:text-stone-800 rounded-full"
                title="Reset Zoom"
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Page Suite Tab Selector (Responsive Scrollable) */}
        {onSuitePageChange && (
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 px-1 bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xs">
            {suitePageKeys.map((key) => {
              const isSelected = currentSuitePage === key;
              const meta = SUITE_PAGE_LABELS[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSuitePageChange(key)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-white font-bold shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <span>{meta?.shortLabel || key}</span>
                  {key === 'baraatCard' && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-gold-100 text-gold-900'}`}>
                      Pass
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Center 3D Stage with Physical Card Preview */}
      <div className="relative flex items-center justify-center w-full flex-1 my-auto overflow-visible">
        <div
          className="relative transition-transform duration-200 ease-out origin-center"
          style={{ transform: `scale(${zoomScale})` }}
        >
          {/* Card Realistic Shadow Floor */}
          <div className="absolute -inset-4 bg-black/15 blur-2xl rounded-3xl transform translate-y-6 pointer-events-none" />

          {/* Card Container (Adapts aspect ratio for Baraat / Visiting Card vs Standard 5x7 Card!) */}
          <div
            ref={cardContainerRef}
            className={`relative rounded-sm transition-all duration-300 shadow-2xl overflow-hidden animate-foil-sheen ${
              isBaraatCard
                ? 'w-[360px] sm:w-[460px] aspect-[7/5]' // Landscape Baraat / Visiting Card Pass format
                : 'w-[300px] sm:w-[380px] md:w-[420px] aspect-[5/7]' // Royal 5x7 Card format
            } ${showPrintGuides ? 'ring-2 ring-red-400/40 ring-offset-2' : ''}`}
            style={{
              backgroundColor: activeDesign.backgroundValue.startsWith('#')
                ? activeDesign.backgroundValue
                : '#FAF8F2',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSuitePage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="w-full h-full relative"
              >
            {/* Subtle Metallic / Paper Grain Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 75%)',
              }}
            />

            {/* Foil Shimmer Sweep */}
            {hasFoilFinish && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-transparent via-amber-200 to-transparent"
                style={{ mixBlendMode: 'color-dodge' }}
              />
            )}

            {/* Bleed Margin & Safe Margin Visual Guides */}
            {showPrintGuides && (
              <div className="absolute inset-[12px] border border-dashed border-emerald-500/50 pointer-events-none z-20">
                <span className="absolute bottom-1 right-1 text-[8px] tracking-widest text-emerald-600/70 uppercase font-mono font-bold bg-white/70 px-1 rounded">
                  Safe Margin
                </span>
              </div>
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
                  size={isBaraatCard ? motif.size * 0.8 : motif.size}
                  className="drop-shadow-sm"
                />
              </div>
            ))}

            {/* User Uploaded Photo / Scanned Artwork Layer */}
            {activeDesign.userPhotoUrl && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15 rounded-lg overflow-hidden border border-gold-400 shadow-md"
                style={{
                  left: `${activeDesign.userPhotoPosition?.xPercent || 50}%`,
                  top: `${activeDesign.userPhotoPosition?.yPercent || 50}%`,
                  width: `${activeDesign.userPhotoPosition?.widthPercent || 90}%`,
                  height: 'auto',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeDesign.userPhotoUrl}
                  alt="Scanned card artwork"
                  className="w-full h-auto object-cover opacity-90"
                />
              </div>
            )}

            {/* Interactive & Draggable Text Elements Layer */}
            <div className="absolute inset-0 z-20">
              {activeDesign.elements.map((element: CardTextElement) => {
                const isSelected = selectedElementId === element.id;
                const isDragging = draggingElementId === element.id;

                return (
                  <div
                    key={element.id}
                    onMouseDown={(e) => handleMouseDown(e, element)}
                    onTouchStart={(e) => handleTouchStart(e, element)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-shadow duration-150 group px-2 py-0.5 rounded touch-none select-none ${
                      isSelected
                        ? 'ring-2 ring-gold-400 bg-gold-400/10 shadow-sm animate-pulse-gold'
                        : 'hover:ring-1 hover:ring-gold-300/60'
                    } ${isDragging ? 'opacity-90 scale-[1.03] ring-2 ring-gold-500 shadow-lg z-30' : ''}`}
                    style={{
                      left: `${element.xPercent}%`,
                      top: `${element.yPercent}%`,
                      width: element.widthPercent ? `${element.widthPercent}%` : '85%',
                    }}
                  >
                    {/* Move Handle Tag */}
                    <span
                      className={`absolute -top-5 left-1/2 transform -translate-x-1/2 text-[9px] font-sans font-medium px-2 py-0.5 rounded-full whitespace-nowrap pointer-events-none transition-all flex items-center gap-1 shadow-xs ${
                        isSelected
                          ? 'opacity-100 bg-gold-600 text-white scale-100'
                          : 'opacity-0 group-hover:opacity-100 bg-stone-800 text-stone-200'
                      }`}
                    >
                      <Move className="w-2.5 h-2.5" />
                      <span>{element.label} (Drag to Move)</span>
                    </span>

                    {/* Rendered Text */}
                    <div
                      className="whitespace-pre-line leading-relaxed pointer-events-none"
                      style={{
                        fontSize: `clamp(8px, ${element.fontSize * (isBaraatCard ? 0.32 : 0.36)}px, 26px)`,
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
          </motion.div>
        </AnimatePresence>
      </div>
        </div>
      </div>

      {/* Bottom Switcher Pill & Quick Navigation */}
      <div className="w-full flex items-center justify-between text-xs text-stone-600 z-30 pt-2 shrink-0">
        <span className="text-[11px] font-serif italic hidden sm:inline">
          {SUITE_PAGE_LABELS[currentSuitePage]?.description}
        </span>

        {/* Quick Flip / Prev / Next Page controls */}
        {onSuitePageChange && (
          <div className="flex items-center gap-1 mx-auto sm:mx-0 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full border border-stone-200 shadow-xs">
            <button
              type="button"
              onClick={() => {
                const currentIdx = suitePageKeys.indexOf(currentSuitePage);
                const prevIdx = (currentIdx - 1 + suitePageKeys.length) % suitePageKeys.length;
                onSuitePageChange(suitePageKeys[prevIdx]);
              }}
              className="p-1 hover:bg-stone-100 rounded-full"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] font-mono px-2 text-stone-700 font-semibold">
              Page {suitePageKeys.indexOf(currentSuitePage) + 1} of {suitePageKeys.length}
            </span>

            <button
              type="button"
              onClick={() => {
                const currentIdx = suitePageKeys.indexOf(currentSuitePage);
                const nextIdx = (currentIdx + 1) % suitePageKeys.length;
                onSuitePageChange(suitePageKeys[nextIdx]);
              }}
              className="p-1 hover:bg-stone-100 rounded-full"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3D Interactive Envelope Unboxing Modal */}
      <InteractiveEnvelopePreview
        isOpen={envelopePreviewOpen}
        onClose={() => setEnvelopePreviewOpen(false)}
        cardDesign={activeDesign}
      />
    </div>
  );
};
