'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSideDesign, SuitePageKey } from '@/types/wedding-card';
import { BorderFrame } from './BordersAndFrames';
import { MotifIcon } from './MotifIcons';
import { Sparkles, Eye, RotateCcw, X } from 'lucide-react';

interface InteractiveEnvelopePreviewProps {
  cardDesign: CardSideDesign;
  isOpen: boolean;
  onClose: () => void;
  coupleNames?: string;
  envelopeColor?: string;
}

export const InteractiveEnvelopePreview: React.FC<InteractiveEnvelopePreviewProps> = ({
  cardDesign,
  isOpen,
  onClose,
  coupleNames = 'Vikramaditya & Ananya',
  envelopeColor = '#2A1B18', // Deep Royal Velvet / Maroon
}) => {
  const [isUnsealed, setIsUnsealed] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-[#1E1916] to-[#120F0D] rounded-3xl p-6 sm:p-8 border border-gold-500/40 shadow-2xl text-white overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-gold-200">
                  Royal Invitation Unboxing Experience
                </h3>
                <p className="text-[11px] text-stone-400">
                  Interactive 3D preview of your physical stationery and wax seal
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Envelope & Card Canvas Stage */}
          <div className="relative h-[480px] sm:h-[520px] flex items-center justify-center overflow-hidden my-4">
            {/* The Envelope Pocket Base */}
            <div className="relative w-[340px] sm:w-[400px] h-[250px] sm:h-[280px] mt-24">
              {/* Back Interior Layer with Gold Filigree Lining */}
              <div
                className="absolute inset-0 rounded-b-2xl shadow-2xl border border-gold-500/20"
                style={{
                  backgroundColor: envelopeColor,
                  backgroundImage:
                    'radial-gradient(circle at 50% 30%, rgba(212,175,55,0.15) 0%, transparent 70%)',
                }}
              />

              {/* The Wedding Card (Slides out when unsealed) */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-[240px] sm:w-[270px] aspect-[5/7] rounded-xl shadow-2xl overflow-hidden cursor-pointer select-none border border-gold-300/40"
                style={{
                  backgroundColor: cardDesign.backgroundValue,
                }}
                initial={{ y: 20, zIndex: 10, scale: 0.95 }}
                animate={
                  isUnsealed
                    ? { y: -140, zIndex: 30, scale: 1, rotateZ: -1 }
                    : { y: 15, zIndex: 10, scale: 0.92, rotateZ: 0 }
                }
                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
              >
                {/* Border & Foil */}
                <BorderFrame
                  style={cardDesign.borderStyle}
                  color={cardDesign.borderColor}
                  isFoil={true}
                />

                {/* Motifs */}
                {cardDesign.motifs.slice(0, 1).map((m) => (
                  <div
                    key={m.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${m.position.xPercent}%`, top: `${m.position.yPercent}%` }}
                  >
                    <MotifIcon type={m.type} color={m.color} size={m.size * 0.65} />
                  </div>
                ))}

                {/* Card Text Elements */}
                <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
                  {cardDesign.elements.map((el) => (
                    <div
                      key={el.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 whitespace-pre-line leading-tight"
                      style={{
                        left: `${el.xPercent}%`,
                        top: `${el.yPercent}%`,
                        width: '85%',
                        fontSize: `clamp(6px, ${el.fontSize * 0.22}px, 12px)`,
                        color: el.color,
                        fontWeight: el.fontWeight || 'normal',
                        fontStyle: el.fontStyle || 'normal',
                        textAlign: el.textAlign || 'center',
                        fontFamily:
                          el.fontFamily === 'serif'
                            ? 'var(--font-cormorant), Georgia, serif'
                            : 'var(--font-jakarta), sans-serif',
                      }}
                    >
                      {el.text}
                    </div>
                  ))}
                </div>

                {/* Shimmer sweep */}
                <div className="absolute inset-0 animate-foil-sheen pointer-events-none" />
              </motion.div>

              {/* Envelope Front Left & Right Fold Flaps */}
              <div
                className="absolute inset-0 rounded-b-2xl pointer-events-none z-20"
                style={{
                  background: `linear-gradient(135deg, ${envelopeColor} 0%, rgba(20,15,13,0.95) 100%)`,
                  clipPath: 'polygon(0% 0%, 50% 55%, 100% 0%, 100% 100%, 0% 100%)',
                  boxShadow: '0 -4px 15px rgba(0,0,0,0.5)',
                }}
              />

              {/* Envelope Top Triangular Flap (Folds open in 3D) */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[140px] origin-top z-25 cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={
                  isUnsealed
                    ? { rotateX: 180, zIndex: 5 }
                    : { rotateX: 0, zIndex: 25 }
                }
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                onClick={() => setIsUnsealed(!isUnsealed)}
              >
                {/* Flap Outer Side */}
                <div
                  className="w-full h-full shadow-lg border-t border-gold-500/20"
                  style={{
                    backgroundColor: envelopeColor,
                    clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  }}
                />

                {/* Wax Seal Stamp on the Flap Tip */}
                <motion.div
                  className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 via-gold-500 to-amber-700 shadow-xl border-2 border-gold-300 flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform"
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Wax Seal Rim Detailing */}
                  <div className="w-11 h-11 rounded-full border border-amber-900/60 flex items-center justify-center text-center shadow-inner bg-gold-600/30">
                    <span className="font-serif font-bold text-[10px] tracking-wider text-amber-950 uppercase">
                      ROYAL
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10">
            <span className="text-xs text-stone-300">
              {isUnsealed ? 'Card extracted from envelope' : 'Click the gold wax seal to unbox'}
            </span>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsUnsealed(!isUnsealed)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-stone-950 font-serif font-bold text-xs uppercase tracking-wider shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                {isUnsealed ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Seal Envelope</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unseal &amp; Open Envelope</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

