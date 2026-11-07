'use client';

import React, { useState } from 'react';
import {
  CardSideDesign,
  CardTextElement,
  BorderStyle,
  MotifType,
  WeddingEvent,
} from '@/types/wedding-card';
import { INDIAN_WORDING_LIBRARY } from '@/data/indian-wording-library';
import { MotifIcon } from './MotifIcons';
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Upload,
} from 'lucide-react';

interface CardEditorControlsProps {
  currentSide: 'front' | 'back';
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
}

export const CardEditorControls: React.FC<CardEditorControlsProps> = ({
  currentSide,
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
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'typography' | 'design' | 'events' | 'photo'>('text');
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onUpdateSideDesign((prev) => ({
        ...prev,
        userPhotoUrl: result,
        userPhotoPosition: { xPercent: 50, yPercent: 25, widthPercent: 22 },
      }));
    };
    reader.readAsDataURL(file);
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

  const backgroundPresets = [
    { label: 'Warm Royal Ivory', value: '#FAF8F2' },
    { label: 'Deep Crimson Velvet', value: '#4D0711' },
    { label: 'Mughal Emerald Green', value: '#022C22' },
    { label: 'Midnight Constellation', value: '#0B1120' },
    { label: 'Pichwai Sage', value: '#23382E' },
    { label: 'Blush Rose Silk', value: '#FFF8F6' },
    { label: 'Imperial Noir Slate', value: '#141414' },
    { label: 'Pure Pearl Linen', value: '#FFFEFA' },
  ];

  const borderStyles: Array<{ id: BorderStyle; label: string }> = [
    { id: 'royal-filigree', label: 'Royal Filigree & Crest' },
    { id: 'mughal-arch', label: 'Mughal Polylobed Arch' },
    { id: 'mandala-corner', label: 'Mandala Corner Medallions' },
    { id: 'ornate-gold', label: '24K Ornate Gold Frame' },
    { id: 'minimal-double', label: 'Minimalist Double Hairline' },
    { id: 'floral-vine', label: 'Botanical Floral Vines' },
    { id: 'pichwai-arch', label: 'Pichwai Temple Arch' },
    { id: 'geometric-jali', label: 'Islamic Star & Jali Lattice' },
  ];

  const motifOptions: Array<{ type: MotifType; label: string }> = [
    { type: 'ganesha', label: 'Lord Ganesha' },
    { type: 'bismillah', label: 'Bismillah Calligraphy' },
    { type: 'ek_onkar', label: 'Ik Onkar Symbol' },
    { type: 'kalash', label: 'Sacred Kalash' },
    { type: 'lotus', label: 'Padma Lotus' },
    { type: 'peacock', label: 'Royal Peacock' },
    { type: 'doli', label: 'Bridal Doli' },
    { type: 'monogram', label: 'Monogram Wreath' },
    { type: 'rings', label: 'Sparkling Rings' },
    { type: 'paisley', label: 'Kashmiri Paisley' },
    { type: 'none', label: 'No Motif' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-l border-stone-200 shadow-xl overflow-hidden">
      {/* Top Header with History Controls */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-stone-50 border-b border-stone-200">
        <div>
          <h3 className="font-serif font-bold text-base text-stone-900 tracking-wide">
            Design Studio Controls
          </h3>
          <p className="text-[11px] text-stone-500">
            Editing {currentSide === 'front' ? 'Front Side' : 'Back Side (Itinerary)'}
          </p>
        </div>

        {/* History Action Buttons */}
        <div className="flex items-center gap-1">
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
            className="p-1.5 text-stone-600 hover:text-rose-700 rounded hover:bg-rose-50 transition-colors ml-1"
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
          <span>Wording & Names</span>
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
          <span>Typography</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('design')}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'design'
              ? 'border-gold-500 text-gold-700 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Motifs & Frame</span>
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

        <button
          type="button"
          onClick={() => setActiveTab('photo')}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'photo'
              ? 'border-gold-500 text-gold-700 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Monogram / Photo</span>
        </button>
      </div>

      {/* Main Tab Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* TAB 1: WORDING & TEXT FIELDS */}
        {activeTab === 'text' && (
          <div className="space-y-4">
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

        {/* TAB 3: MOTIFS & DESIGN FRAMES */}
        {activeTab === 'design' && (
          <div className="space-y-5">
            {/* Background Color Palette */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Card Background Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {backgroundPresets.map((bg) => (
                  <button
                    key={bg.value}
                    type="button"
                    onClick={() =>
                      onUpdateSideDesign((prev) => ({
                        ...prev,
                        backgroundValue: bg.value,
                      }))
                    }
                    className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border text-center transition-all ${
                      sideDesign.backgroundValue === bg.value
                        ? 'border-gold-500 ring-1 ring-gold-500 bg-gold-50/30'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span
                      className="w-8 h-8 rounded-md border border-stone-300 shadow-inner"
                      style={{ backgroundColor: bg.value }}
                    />
                    <span className="text-[10px] text-stone-700 leading-tight">
                      {bg.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Decorative Border Frame Style */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Decorative Border Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {borderStyles.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() =>
                      onUpdateSideDesign((prev) => ({
                        ...prev,
                        borderStyle: b.id,
                      }))
                    }
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      sideDesign.borderStyle === b.id
                        ? 'border-gold-500 bg-gold-50/50 font-bold text-gold-900 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Traditional Indian Motifs Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Traditional Indian Motifs
              </label>
              <div className="grid grid-cols-3 gap-2">
                {motifOptions.map((m) => {
                  const currentMotifType = sideDesign.motifs[0]?.type || 'none';
                  const isSelected = currentMotifType === m.type;

                  return (
                    <button
                      key={m.type}
                      type="button"
                      onClick={() => {
                        if (m.type === 'none') {
                          onUpdateSideDesign((prev) => ({ ...prev, motifs: [] }));
                        } else {
                          onUpdateSideDesign((prev) => ({
                            ...prev,
                            motifs: [
                              {
                                id: `motif-${Date.now()}`,
                                type: m.type,
                                position: { xPercent: 50, yPercent: 12 },
                                size: 54,
                                color: sideDesign.borderColor || '#D4AF37',
                              },
                            ],
                          }));
                        }
                      }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'border-gold-500 bg-gold-50/50 font-semibold text-gold-900 shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <div className="w-9 h-9 flex items-center justify-center">
                        <MotifIcon type={m.type} size={32} color="#D4AF37" />
                      </div>
                      <span className="text-[10px] leading-tight">{m.label}</span>
                    </button>
                  );
                })}
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

        {/* TAB 5: PHOTO & MONOGRAM UPLOAD */}
        {activeTab === 'photo' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-stone-800">Upload Couple Portrait or Family Crest</h4>
              <p className="text-[11px] text-stone-500">
                Incorporate your pre-wedding portrait or custom gold foil monogram onto the card.
              </p>
            </div>

            <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center hover:border-gold-400 transition-colors bg-stone-50/50">
              <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-xs text-stone-700 font-medium mb-1">
                Upload High-Resolution Photo or PNG Logo
              </p>
              <p className="text-[10px] text-stone-400 mb-3">PNG, JPG, SVG up to 10MB</p>
              <label className="inline-block px-4 py-2 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 shadow-sm hover:bg-stone-50 cursor-pointer">
                Select File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {sideDesign.userPhotoUrl && (
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sideDesign.userPhotoUrl}
                    alt="Uploaded photo"
                    className="w-12 h-12 rounded-full object-cover border border-gold-400"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-800">Photo Placed on Card</span>
                    <p className="text-[10px] text-stone-500">Rendered in high resolution</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSideDesign((prev) => ({
                      ...prev,
                      userPhotoUrl: undefined,
                    }))
                  }
                  className="text-stone-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
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

