'use client';

import React, { useState } from 'react';
import { Camera, Sparkles, Layers, Sliders, ArrowRight } from 'lucide-react';
import { CardScannerModal } from './CardScannerModal';

export const HomeScannerCta: React.FC = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <>
      <div className="mt-12 max-w-5xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-[#1C1815] to-[#2B231D] p-8 sm:p-10 border border-gold-500/30 shadow-2xl text-white">
          {/* Subtle gold decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>New AI Camera Studio</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Scan Any Physical Card with Your Camera
              </h3>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Found a card you love at an exhibition or received one from family? Hold it up to your device camera or upload a photo. We automatically extract its color palette and artwork to build an instant editable multi-page suite — including matching Inside Pages and Baraat visiting cards.
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs text-stone-300">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  <span>Real-time viewfinder</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  <span>Auto foil &amp; tone extraction</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  <span>6-Page Suite + Baraat Pass</span>
                </div>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-stone-950 font-serif font-bold text-sm tracking-wider uppercase shadow-lg shadow-gold-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group"
              >
                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Launch Camera Scanner</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>

              <span className="text-[11px] text-stone-400 text-center">
                Works with iPhone, Android, or laptop webcam
              </span>
            </div>
          </div>
        </div>
      </div>

      <CardScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </>
  );
};

