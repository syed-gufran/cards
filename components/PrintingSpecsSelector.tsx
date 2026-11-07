'use client';

import React from 'react';
import {
  PrintingSpecification,
  PriceBreakdown,
} from '@/types/wedding-card';
import {
  CARD_SIZES,
  PAPER_TYPES,
  FINISHES,
  ENVELOPES,
  QUANTITY_OPTIONS,
  calculatePrice,
} from '@/data/pricing-data';
import {
  Sparkles,
  Layers,
  Mail,
  ShieldCheck,
  Truck,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

interface PrintingSpecsSelectorProps {
  basePricePerCard: number;
  specs: PrintingSpecification;
  onChangeSpecs: (newSpecs: PrintingSpecification) => void;
  onProceedToCheckout?: () => void;
}

export const PrintingSpecsSelector: React.FC<PrintingSpecsSelectorProps> = ({
  basePricePerCard,
  specs,
  onChangeSpecs,
  onProceedToCheckout,
}) => {
  const priceBreakdown: PriceBreakdown = calculatePrice(basePricePerCard, specs);

  const updateSpec = <K extends keyof PrintingSpecification>(
    key: K,
    value: PrintingSpecification[K]
  ) => {
    onChangeSpecs({ ...specs, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto py-6">
      {/* LEFT COLUMN: SPECIFICATIONS CONFIGURATOR (7 Cols) */}
      <div className="lg:col-span-7 space-y-8">
        {/* Step 1: Card Dimensions */}
        <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 text-xs font-bold flex items-center justify-center font-mono">
              1
            </span>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Card Dimensions &amp; Format
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CARD_SIZES.map((size) => {
              const isSelected = specs.sizeId === size.id;
              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => updateSpec('sizeId', size.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-gold-500 bg-gold-50/50 ring-2 ring-gold-400 font-semibold'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-800 mb-0.5">{size.label}</div>
                  <div className="text-[11px] text-stone-500 font-mono">{size.dimensions}</div>
                </button>
              );
            })}
          </div>

          {/* Single vs Double Sided */}
          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-800">Print Sides</span>
              <p className="text-[11px] text-stone-500">Include wedding itinerary on reverse</p>
            </div>
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => updateSpec('sides', 'single')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  specs.sides === 'single'
                    ? 'bg-white shadow-xs text-stone-900 font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Single Sided
              </button>
              <button
                type="button"
                onClick={() => updateSpec('sides', 'double')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  specs.sides === 'double'
                    ? 'bg-gold-500 text-white shadow-xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Double Sided (+35%)
              </button>
            </div>
          </div>
        </section>

        {/* Step 2: Luxury Paper & Board Stock */}
        <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 text-xs font-bold flex items-center justify-center font-mono">
              2
            </span>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Paper Stock &amp; Weight (GSM)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {PAPER_TYPES.map((paper) => {
              const isSelected = specs.paperTypeId === paper.id;
              return (
                <div
                  key={paper.id}
                  onClick={() => updateSpec('paperTypeId', paper.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-gold-500 bg-gold-50/50 ring-2 ring-gold-400'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-800">{paper.name}</span>
                    <span className="text-xs font-mono font-bold text-gold-700">
                      {paper.surchargePerCard > 0 ? `+₹${paper.surchargePerCard}/card` : 'Included'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    {paper.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 3: Artisan Finishes & Metallic Foiling */}
        <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 text-xs font-bold flex items-center justify-center font-mono">
              3
            </span>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Artisan Foiling &amp; Finishes
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {FINISHES.map((finish) => {
              const isSelected = specs.finishId === finish.id;
              return (
                <div
                  key={finish.id}
                  onClick={() => updateSpec('finishId', finish.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-gold-500 bg-gold-50/50 ring-2 ring-gold-400'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      {finish.colorHex && (
                        <span
                          className="w-3 h-3 rounded-full shadow-xs"
                          style={{ backgroundColor: finish.colorHex }}
                        />
                      )}
                      {finish.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-gold-700">
                      {finish.surchargePerCard > 0 ? `+₹${finish.surchargePerCard}/card` : 'Standard'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    {finish.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 4: Luxury Envelopes & Wax Seals */}
        <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 text-xs font-bold flex items-center justify-center font-mono">
              4
            </span>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Envelope Styling &amp; Custom Wax Seal
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ENVELOPES.map((env) => {
              const isSelected = specs.envelopeId === env.id;
              return (
                <div
                  key={env.id}
                  onClick={() => updateSpec('envelopeId', env.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-gold-500 bg-gold-50/50 ring-2 ring-gold-400'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-800">{env.name}</span>
                    <span className="text-xs font-mono font-bold text-gold-700">
                      {env.pricePerUnit > 0 ? `+₹${env.pricePerUnit}/unit` : 'None'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    {env.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 5: Quantity & Bulk Discount Selector */}
        <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 text-xs font-bold flex items-center justify-center font-mono">
              5
            </span>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Quantity &amp; Bulk Tier Discounts
            </h3>
          </div>
          <p className="text-xs text-stone-500 mb-4">
            Order more to unlock volume savings up to 25% off the complete order.
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {QUANTITY_OPTIONS.map((qty) => {
              const isSelected = specs.quantity === qty;
              return (
                <button
                  key={qty}
                  type="button"
                  onClick={() => updateSpec('quantity', qty)}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-gold-500 bg-gold-500 text-white font-bold shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 text-stone-800 font-medium bg-stone-50/50'
                  }`}
                >
                  <div className="text-sm font-mono">{qty}</div>
                  <div className="text-[9px] opacity-80 uppercase tracking-tighter">cards</div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN: DYNAMIC PRICING ENGINE & SUMMARY (5 Cols) */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 bg-white rounded-2xl border border-stone-200 shadow-xl p-6 overflow-hidden">
          {/* Header */}
          <div className="border-b border-stone-100 pb-4 mb-4">
            <span className="text-[10px] font-bold tracking-widest text-gold-700 uppercase font-mono">
              Transparent Estimate
            </span>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Printing Cost Summary
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Calculating for <strong className="text-stone-800">{specs.quantity} cards</strong>
            </p>
          </div>

          {/* Itemized Calculations */}
          <div className="space-y-3 text-xs text-stone-600">
            <div className="flex justify-between items-center">
              <span>Base Card Printing ({specs.quantity} × ₹{Math.round(priceBreakdown.baseCardTotal / specs.quantity)})</span>
              <span className="font-mono text-stone-900 font-medium">₹{priceBreakdown.baseCardTotal.toLocaleString('en-IN')}</span>
            </div>

            {priceBreakdown.paperSurchargeTotal > 0 && (
              <div className="flex justify-between items-center">
                <span>Premium Paper Surcharge</span>
                <span className="font-mono text-stone-900 font-medium">+₹{priceBreakdown.paperSurchargeTotal.toLocaleString('en-IN')}</span>
              </div>
            )}

            {priceBreakdown.finishSurchargeTotal > 0 && (
              <div className="flex justify-between items-center">
                <span>Artisan Foiling / Embossing</span>
                <span className="font-mono text-stone-900 font-medium">+₹{priceBreakdown.finishSurchargeTotal.toLocaleString('en-IN')}</span>
              </div>
            )}

            {priceBreakdown.doubleSidedSurchargeTotal > 0 && (
              <div className="flex justify-between items-center">
                <span>Double-Sided Itinerary Printing</span>
                <span className="font-mono text-stone-900 font-medium">+₹{priceBreakdown.doubleSidedSurchargeTotal.toLocaleString('en-IN')}</span>
              </div>
            )}

            {priceBreakdown.envelopeTotal > 0 && (
              <div className="flex justify-between items-center">
                <span>Matching Luxury Envelopes</span>
                <span className="font-mono text-stone-900 font-medium">+₹{priceBreakdown.envelopeTotal.toLocaleString('en-IN')}</span>
              </div>
            )}

            {priceBreakdown.volumeDiscountAmount > 0 && (
              <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                <span className="font-semibold">Volume Tier Discount ({priceBreakdown.volumeDiscountPercent}% OFF)</span>
                <span className="font-mono font-bold">-₹{priceBreakdown.volumeDiscountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="border-t border-stone-200 pt-2 flex justify-between items-center text-stone-700">
              <span>Subtotal</span>
              <span className="font-mono font-bold">₹{priceBreakdown.subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center text-stone-500">
              <span>Stationery GST (18%)</span>
              <span className="font-mono">₹{priceBreakdown.taxGstAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center text-stone-500">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Insured Express Shipping</span>
              </span>
              <span className="font-mono">
                {priceBreakdown.shippingAmount === 0 ? (
                  <span className="text-emerald-700 font-semibold">FREE (Above ₹15K)</span>
                ) : (
                  `₹${priceBreakdown.shippingAmount}`
                )}
              </span>
            </div>
          </div>

          {/* Grand Total Box */}
          <div className="mt-5 p-4 bg-gradient-to-br from-gold-50 to-amber-100/50 rounded-xl border border-gold-200">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
                Grand Total
              </span>
              <div className="text-right">
                <span className="font-serif text-2xl font-bold text-stone-900">
                  ₹{priceBreakdown.grandTotal.toLocaleString('en-IN')}
                </span>
                <p className="text-[10px] text-stone-500">
                  (₹{(priceBreakdown.grandTotal / specs.quantity).toFixed(1)} per full invitation suite)
                </p>
              </div>
            </div>

            {/* Advance Booking Note */}
            <div className="mt-3 pt-3 border-t border-gold-200/80 flex items-center justify-between text-xs">
              <span className="text-stone-700 font-medium">25% Advance Booking Deposit:</span>
              <span className="font-mono font-bold text-gold-900">
                ₹{priceBreakdown.advancePayable.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Proceed CTA */}
          {onProceedToCheckout && (
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="mt-5 w-full py-3.5 px-6 bg-gradient-to-r from-gold-600 via-gold-500 to-amber-600 hover:from-gold-700 hover:to-amber-700 text-white font-serif font-bold text-base rounded-xl shadow-lg transition-all transform active:scale-[0.99] text-center"
            >
              Review Proof &amp; Proceed to Order →
            </button>
          )}

          {/* Production Guarantee Badges */}
          <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Quality &amp; Defect-Free Print Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Digital Proof PDF verified before printing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

