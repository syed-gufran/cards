'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  DesignTemplate,
  CardSideDesign,
  WeddingEvent,
  PrintingSpecification,
  SuitePageKey,
} from '@/types/wedding-card';
import { getTemplateById, saveCurrentProject, loadCurrentProject } from '@/utils/storage';
import { getDefaultSuitePages, SUITE_PAGE_LABELS } from '@/utils/suite-pages';
import { CardCanvas } from '@/components/CardCanvas';
import { CardEditorControls } from '@/components/CardEditorControls';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  Check,
  Sparkles,
  Sliders,
  Layers,
  Smartphone,
  Maximize2,
} from 'lucide-react';
import Link from 'next/link';

export default function CardEditorPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.id as string;

  const [template, setTemplate] = useState<DesignTemplate | null>(null);

  // Multi-Page Suite State
  const [currentSuitePage, setCurrentSuitePage] = useState<SuitePageKey>('coverFront');
  const [suitePages, setSuitePages] = useState<Record<SuitePageKey, CardSideDesign> | null>(null);

  // Backward-compatible front/back design references
  const [frontDesign, setFrontDesign] = useState<CardSideDesign | null>(null);
  const [backDesign, setBackDesign] = useState<CardSideDesign | null>(null);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showPrintGuides, setShowPrintGuides] = useState<boolean>(true);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // Mobile View Switcher: 'canvas' (full card preview) vs 'controls' (full editor sidebar)
  const [mobileViewMode, setMobileViewMode] = useState<'canvas' | 'controls'>('canvas');

  // History stack for Undo / Redo
  const [history, setHistory] = useState<
    Array<Record<SuitePageKey, CardSideDesign>>
  >([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Load template on mount
  useEffect(() => {
    if (!templateId) return;

    const t = getTemplateById(templateId);
    if (t) {
      setTemplate(t);

      // Check if user has an existing saved project
      const savedProj = loadCurrentProject();
      if (savedProj && savedProj.templateId === t.id && savedProj.suitePages) {
        setSuitePages(savedProj.suitePages as Record<SuitePageKey, CardSideDesign>);
        setFrontDesign(savedProj.frontDesign);
        setBackDesign(savedProj.backDesign);
        setEvents(savedProj.events || []);
        setHistory([savedProj.suitePages as Record<SuitePageKey, CardSideDesign>]);
        setHistoryIndex(0);
      } else {
        // Initialize complete multi-page suite
        const defaultPages = getDefaultSuitePages(t);
        setSuitePages(defaultPages);
        setFrontDesign(defaultPages.coverFront);
        setBackDesign(defaultPages.coverBack);
        setEvents([
          {
            id: 'ev-default-1',
            name: 'Mehendi & Sangeet',
            date: '2026-12-13',
            time: '07:00 PM',
            venue: 'The Durbar Hall',
          },
          {
            id: 'ev-default-2',
            name: 'Wedding Muhurtham & Pheras',
            date: '2026-12-14',
            time: '07:30 PM',
            venue: 'Palace Courtyard Lawns',
          },
        ]);
        setHistory([defaultPages]);
        setHistoryIndex(0);
      }
    }
  }, [templateId]);

  if (!template || !suitePages || !frontDesign || !backDesign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F2]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg text-stone-700">Loading Customisation Studio...</p>
        </div>
      </div>
    );
  }

  // Active page design object
  const activePageDesign = suitePages[currentSuitePage] || suitePages.coverFront;

  // Update currently active page design and push to undo history
  const handleUpdateActivePage = (
    updater: (prev: CardSideDesign) => CardSideDesign
  ) => {
    const updatedActive = updater(activePageDesign);
    const updatedSuitePages: Record<SuitePageKey, CardSideDesign> = {
      ...suitePages,
      [currentSuitePage]: updatedActive,
    };

    setSuitePages(updatedSuitePages);

    // Keep frontDesign and backDesign synchronized
    if (currentSuitePage === 'coverFront') {
      setFrontDesign(updatedActive);
    } else if (currentSuitePage === 'coverBack') {
      setBackDesign(updatedActive);
    }

    pushHistory(updatedSuitePages);
  };

  const handleUpdateElementPosition = (
    elementId: string,
    xPercent: number,
    yPercent: number
  ) => {
    handleUpdateActivePage((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === elementId ? { ...el, xPercent, yPercent } : el
      ),
    }));
  };

  const pushHistory = (newPages: Record<SuitePageKey, CardSideDesign>) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newPages);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const targetPages = history[targetIndex];
      setSuitePages(targetPages);
      setFrontDesign(targetPages.coverFront);
      setBackDesign(targetPages.coverBack);
      setHistoryIndex(targetIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const targetPages = history[targetIndex];
      setSuitePages(targetPages);
      setFrontDesign(targetPages.coverFront);
      setBackDesign(targetPages.coverBack);
      setHistoryIndex(targetIndex);
    }
  };

  const handleResetToTemplate = () => {
    if (window.confirm('Reset all pages to original template defaults?')) {
      const defaultPages = getDefaultSuitePages(template);
      setSuitePages(defaultPages);
      setFrontDesign(defaultPages.coverFront);
      setBackDesign(defaultPages.coverBack);
      pushHistory(defaultPages);
    }
  };

  const handleSaveProject = () => {
    const defaultSpecs: PrintingSpecification = {
      sizeId: '5x7',
      paperTypeId: 'velvet-board',
      finishId: 'gold-foil',
      envelopeId: 'gold-lined',
      sides: 'double',
      quantity: 150,
    };

    saveCurrentProject({
      id: `project-${template.id}`,
      templateId: template.id,
      updatedAt: new Date().toISOString(),
      frontDesign: suitePages.coverFront,
      backDesign: suitePages.coverBack,
      suitePages,
      events,
      specs: defaultSpecs,
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleProceedToSpecs = () => {
    handleSaveProject();
    router.push(`/checkout?templateId=${template.id}`);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-72px)] bg-[#FAF8F2] overflow-hidden select-none">
      {/* Studio Top Action Bar */}
      <div className="h-14 sm:h-16 bg-white border-b border-stone-200 px-3 sm:px-6 flex items-center justify-between shrink-0 z-30">
        {/* Back Link & Template Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/gallery"
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            title="Back to Gallery"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif font-bold text-xs sm:text-base text-stone-900 leading-tight truncate max-w-[170px] sm:max-w-xs">
              {template.title}
            </h1>
            <span className="text-[10px] font-mono text-gold-700 font-semibold uppercase">
              {template.id} • {SUITE_PAGE_LABELS[currentSuitePage]?.shortLabel}
            </span>
          </div>
        </div>

        {/* Center Mobile View Mode Switcher (Pill for Mobile Screens) */}
        <div className="flex lg:hidden bg-stone-100 p-1 rounded-full border border-stone-200 text-xs">
          <button
            type="button"
            onClick={() => setMobileViewMode('canvas')}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              mobileViewMode === 'canvas'
                ? 'bg-gold-500 text-white font-bold shadow-xs'
                : 'text-stone-600'
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setMobileViewMode('controls')}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              mobileViewMode === 'controls'
                ? 'bg-gold-500 text-white font-bold shadow-xs'
                : 'text-stone-600'
            }`}
          >
            Edit
          </button>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Save Button */}
          <button
            type="button"
            onClick={handleSaveProject}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-stone-500" />
            <span>Save Draft</span>
          </button>

          {/* Proceed to Printing Specs */}
          <button
            type="button"
            onClick={handleProceedToSpecs}
            className="flex items-center gap-1 px-3 sm:px-5 py-2 bg-gradient-to-r from-gold-600 via-gold-500 to-amber-600 hover:from-gold-700 hover:to-amber-700 text-white font-serif font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all uppercase tracking-wider whitespace-nowrap"
          >
            <span className="hidden sm:inline">Proceed to Print Specs</span>
            <span className="sm:hidden">Print Specs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* CENTER STAGE: Live Interactive Vector Card Canvas */}
        <div
          className={`flex-1 h-full overflow-hidden relative ${
            mobileViewMode === 'controls' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <CardCanvas
            frontDesign={suitePages.coverFront}
            backDesign={suitePages.coverBack}
            suitePages={suitePages}
            currentSuitePage={currentSuitePage}
            onSuitePageChange={setCurrentSuitePage}
            selectedElementId={selectedElementId}
            onSelectElement={(id) => {
              setSelectedElementId(id);
            }}
            onUpdateElementPosition={handleUpdateElementPosition}
            showPrintGuides={showPrintGuides}
            onTogglePrintGuides={() => setShowPrintGuides(!showPrintGuides)}
            hasFoilFinish={true}
          />
        </div>

        {/* RIGHT SIDEBAR: Customisation Controls */}
        <div
          className={`w-full lg:w-[440px] xl:w-[480px] h-full border-t lg:border-t-0 shrink-0 bg-white ${
            mobileViewMode === 'canvas' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="w-full h-full flex flex-col">
            {/* Mobile Switch Back to Preview Banner */}
            <div className="lg:hidden p-2.5 bg-gold-50 border-b border-gold-200 flex items-center justify-between shrink-0">
              <span className="text-xs font-semibold text-gold-900">
                Editing: {SUITE_PAGE_LABELS[currentSuitePage]?.label}
              </span>
              <button
                type="button"
                onClick={() => setMobileViewMode('canvas')}
                className="px-3 py-1 bg-gold-500 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>View Card</span>
              </button>
            </div>

            <CardEditorControls
              currentSide={currentSuitePage === 'coverBack' ? 'back' : 'front'}
              currentSuitePage={currentSuitePage}
              onSuitePageChange={setCurrentSuitePage}
              sideDesign={activePageDesign}
              onUpdateSideDesign={handleUpdateActivePage}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              events={events}
              onUpdateEvents={setEvents}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onReset={handleResetToTemplate}
            />
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick Action Bar for Mobile Screens */}
      <div className="lg:hidden h-14 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 flex items-center justify-between z-30 shrink-0">
        <button
          type="button"
          onClick={() => setMobileViewMode(mobileViewMode === 'canvas' ? 'controls' : 'canvas')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-full border border-stone-200"
        >
          {mobileViewMode === 'canvas' ? (
            <>
              <Sliders className="w-3.5 h-3.5 text-gold-600" />
              <span>Edit Details</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-gold-600" />
              <span>Preview Card</span>
            </>
          )}
        </button>

        {/* Page Switcher for Mobile */}
        <select
          value={currentSuitePage}
          onChange={(e) => setCurrentSuitePage(e.target.value as SuitePageKey)}
          className="text-xs font-semibold bg-stone-50 border border-gold-300 rounded-full px-3 py-1.5 max-w-[150px] truncate"
        >
          <option value="coverFront">1. Cover Front</option>
          <option value="insideLeft">2. Inside Left</option>
          <option value="insideRight">3. Inside Right</option>
          <option value="coverBack">4. Cover Back</option>
          <option value="baraatCard">5. Baraat Pass</option>
          <option value="sangeetCard">6. Sangeet Card</option>
        </select>

        <button
          type="button"
          onClick={handleProceedToSpecs}
          className="px-3.5 py-1.5 bg-gold-500 text-white font-bold text-xs rounded-full shadow-xs flex items-center gap-1"
        >
          <span>Order</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Save Success Toast */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold border border-gold-500/30"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>All suite pages saved! You can resume editing anytime.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
