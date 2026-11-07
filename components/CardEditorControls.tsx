'use client';

import React, { useState } from 'react';
import {
  CardSideDesign,
  CardTextElement,
  BorderStyle,
  MotifType,
  WeddingEvent,
  SuitePageKey,
} from '@/types/wedding-card';
import { INDIAN_WORDING_LIBRARY } from '@/data/indian-wording-library';
import { SUITE_PAGE_LABELS } from '@/utils/suite-pages';
import { MotifIcon } from './MotifIcons';
import {
  COLOR_THEME_PRESETS,
  TEXT_FORMAT_PRESETS,
  ColorThemePreset,
  TextFormatPreset,
} from '@/data/card-presets';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from '@/utils/card-translator';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  Palette,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  RotateCcw,
  Undo2,
  Redo2,
  Plus,
  Trash2,
  BookOpen,
  Check,
  CheckCircle2,
  Globe,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Upload,
  Lock,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface CardEditorControlsProps {
  currentSide?: 'front' | 'back';
  currentSuitePage?: SuitePageKey;
  onSuitePageChange?: (page: SuitePageKey) => void;
  sideDesign: CardSideDesign;
  onUpdateSideDesign: (updater: (prev: CardSideDesign) => CardSideDesign) => void;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  events: WeddingEvent[];
  onUpdateEvents: (events: WeddingEvent[]) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  selectedLanguage?: SupportedLanguage;
  onTranslateLanguage?: (lang: SupportedLanguage) => void;
  onApplyColorTheme?: (theme: ColorThemePreset) => void;
  onApplyTextFormat?: (format: TextFormatPreset) => void;
}

export const CardEditorControls: React.FC<CardEditorControlsProps> = ({
  currentSide = 'front',
  currentSuitePage = 'coverFront',
  onSuitePageChange,
  sideDesign,
  onUpdateSideDesign,
  selectedElementId,
  onSelectElement,
  events,
  onUpdateEvents,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  selectedLanguage = 'en',
  onTranslateLanguage,
  onApplyColorTheme,
  onApplyTextFormat,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'typography' | 'position' | 'formats' | 'events'>('text');
  const [showWordingModal, setShowWordingModal] = useState<boolean>(false);
  const [wordingFaith, setWordingFaith] = useState<string>('Hindu');

  const selectedElement = sideDesign.elements.find((e) => e.id === selectedElementId) || sideDesign.elements[0];

  const updateElementText = (id: string, text: string) => {
    onUpdateSideDesign((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, text } : el)),
    }));
  };

  const updateElementProps = (id: string, props: Partial<CardTextElement>) => {
    onUpdateSideDesign((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...props } : el)),
    }));
  };

  const handleAddCustomText = () => {
    const newId = `custom-text-${Date.now()}`;
    const newElement: CardTextElement = {
      id: newId,
      label: 'Custom Text',
      text: 'Double click or edit in sidebar to change text',
      defaultText: 'Double click or edit in sidebar to change text',
      xPercent: 50,
      yPercent: 50,
      fontSize: 14,
      fontFamily: 'serif',
      color: '#D4AF37',
      fontWeight: 'normal',
      textAlign: 'center',
      category: 'custom',
      isOptional: true,
    };

    onUpdateSideDesign((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
    onSelectElement(newId);
  };

  const handleDeleteElement = (id: string) => {
    onUpdateSideDesign((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
    onSelectElement(null);
  };

  const handleApplyShloka = (shlokaText: string) => {
    // Look for religious shloka element or couple top element
    const targetElement = sideDesign.elements.find(
      (e) => e.category === 'religious' || e.label.toLowerCase().includes('shloka')
    );

    if (targetElement) {
      updateElementText(targetElement.id, shlokaText);
    } else {
      // update currently selected or first element
      if (selectedElement) {
        updateElementText(selectedElement.id, shlokaText);
      }
    }
    setShowWordingModal(false);
  };

  // Color Swatches
  const colorPresets = [
    { label: 'Royal 24K Gold', hex: '#D4AF37' },
    { label: 'Antique Gold', hex: '#B88E18' },
    { label: 'Deep Crimson Maroon', hex: '#801222' },
    { label: 'Rich Burgundy', hex: '#4D0711' },
    { label: 'Midnight Navy', hex: '#0B1120' },
    { label: 'Emerald Forest', hex: '#064E3B' },
    { label: 'Rose Gold Foil', hex: '#B76E79' },
    { label: 'Champagne Cream', hex: '#F5EED8' },
    { label: 'Charcoal Black', hex: '#222222' },
    { label: 'Crisp White', hex: '#FFFFFF' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-l border-stone-200 shadow-xl overflow-hidden">
      {/* Top Header with Page Selector & History Controls */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-stone-50 border-b border-stone-200 shrink-0">
        <div className="flex items-center gap-2">
          {onSuitePageChange ? (
            <select
              value={currentSuitePage}
              onChange={(e) => onSuitePageChange(e.target.value as SuitePageKey)}
              className="font-serif font-bold text-xs sm:text-sm text-stone-900 bg-white border border-gold-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-gold-500 shadow-xs cursor-pointer max-w-[200px] sm:max-w-[260px] truncate"
            >
              <option value="coverFront">1. Outer Cover (Outside Front)</option>
              <option value="insideLeft">2. Inside Left (Hosts &amp; Blessings)</option>
              <option value="insideRight">3. Inside Right (Muhurtham &amp; Vows)</option>
              <option value="coverBack">4. Outer Back (RSVP &amp; Residence)</option>
              <option value="baraatCard">5. Baraat / Visiting Pass Card</option>
              <option value="sangeetCard">6. Mehendi &amp; Sangeet Insert</option>
            </select>
          ) : (
            <div>
              <h3 className="font-serif font-bold text-sm text-stone-900">
                Design Studio Controls
              </h3>
              <p className="text-[11px] text-stone-500">
                Editing {currentSide === 'front' ? 'Front Side' : 'Back Side'}
              </p>
            </div>
          )}
        </div>

        {/* History Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 rounded hover:bg-stone-200 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 rounded hover:bg-stone-200 transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onReset}
            title="Reset to Template Default"
            className="p-1.5 text-stone-600 hover:text-rose-700 rounded hover:bg-rose-50 transition-colors ml-0.5"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center border-b border-stone-200 bg-white px-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'text'
              ? 'border-gold-500 text-gold-700 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Wording &amp; Names</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'typography'
              ? 'border-gold-500 text-gold-700 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Fonts &amp; Colors</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('position')}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'position'
              ? 'border-gold-500 text-gold-700 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Move className="w-4 h-4" />
          <span>Move &amp; Position</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('formats')}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'formats'
              ? 'border-gold-500 text-gold-700 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Presets &amp; Colors</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'events'
              ? 'border-gold-500 text-gold-700 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Multi-Events ({events.length})</span>
        </button>
      </div>

      {/* Main Tab Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-5"
          >
            {/* TAB 1: WORDING & TEXT FIELDS */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            {/* 1-Click Multi-Language Converter Strip */}
            {onTranslateLanguage && (
              <div className="p-3 bg-stone-900 text-white rounded-xl border border-gold-500/30 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-gold-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-gold-400" />
                    <span>Convert Entire Card Language</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">1-Click Convert</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => onTranslateLanguage(lang.code)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        selectedLanguage === lang.code
                          ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-stone-950 font-bold shadow-xs'
                          : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                      }`}
                    >
                      <span>{lang.flag} {lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Baraat Card Quick Info Banner */}
            {currentSuitePage === 'baraatCard' && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Baraat &amp; Visiting Pass Card Active</span>
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Customize Baraat assembly timing, horse procession route, valet parking access, and guest helpline numbers for your wedding guests.
                </p>
              </div>
            )}

            {/* Indian Shlokas & Wording Presets Action Pill */}
            <div className="p-3.5 bg-gradient-to-r from-gold-50 to-amber-50 rounded-xl border border-gold-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gold-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-gold-600" />
                  Indian Religious Wording Library
                </span>
                <span className="text-[10px] text-gold-700 bg-gold-200/60 px-2 py-0.5 rounded-full font-medium">
                  Instant Insert
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mb-2.5">
                Insert traditional Hindu shlokas, Quranic verses, Gurmukhi hymns, or contemporary phrases with one click.
              </p>
              <button
                type="button"
                onClick={() => setShowWordingModal(true)}
                className="w-full py-2 px-3 bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-all text-center"
              >
                Browse Religious Shlokas &amp; Phrasings
              </button>
            </div>

            {/* List of Editable Text Elements on Current Side */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-800 tracking-wide uppercase font-mono">
                  Card Text Elements ({sideDesign.elements.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddCustomText}
                  className="flex items-center gap-1 text-[11px] text-gold-700 hover:text-gold-800 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Text</span>
                </button>
              </div>

              {sideDesign.elements.map((el) => {
                const isSelected = selectedElement?.id === el.id;

                return (
                  <div
                    key={el.id}
                    onClick={() => onSelectElement(el.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-gold-400 bg-gold-50/40 ring-1 ring-gold-400'
                        : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-stone-700">
                        {el.label}
                      </span>
                      {el.isOptional && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteElement(el.id);
                          }}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Delete Element"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={el.text.includes('\n') || el.text.length > 30 ? 3 : 1}
                      value={el.text}
                      onChange={(e) => updateElementText(el.id, e.target.value)}
                      placeholder={el.defaultText}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-gold-500 font-sans"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: TYPOGRAPHY CONTROLS */}
        {activeTab === 'typography' && selectedElement && (
          <div className="space-y-4">
            <div className="p-2.5 bg-stone-100 rounded-lg text-xs text-stone-700">
              Styling element: <strong className="text-stone-900">{selectedElement.label}</strong>
            </div>

            {/* Font Family Picker */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Font Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'serif', label: 'Cormorant Garamond', preview: 'Royalty & Heritage' },
                  { id: 'cinzel', label: 'Cinzel Decorative', preview: 'Regal Roman' },
                  { id: 'script', label: 'Great Vibes Script', preview: 'Calligraphic Cursive' },
                  { id: 'sans', label: 'Plus Jakarta Sans', preview: 'Clean & Modern' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateElementProps(selectedElement.id, { fontFamily: f.id })}
                    className={`p-2 rounded-lg border text-left text-xs transition-all ${
                      selectedElement.fontFamily === f.id
                        ? 'border-gold-500 bg-gold-50/50 font-bold text-gold-900'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="font-medium">{f.label}</div>
                    <div className="text-[10px] text-stone-500 italic">{f.preview}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-stone-700">Font Size</label>
                <span className="text-xs font-mono text-stone-500">{selectedElement.fontSize} px</span>
              </div>
              <input
                type="range"
                min="10"
                max="64"
                value={selectedElement.fontSize}
                onChange={(e) =>
                  updateElementProps(selectedElement.id, { fontSize: Number(e.target.value) })
                }
                className="w-full accent-gold-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Text Alignment & Styles */}
            <div className="flex items-center gap-3">
              {/* Alignment */}
              <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-50">
                <button
                  type="button"
                  onClick={() => updateElementProps(selectedElement.id, { textAlign: 'left' })}
                  className={`p-1.5 rounded ${
                    selectedElement.textAlign === 'left' ? 'bg-white shadow-xs text-gold-700' : 'text-stone-500'
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateElementProps(selectedElement.id, { textAlign: 'center' })}
                  className={`p-1.5 rounded ${
                    selectedElement.textAlign === 'center' ? 'bg-white shadow-xs text-gold-700' : 'text-stone-500'
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateElementProps(selectedElement.id, { textAlign: 'right' })}
                  className={`p-1.5 rounded ${
                    selectedElement.textAlign === 'right' ? 'bg-white shadow-xs text-gold-700' : 'text-stone-500'
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bold & Italic */}
              <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-50">
                <button
                  type="button"
                  onClick={() =>
                    updateElementProps(selectedElement.id, {
                      fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold',
                    })
                  }
                  className={`p-1.5 rounded ${
                    selectedElement.fontWeight === 'bold' ? 'bg-white shadow-xs text-gold-700' : 'text-stone-500'
                  }`}
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateElementProps(selectedElement.id, {
                      fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic',
                    })
                  }
                  className={`p-1.5 rounded ${
                    selectedElement.fontStyle === 'italic' ? 'bg-white shadow-xs text-gold-700' : 'text-stone-500'
                  }`}
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Text Color Presets */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Text Color
              </label>
              <div className="grid grid-cols-5 gap-2 mb-2">
                {colorPresets.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => updateElementProps(selectedElement.id, { color: c.hex })}
                    className="flex flex-col items-center gap-1 group"
                    title={c.label}
                  >
                    <span
                      className={`w-7 h-7 rounded-full border shadow-sm transition-transform ${
                        selectedElement.color.toLowerCase() === c.hex.toLowerCase()
                          ? 'ring-2 ring-gold-500 scale-110'
                          : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[9px] text-stone-500 truncate w-full text-center">
                      {c.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">Custom Hex:</span>
                <input
                  type="color"
                  value={selectedElement.color.startsWith('#') ? selectedElement.color : '#D4AF37'}
                  onChange={(e) => updateElementProps(selectedElement.id, { color: e.target.value })}
                  className="w-7 h-7 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedElement.color}
                  onChange={(e) => updateElementProps(selectedElement.id, { color: e.target.value })}
                  className="px-2 py-1 text-xs border border-stone-200 rounded font-mono w-24"
                />
              </div>
            </div>

            {/* Vertical Position Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-stone-700">Vertical Position (Y %)</label>
                <span className="text-xs font-mono text-stone-500">{selectedElement.yPercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={selectedElement.yPercent}
                onChange={(e) =>
                  updateElementProps(selectedElement.id, { yPercent: Number(e.target.value) })
                }
                className="w-full accent-gold-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 3: MOVE & POSITION CONTROLS */}
        {activeTab === 'position' && selectedElement && (
          <div className="space-y-5">
            {/* Design Lock Guarantee Pill */}
            <div className="p-3 bg-stone-50 border border-gold-200/80 rounded-xl flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 shrink-0 mt-0.5">
                <Lock className="w-3 h-3" />
              </div>
              <div className="text-[11px] leading-relaxed">
                <strong className="text-stone-900 block font-serif">Original Artwork &amp; Borders Locked</strong>
                <span className="text-stone-500">
                  The artisanal borders and temple motifs are protected to preserve print perfection. You have full freedom to reposition, center, and align all text lines.
                </span>
              </div>
            </div>

            {/* Element Picker Header */}
            <div className="p-3 bg-gold-50/60 border border-gold-200 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-gold-700 uppercase tracking-widest block">
                Selected Text Element to Move
              </span>
              <select
                value={selectedElement.id}
                onChange={(e) => onSelectElement(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-gold-300 rounded-lg p-2 text-stone-900 focus:ring-1 focus:ring-gold-500 shadow-xs"
              >
                {sideDesign.elements.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.label}: &quot;{el.text?.slice(0, 24) || el.defaultText?.slice(0, 24)}...&quot;
                  </option>
                ))}
              </select>
            </div>

            {/* Fine-Tuning Move Pad */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <label className="text-xs font-bold text-stone-800 block text-center">
                Directional Nudge Pad (Precision Placement)
              </label>
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    updateElementProps(selectedElement.id, {
                      yPercent: Math.max(5, selectedElement.yPercent - 2),
                    })
                  }
                  className="p-2.5 bg-white hover:bg-gold-50 text-stone-700 hover:text-gold-700 rounded-lg border border-stone-200 shadow-xs transition-colors"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateElementProps(selectedElement.id, {
                        xPercent: Math.max(10, selectedElement.xPercent - 2),
                      })
                    }
                    className="p-2.5 bg-white hover:bg-gold-50 text-stone-700 hover:text-gold-700 rounded-lg border border-stone-200 shadow-xs transition-colors"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateElementProps(selectedElement.id, {
                        xPercent: 50,
                      })
                    }
                    className="px-3.5 py-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-white rounded-lg font-serif font-bold text-xs shadow-xs transition-all"
                    title="Center Horizontally (X: 50%)"
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateElementProps(selectedElement.id, {
                        xPercent: Math.min(90, selectedElement.xPercent + 2),
                      })
                    }
                    className="p-2.5 bg-white hover:bg-gold-50 text-stone-700 hover:text-gold-700 rounded-lg border border-stone-200 shadow-xs transition-colors"
                    title="Move Right"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateElementProps(selectedElement.id, {
                      yPercent: Math.min(95, selectedElement.yPercent + 2),
                    })
                  }
                  className="p-2.5 bg-white hover:bg-gold-50 text-stone-700 hover:text-gold-700 rounded-lg border border-stone-200 shadow-xs transition-colors"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sliders for Direct Numerical Adjustment */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-stone-700">Horizontal Position (X %)</label>
                  <span className="text-xs font-mono text-stone-500">{selectedElement.xPercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={selectedElement.xPercent}
                  onChange={(e) =>
                    updateElementProps(selectedElement.id, { xPercent: Number(e.target.value) })
                  }
                  className="w-full accent-gold-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-stone-700">Vertical Position (Y %)</label>
                  <span className="text-xs font-mono text-stone-500">{selectedElement.yPercent}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={selectedElement.yPercent}
                  onChange={(e) =>
                    updateElementProps(selectedElement.id, { yPercent: Number(e.target.value) })
                  }
                  className="w-full accent-gold-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-stone-700">Text Box Width (% of card)</label>
                  <span className="text-xs font-mono text-stone-500">
                    {selectedElement.widthPercent || 85}%
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="95"
                  value={selectedElement.widthPercent || 85}
                  onChange={(e) =>
                    updateElementProps(selectedElement.id, { widthPercent: Number(e.target.value) })
                  }
                  className="w-full accent-gold-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Canvas Direct Drag Tip */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-2 text-stone-600 text-xs">
              <Move className="w-4 h-4 text-gold-600 shrink-0" />
              <span>You can also click &amp; drag this text block anywhere on the card canvas directly.</span>
            </div>
          </div>
        )}

        {/* TAB: PRESETS, FORMATS & COLORWAYS */}
        {activeTab === 'formats' && (
          <div className="space-y-6">
            {/* 1. Multi-Language Converter */}
            <div className="p-4 bg-stone-900 text-white rounded-2xl border border-gold-500/30 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-gold-300 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-gold-400" />
                    <span>Convert Entire Card Language</span>
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Translates all card text to your chosen regional script with 1 tap.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => onTranslateLanguage && onTranslateLanguage(lang.code)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-gold-400 bg-gold-500/20 text-white ring-1 ring-gold-400'
                          : 'border-stone-800 bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{lang.flag}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-gold-400" />}
                      </div>
                      <div className="font-serif font-bold text-xs">{lang.name}</div>
                      <div className="text-[10px] text-gold-300/80">{lang.nativeName}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Text Formats & Wording Layouts */}
            <div className="space-y-3">
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
                  <AlignLeft className="w-4 h-4 text-gold-600" />
                  <span>Text &amp; Layout Formats</span>
                </h4>
                <p className="text-[11px] text-stone-500">
                  Switch the invitation hierarchy, wording tone, and typography preset.
                </p>
              </div>

              <div className="space-y-2">
                {TEXT_FORMAT_PRESETS.map((fmt) => (
                  <div
                    key={fmt.id}
                    onClick={() => onApplyTextFormat && onApplyTextFormat(fmt)}
                    className="p-3 bg-white border border-stone-200 hover:border-gold-400 rounded-xl cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-xs text-stone-900 group-hover:text-gold-700 transition-colors">
                          {fmt.name}
                        </span>
                        <span className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono">
                          {fmt.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-gold-700 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Apply</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-[11px] text-gold-800 font-medium">
                      {fmt.tagline}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                      {fmt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Royal Color Palettes */}
            <div className="space-y-3">
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-gold-600" />
                  <span>Royal Color Combinations</span>
                </h4>
                <p className="text-[11px] text-stone-500">
                  Apply curated Rajputana, Mughal, and temple color themes with matching foil accents.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COLOR_THEME_PRESETS.map((colorway) => (
                  <div
                    key={colorway.id}
                    onClick={() => onApplyColorTheme && onApplyColorTheme(colorway)}
                    className="p-2.5 bg-white border border-stone-200 hover:border-gold-400 rounded-xl cursor-pointer transition-all hover:shadow-xs flex items-center gap-2.5 group"
                  >
                    <div
                      className="w-7 h-7 rounded-full border border-stone-300 shadow-inner flex items-center justify-center shrink-0"
                      style={{ backgroundColor: colorway.backgroundColor }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: colorway.borderColor }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-serif font-bold text-xs text-stone-900 group-hover:text-gold-700 transition-colors truncate">
                        {colorway.name}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate">
                        {colorway.borderColor} Foil
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MULTI-EVENTS SCHEDULER */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-800">Wedding Celebrations &amp; Functions</h4>
                <p className="text-[11px] text-stone-500">Haldi, Mehendi, Sangeet, Muhurtham &amp; Reception</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newEvent: WeddingEvent = {
                    id: `ev-${Date.now()}`,
                    name: 'Sangeet & Cocktail Night',
                    date: '2026-12-13',
                    time: '07:30 PM Onwards',
                    venue: 'Royal Palace Banquet',
                  };
                  onUpdateEvents([...events, newEvent]);
                }}
                className="flex items-center gap-1 text-xs text-gold-700 hover:text-gold-800 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event</span>
              </button>
            </div>

            {events.length === 0 ? (
              <div className="p-4 border border-dashed border-stone-300 rounded-xl text-center text-xs text-stone-500">
                No extra functions added yet. Click &quot;Add Event&quot; to list Haldi, Mehendi, or Reception.
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((ev, index) => (
                  <div key={ev.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800">Event #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateEvents(events.filter((e) => e.id !== ev.id))}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Remove Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Event Name (e.g. Haldi Ceremony)"
                      value={ev.name}
                      onChange={(e) =>
                        onUpdateEvents(
                          events.map((item) => (item.id === ev.id ? { ...item, name: e.target.value } : item))
                        )
                      }
                      className="w-full px-2.5 py-1 text-xs border border-stone-200 rounded bg-white"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={ev.date}
                        onChange={(e) =>
                          onUpdateEvents(
                            events.map((item) => (item.id === ev.id ? { ...item, date: e.target.value } : item))
                          )
                        }
                        className="px-2 py-1 text-xs border border-stone-200 rounded bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Time (e.g. 07:00 PM)"
                        value={ev.time}
                        onChange={(e) =>
                          onUpdateEvents(
                            events.map((item) => (item.id === ev.id ? { ...item, time: e.target.value } : item))
                          )
                        }
                        className="px-2 py-1 text-xs border border-stone-200 rounded bg-white"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Venue & Location"
                      value={ev.venue}
                      onChange={(e) =>
                        onUpdateEvents(
                          events.map((item) => (item.id === ev.id ? { ...item, venue: e.target.value } : item))
                        )
                      }
                      className="w-full px-2.5 py-1 text-xs border border-stone-200 rounded bg-white"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* POPUP MODAL: INDIAN WORDING & SHLOKAS LIBRARY */}
      {showWordingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-gold-900 via-maroon-800 to-gold-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold">Indian Wedding Wording &amp; Shloka Library</h3>
                <p className="text-xs text-gold-200">Select authentic prayers, shlokas &amp; invitation wordings</p>
              </div>
              <button
                type="button"
                onClick={() => setShowWordingModal(false)}
                className="text-white/80 hover:text-white text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Faith Filter Tabs */}
            <div className="flex items-center gap-1 p-2 bg-stone-100 border-b border-stone-200 overflow-x-auto">
              {['Hindu', 'Muslim', 'Sikh', 'South Indian', 'Contemporary'].map((faith) => (
                <button
                  key={faith}
                  type="button"
                  onClick={() => setWordingFaith(faith)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    wordingFaith === faith
                      ? 'bg-gold-500 text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {faith}
                </button>
              ))}
            </div>

            {/* Verses Scroll Area */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {INDIAN_WORDING_LIBRARY[wordingFaith]?.shlokasAndInvocations.map((shloka, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl hover:border-gold-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-800">{shloka.title}</span>
                    <button
                      type="button"
                      onClick={() => handleApplyShloka(shloka.originalText)}
                      className="px-2.5 py-1 bg-gold-500 hover:bg-gold-600 text-white text-[11px] font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Use this Wording</span>
                    </button>
                  </div>
                  <p className="text-sm font-serif font-semibold text-stone-900 whitespace-pre-line leading-relaxed mb-1">
                    {shloka.originalText}
                  </p>
                  {shloka.translation && (
                    <p className="text-[11px] text-stone-500 italic">
                      Meaning: {shloka.translation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

