'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  DesignTemplate,
  CardSideDesign,
  WeddingEvent,
  PrintingSpecification,
} from '@/types/wedding-card';
import { getTemplateById, saveCurrentProject, loadCurrentProject } from '@/utils/storage';
import { CardCanvas } from '@/components/CardCanvas';
import { CardEditorControls } from '@/components/CardEditorControls';
import { ArrowLeft, ArrowRight, Save, Eye, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CardEditorPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.id as string;

  const [template, setTemplate] = useState<DesignTemplate | null>(null);
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  const [frontDesign, setFrontDesign] = useState<CardSideDesign | null>(null);
  const [backDesign, setBackDesign] = useState<CardSideDesign | null>(null);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showPrintGuides, setShowPrintGuides] = useState<boolean>(true);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // Undo / Redo history stacks
  const [history, setHistory] = useState<
    Array<{ front: CardSideDesign; back: CardSideDesign }>
  >([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Load template on mount
  useEffect(() => {
    if (!templateId) return;

    const t = getTemplateById(templateId);
    if (t) {
      setTemplate(t);

      // Check if user has an existing saved project for this template
      const savedProj = loadCurrentProject();
      if (savedProj && savedProj.templateId === t.id) {
        setFrontDesign(savedProj.frontDesign);
        setBackDesign(savedProj.backDesign);
        setEvents(savedProj.events || []);
        setHistory([{ front: savedProj.frontDesign, back: savedProj.backDesign }]);
        setHistoryIndex(0);
      } else {
        // Initialize from template
        setFrontDesign(t.frontDesign);
        setBackDesign(t.backDesign);
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
        setHistory([{ front: t.frontDesign, back: t.backDesign }]);
        setHistoryIndex(0);
      }
    }
  }, [templateId]);

  if (!template || !frontDesign || !backDesign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F2]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg text-stone-700">Loading Customisation Studio...</p>
        </div>
      </div>
    );
  }

  // Update current side design and push to undo history
  const handleUpdateCurrentSide = (
    updater: (prev: CardSideDesign) => CardSideDesign
  ) => {
    if (currentSide === 'front') {
      const updatedFront = updater(frontDesign);
      setFrontDesign(updatedFront);
      pushHistory(updatedFront, backDesign);
    } else {
      const updatedBack = updater(backDesign);
      setBackDesign(updatedBack);
      pushHistory(frontDesign, updatedBack);
    }
  };

  const pushHistory = (newFront: CardSideDesign, newBack: CardSideDesign) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push({ front: newFront, back: newBack });
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      setFrontDesign(history[targetIndex].front);
      setBackDesign(history[targetIndex].back);
      setHistoryIndex(targetIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      setFrontDesign(history[targetIndex].front);
      setBackDesign(history[targetIndex].back);
      setHistoryIndex(targetIndex);
    }
  };

  const handleResetToTemplate = () => {
    if (window.confirm('Reset this invitation to the original template defaults?')) {
      setFrontDesign(template.frontDesign);
      setBackDesign(template.backDesign);
      pushHistory(template.frontDesign, template.backDesign);
    }
  };

  const handleSaveProject = () => {
    const defaultSpecs: PrintingSpecification = {
      sizeId: '5x7',
      paperTypeId: 'textured-matte',
      finishId: 'gold-foil',
      envelopeId: 'standard-ivory',
      sides: 'double',
      quantity: 100,
    };

    saveCurrentProject({
      id: `project-${template.id}`,
      templateId: template.id,
      updatedAt: new Date().toISOString(),
      frontDesign,
      backDesign,
      events,
      specs: defaultSpecs,
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleProceedToSpecs = () => {
    // Persist to storage and navigate to checkout specs
    handleSaveProject();
    router.push(`/checkout?templateId=${template.id}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#FAF8F2] overflow-hidden select-none">
      {/* Studio Top Action Bar */}
      <div className="h-14 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        {/* Back Link & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/gallery"
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            title="Back to Gallery"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif font-bold text-sm sm:text-base text-stone-900 leading-tight">
              {template.title}
            </h1>
            <span className="text-[10px] font-mono text-gold-700 font-semibold uppercase">
              Design ID: {template.id} • {template.category}
            </span>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {/* Save Button */}
          <button
            type="button"
            onClick={handleSaveProject}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-stone-500" />
            <span>Save Draft</span>
          </button>

          {/* Proceed to Printing Specs */}
          <button
            type="button"
            onClick={handleProceedToSpecs}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-gradient-to-r from-gold-600 via-gold-500 to-amber-600 hover:from-gold-700 hover:to-amber-700 text-white font-serif font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all uppercase tracking-wider"
          >
            <span>Proceed to Print Specs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Work Area: Center Canvas + Right Controls */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* CENTER STAGE: Live Interactive Vector Card Canvas */}
        <div className="flex-1 h-full overflow-hidden relative">
          <CardCanvas
            frontDesign={frontDesign}
            backDesign={backDesign}
            currentSide={currentSide}
            onSideChange={setCurrentSide}
            selectedElementId={selectedElementId}
            onSelectElement={(id) => setSelectedElementId(id)}
            showPrintGuides={showPrintGuides}
            onTogglePrintGuides={() => setShowPrintGuides(!showPrintGuides)}
            hasFoilFinish={true}
          />
        </div>

        {/* RIGHT SIDEBAR: Customisation Controls */}
        <div className="w-full lg:w-[440px] xl:w-[480px] h-[48vh] lg:h-full border-t lg:border-t-0 shrink-0">
          <CardEditorControls
            currentSide={currentSide}
            sideDesign={currentSide === 'front' ? frontDesign : backDesign}
            onUpdateSideDesign={handleUpdateCurrentSide}
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

      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Card design saved! You can resume editing anytime.</span>
        </div>
      )}
    </div>
  );
}

