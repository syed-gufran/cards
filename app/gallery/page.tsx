'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DesignTemplate, WeddingCategory } from '@/types/wedding-card';
import { getTemplates } from '@/utils/storage';
import { BorderFrame } from '@/components/BordersAndFrames';
import { MotifIcon } from '@/components/MotifIcons';
import { AnimatedCardTilt } from '@/components/AnimatedCardTilt';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  X,
  SlidersHorizontal,
  Check,
  Camera,
} from 'lucide-react';
import { CardScannerModal } from '@/components/CardScannerModal';
import { CardFormatModal } from '@/components/CardFormatModal';

function GalleryContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [previewTemplate, setPreviewTemplate] = useState<DesignTemplate | null>(null);
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'All', label: 'All Collections (12)' },
    { id: 'Royal', label: 'Royal Rajputana' },
    { id: 'Muslim', label: 'Noor Nikah' },
    { id: 'Sikh', label: 'Anand Karaj' },
    { id: 'Hindu', label: 'Traditional Hindu' },
    { id: 'Minimal', label: 'Minimalist' },
    { id: 'Floral', label: 'Pastel Botanical' },
    { id: 'Luxury', label: 'Imperial Luxury' },
    { id: 'Modern', label: 'Modern & Destination' },
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Category filter
      if (selectedCategory !== 'All' && template.category !== selectedCategory) {
        return false;
      }
      // Price filter
      if (template.basePricePerCard > maxPrice) {
        return false;
      }
      // Search filter (by title, ID, or tags)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = template.title.toLowerCase().includes(q);
        const matchesId = template.id.toLowerCase().includes(q);
        const matchesTag = template.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesId && !matchesTag) {
          return false;
        }
      }
      return true;
    });
  }, [templates, selectedCategory, searchQuery, maxPrice]);

  const toggleCardFlip = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-[#FFFEFA] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Haute Stationery Catalog</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
            Invitation Design Gallery
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Select an invitation template to open in our live customisation studio, or scan any physical card using your camera to digitize and edit it.
          </p>
        </div>

        {/* Scan Any Card Camera Feature Banner */}
        <div className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-maroon-900 to-stone-900 text-white rounded-2xl border border-gold-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-400/40 text-gold-400 flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-gold-400 uppercase tracking-widest">
                New Smart Card Digitizer
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Have a Card You Already Love? Scan It!
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                Point your camera at any wedding card. We extract the artwork, colors, and place editable text so you can customize it immediately.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 hover:from-gold-500 hover:to-amber-600 text-stone-950 font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span>Scan With Camera</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, ID (e.g. ROYAL-RAJ-01)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Price Filter Slider */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs text-stone-600 font-medium whitespace-nowrap">
                Max Price: <strong className="text-stone-900 font-mono">₹{maxPrice}/card</strong>
              </span>
              <input
                type="range"
                min="50"
                max="80"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-gold-500 cursor-pointer w-32"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2 border-t border-stone-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gold-500 text-white shadow-sm font-semibold'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Count Bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
          <span>
            Showing <strong className="text-stone-800 font-medium">{filteredTemplates.length}</strong> of {templates.length} invitation designs
          </span>
          <span className="italic">Click card to open in live Customisation Studio</span>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="py-20 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-stone-700">No matching designs found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your search query, increasing your price range, or selecting &quot;All Collections&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setMaxPrice(100);
              }}
              className="px-4 py-2 bg-gold-500 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTemplates.map((template) => {
              const isFlipped = flippedCards[template.id] || false;
              const activeSideDesign = isFlipped ? template.backDesign : template.frontDesign;

              return (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="group rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm hover:shadow-xl hover:border-gold-400 transition-all flex flex-col"
                >
                  {/* Card Visual Stage with 3D Tilt */}
                  <AnimatedCardTilt maxTilt={8} className="w-full">
                    <div
                      className="relative aspect-[5/7] p-5 flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-colors animate-foil-sheen"
                      style={{ backgroundColor: activeSideDesign.backgroundValue }}
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <BorderFrame
                        style={activeSideDesign.borderStyle}
                        color={activeSideDesign.borderColor}
                        isFoil={activeSideDesign.borderFoilEffect}
                      />

                      {/* Top Motif / Emblem */}
                      <div className="flex justify-center z-10 pt-1">
                        {activeSideDesign.motifs[0] && (
                          <MotifIcon
                            type={activeSideDesign.motifs[0].type}
                            color={activeSideDesign.motifs[0].color}
                            size={40}
                          />
                        )}
                      </div>

                      {/* Center Typography Teaser */}
                      <div className="text-center z-10 my-auto space-y-1">
                        <div
                          className="text-[10px] tracking-widest uppercase font-serif"
                          style={{ color: activeSideDesign.borderColor }}
                        >
                          {isFlipped ? 'Itinerary & Celebrations' : `${template.category} Wedding`}
                        </div>
                        <div
                          className="font-serif text-xl font-bold leading-tight"
                          style={{ color: activeSideDesign.borderColor }}
                        >
                          {isFlipped
                            ? 'Events Program'
                            : `${template.sampleBrideName.split(' ')[0]} & ${template.sampleGroomName.split(' ')[0]}`}
                        </div>
                        <div
                          className="text-[10px] font-sans opacity-85"
                          style={{ color: activeSideDesign.borderColor }}
                        >
                          {isFlipped ? 'Haldi • Sangeet • Pheras' : template.sampleWeddingDate}
                        </div>
                      </div>

                      {/* Card Top Pill: Design ID & Front/Back Flip Button */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                        <span className="text-[9px] font-mono font-bold bg-black/40 backdrop-blur-xs text-white px-2 py-0.5 rounded">
                          {template.id}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleCardFlip(template.id, e)}
                          className="flex items-center gap-1 text-[10px] font-medium bg-white/90 hover:bg-white text-stone-800 px-2 py-0.5 rounded-full shadow-sm transition-all"
                          title="Flip Front/Back"
                        >
                          <Layers className="w-3 h-3 text-gold-600" />
                          <span>{isFlipped ? 'Show Front' : 'Show Back'}</span>
                        </button>
                      </div>

                      {/* Hover Inspect Pill */}
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity z-15 flex items-center justify-center pointer-events-none">
                        <span className="px-3.5 py-1.5 rounded-full bg-white text-stone-900 text-xs font-semibold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <Eye className="w-3.5 h-3.5 text-gold-600" />
                          <span>Quick Preview</span>
                        </span>
                      </div>
                    </div>
                  </AnimatedCardTilt>

                  {/* Card Description & Action Bar */}
                  <div className="p-4 flex-1 flex flex-col justify-between bg-white border-t border-stone-100">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-gold-700 tracking-wider uppercase font-mono">
                          {template.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-stone-900">
                          ₹{template.basePricePerCard}/card
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-gold-700 transition-colors mb-1">
                        {template.title}
                      </h3>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed mb-3">
                        {template.description}
                      </p>
                      <div className="text-[10px] text-stone-400 font-mono mb-3">
                        Size: {template.dimensions.label}
                      </div>
                    </div>

                    {/* Action CTA */}
                    <Link
                      href={`/editor/${template.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider text-center shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Customise Card</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* INTERACTIVE CARD FORMAT & COLORWAY PREVIEW MODAL */}
      <CardFormatModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />

      {/* Camera Card Scanner Modal */}
      <CardScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F2]">
          <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}
