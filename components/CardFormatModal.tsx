'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DesignTemplate, CardSideDesign } from '@/types/wedding-card';
import { BorderFrame } from './BordersAndFrames';
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
  convertSideDesignLanguage,
} from '@/utils/card-translator';
import { saveCurrentProject, getTemplateById, saveTemplate } from '@/utils/storage';
import { getDefaultSuitePages } from '@/utils/suite-pages';
import {
  X,
  Sparkles,
  Palette,
  AlignLeft,
  Globe,
  ArrowRight,
  Check,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface CardFormatModalProps {
  template: DesignTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CardFormatModal: React.FC<CardFormatModalProps> = ({
  template,
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  // Selected format and colorway states
  const [selectedFormatId, setSelectedFormatId] = useState<string>('royal-rajputana');
  const [selectedColorId, setSelectedColorId] = useState<string>('crimson-gold');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState<'formats' | 'colors' | 'language'>('formats');
  const [isOpeningStudio, setIsOpeningStudio] = useState<boolean>(false);

  if (!isOpen || !template) return null;

  const currentTheme =
    COLOR_THEME_PRESETS.find((c) => c.id === selectedColorId) || COLOR_THEME_PRESETS[0];
  const currentFormat =
    TEXT_FORMAT_PRESETS.find((f) => f.id === selectedFormatId) || TEXT_FORMAT_PRESETS[0];

  // Dynamically synthesize the live preview side design
  let previewDesign: CardSideDesign = {
    backgroundType: 'solid',
    backgroundValue: currentTheme.backgroundColor,
    borderStyle: template.frontDesign.borderStyle || 'royal-filigree',
    borderColor: currentTheme.borderColor,
    borderFoilEffect: currentTheme.borderFoilEffect,
    motifs: [
      {
        id: 'format-motif-1',
        type: template.frontDesign.motifs[0]?.type || 'ganesha',
        position: { xPercent: 50, yPercent: 12 },
        size: 40,
        color: currentTheme.motifColor,
      },
    ],
    elements: currentFormat.elements.map((el) => {
      // Substitute couple names if available
      let text = el.text;
      if (el.category === 'couple' && el.label.includes("Bride's Name")) {
        text = template.sampleBrideName || 'Ananya Sharma';
      } else if (el.category === 'couple' && el.label.includes("Groom's Name")) {
        text = template.sampleGroomName || 'Rohan Singhania';
      }

      const isPrimary = el.category === 'couple' || el.category === 'religious';
      return {
        id: el.id,
        label: el.label,
        category: el.category,
        text,
        defaultText: text,
        xPercent: 50,
        yPercent: el.yPercent,
        fontSize: el.fontSize,
        fontFamily: 'serif',
        color: isPrimary ? currentTheme.primaryTextColor : currentTheme.accentTextColor,
        fontWeight: el.fontWeight,
        fontStyle: el.fontStyle,
        letterSpacing: el.letterSpacing,
        textAlign: 'center',
      };
    }),
  };

  // Apply language conversion if selected
  if (selectedLanguage !== 'en') {
    previewDesign = convertSideDesignLanguage(previewDesign, selectedLanguage);
  }

  // Handle proceed to Studio
  const handleLaunchStudio = () => {
    if (isOpeningStudio) return;
    setIsOpeningStudio(true);

    // Apply the configured styling & format to the template in storage
    const updatedTemplate: DesignTemplate = {
      ...template,
      themeColor: currentTheme.borderColor,
      frontDesign: {
        ...previewDesign,
      },
    };

    // Re-generate matching suite pages with this new palette
    const fullPages = getDefaultSuitePages(updatedTemplate);
    fullPages.coverFront = previewDesign;

    // Save current project state so studio loads with this configuration immediately
    saveCurrentProject({
      id: `project-${template.id}`,
      templateId: template.id,
      updatedAt: new Date().toISOString(),
      suitePages: fullPages,
      frontDesign: previewDesign,
      backDesign: fullPages.coverBack,
      events: [
        {
          id: 'ev-1',
          name: 'Mehendi & Sangeet',
          date: '2026-12-13',
          time: '07:00 PM',
          venue: 'The Durbar Hall',
        },
        {
          id: 'ev-2',
          name: 'Vivah Muhurtham & Pheras',
          date: '2026-12-14',
          time: '07:30 PM',
          venue: 'Palace Courtyard Lawns',
        },
      ],
      specs: {
        sizeId: '5x7',
        paperTypeId: 'velvet-board',
        finishId: 'gold-foil',
        envelopeId: 'gold-lined',
        sides: 'double',
        quantity: 150,
      },
    });

    onClose();
    router.push(`/editor/${template.id}`);
    setTimeout(() => {
      if (typeof window !== 'undefined' && !window.location.pathname.includes(template.id)) {
        window.location.href = `/editor/${template.id}`;
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-gold-200 flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F2]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-pulse" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
              Personalise Design &amp; Layout Options
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* LEFT: Live Dynamic Preview */}
          <div className="lg:col-span-5 p-6 bg-[#FAF7F2] border-b lg:border-b-0 lg:border-r border-stone-200 flex flex-col items-center justify-center">
            <div className="text-center mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-700 font-bold">
                Live Interactive Proof
              </span>
              <p className="text-xs text-stone-500">
                Format: <strong className="text-stone-800">{currentFormat.name}</strong> • Theme: <strong className="text-stone-800">{currentTheme.name}</strong>
              </p>
            </div>

            {/* Simulated Invitation Card Preview */}
            <div
              className="relative w-56 sm:w-64 aspect-[5/7] rounded-xl overflow-hidden shadow-2xl p-4 flex flex-col justify-between transition-all duration-300 animate-foil-sheen"
              style={{ backgroundColor: previewDesign.backgroundValue }}
            >
              <BorderFrame
                style={previewDesign.borderStyle}
                color={previewDesign.borderColor}
                isFoil={previewDesign.borderFoilEffect}
              />

              {/* Motif */}
              <div className="flex justify-center z-10 pt-1">
                {previewDesign.motifs[0] && (
                  <MotifIcon
                    type={previewDesign.motifs[0].type}
                    color={previewDesign.motifs[0].color}
                    size={36}
                  />
                )}
              </div>

              {/* Text Elements Live Rendering */}
              <div className="relative flex-1 z-10 my-auto flex flex-col justify-center items-center text-center space-y-1 py-1">
                {previewDesign.elements.map((el) => (
                  <div
                    key={el.id}
                    style={{
                      color: el.color,
                      fontSize: `${Math.max(8, el.fontSize * 0.44)}px`,
                      fontWeight: el.fontWeight,
                      fontStyle: el.fontStyle,
                      letterSpacing: el.letterSpacing ? `${el.letterSpacing * 0.5}px` : undefined,
                      lineHeight: 1.25,
                    }}
                    className="font-serif leading-tight max-w-[90%] whitespace-pre-line"
                  >
                    {el.text}
                  </div>
                ))}
              </div>

              {/* Card Footer Tag */}
              <div className="z-10 flex justify-between items-center text-[8px] font-mono opacity-60 text-center">
                <span style={{ color: previewDesign.borderColor }}>
                  {template.id}
                </span>
                <span style={{ color: previewDesign.borderColor }}>
                  {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.nativeName}
                </span>
              </div>
            </div>

            {/* Quick Language Pill Bar below preview */}
            <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-stone-500 font-medium mr-1">Language:</span>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    selectedLanguage === lang.code
                      ? 'bg-gold-600 text-white shadow-xs font-semibold'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{lang.flag} {lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Format, Color, and Language Customisation Controls */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Category Sub-tabs */}
              <div className="flex border-b border-stone-200 pb-2 mb-4 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('formats')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'formats'
                      ? 'bg-gold-500 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>1. Text &amp; Layout Formats</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('colors')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'colors'
                      ? 'bg-gold-500 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>2. Color Combinations</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('language')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'language'
                      ? 'bg-gold-500 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>3. Language</span>
                </button>
              </div>

              {/* TAB 1: TEXT FORMAT PRESETS */}
              {activeTab === 'formats' && (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  <p className="text-xs text-stone-500 mb-2">
                    Choose a wording &amp; typography layout format. You can customize all names, dates, and venues in the studio.
                  </p>
                  {TEXT_FORMAT_PRESETS.map((format) => {
                    const isSelected = selectedFormatId === format.id;
                    return (
                      <div
                        key={format.id}
                        onClick={() => setSelectedFormatId(format.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-gold-500 bg-gold-50/50 shadow-xs ring-1 ring-gold-400'
                            : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-sm text-stone-900">
                              {format.name}
                            </span>
                            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono">
                              {format.badge}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-gold-600" />}
                        </div>
                        <p className="text-xs text-gold-800 font-medium mb-1">
                          {format.tagline}
                        </p>
                        <p className="text-[11px] text-stone-500 leading-relaxed">
                          {format.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: COLORWAY COMBINATIONS */}
              {activeTab === 'colors' && (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  <p className="text-xs text-stone-500 mb-2">
                    Pick a curated royal palette. Each combination pairs authentic background silk/velvet tones with hot metallic foil.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {COLOR_THEME_PRESETS.map((colorway) => {
                      const isSelected = selectedColorId === colorway.id;
                      return (
                        <div
                          key={colorway.id}
                          onClick={() => setSelectedColorId(colorway.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'border-gold-500 bg-gold-50/50 shadow-xs ring-1 ring-gold-400'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                          }`}
                        >
                          {/* Color Swatch Dot */}
                          <div className="relative mt-0.5 shrink-0">
                            <div
                              className="w-8 h-8 rounded-full border border-stone-300 shadow-sm flex items-center justify-center overflow-hidden"
                              style={{ backgroundColor: colorway.backgroundColor }}
                            >
                              <div
                                className="w-3.5 h-3.5 rounded-full shadow-inner"
                                style={{ backgroundColor: colorway.borderColor }}
                              />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-serif font-bold text-xs text-stone-900 truncate">
                                {colorway.name}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-gold-600 shrink-0" />}
                            </div>
                            <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5">
                              {colorway.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: LANGUAGE TRANSLATOR */}
              {activeTab === 'language' && (
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  <p className="text-xs text-stone-500 mb-2">
                    Convert the whole invitation wording into your regional language with 1 click. You can still modify every single line.
                  </p>
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = selectedLanguage === lang.code;
                    return (
                      <div
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.code)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-gold-500 bg-gold-50/50 shadow-xs ring-1 ring-gold-400'
                            : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{lang.flag}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-sm text-stone-900">
                                {lang.name}
                              </span>
                              <span className="text-xs font-semibold text-gold-700 bg-gold-100/70 px-2 py-0.5 rounded-md">
                                {lang.nativeName}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {lang.description}
                            </p>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-gold-600" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-stone-500">
                <span>Selected: </span>
                <strong className="text-stone-800">{currentFormat.name}</strong> •{' '}
                <strong className="text-stone-800">{currentTheme.name}</strong>
              </div>

              <button
                type="button"
                disabled={isOpeningStudio}
                onClick={handleLaunchStudio}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-gold-600 via-gold-500 to-amber-600 hover:from-gold-700 hover:to-amber-700 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isOpeningStudio ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Loading Studio...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Customise this Design &amp; Open Studio →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
