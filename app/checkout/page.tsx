'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Order,
  CustomerDetails,
  PrintingSpecification,
  DesignTemplate,
  CardSideDesign,
  WeddingEvent,
  SuitePageKey,
} from '@/types/wedding-card';
import {
  getTemplateById,
  loadCurrentProject,
  createOrder,
} from '@/utils/storage';
import { getDefaultSuitePages, SUITE_PAGE_LABELS } from '@/utils/suite-pages';
import { calculatePrice } from '@/data/pricing-data';
import { PrintingSpecsSelector } from '@/components/PrintingSpecsSelector';
import { BorderFrame } from '@/components/BordersAndFrames';
import { MotifIcon } from '@/components/MotifIcons';
import { AnimatedCardTilt } from '@/components/AnimatedCardTilt';
import { InteractiveEnvelopePreview } from '@/components/InteractiveEnvelopePreview';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePrintReadyPdf, generateCustomerProofPdf, validateOrderForPrint } from '@/utils/pdf-generator';
import {
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  CreditCard,
  Lock,
  FileCheck,
  Truck,
  Sparkles,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('templateId');

  const [template, setTemplate] = useState<DesignTemplate | null>(null);
  const [frontDesign, setFrontDesign] = useState<CardSideDesign | null>(null);
  const [backDesign, setBackDesign] = useState<CardSideDesign | null>(null);
  const [suitePages, setSuitePages] = useState<Record<SuitePageKey, CardSideDesign> | null>(null);
  const [events, setEvents] = useState<WeddingEvent[]>([]);

  // Step 1: Specs, Step 2: Proof & Address, Step 3: Payment
  const [currentStep, setCurrentStep] = useState<'specs' | 'review' | 'payment'>('specs');
  const [previewPageKey, setPreviewPageKey] = useState<SuitePageKey>('coverFront');
  const [envelopeModalOpen, setEnvelopeModalOpen] = useState(false);

  // Printing Specs
  const [specs, setSpecs] = useState<PrintingSpecification>({
    sizeId: '5x7',
    paperTypeId: 'velvet-board',
    finishId: 'gold-foil',
    envelopeId: 'gold-lined',
    sides: 'double',
    quantity: 150,
  });

  // Customer Details Form
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    shippingAddress: '',
    city: '',
    state: 'Delhi',
    pincode: '',
    notes: '',
  });

  // Mandatory Proof Confirmation Checkbox
  const [proofConfirmed, setProofConfirmed] = useState<boolean>(false);
  const [paymentOption, setPaymentOption] = useState<'advance' | 'full'>('advance');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const savedProject = loadCurrentProject();
    const effectiveTemplateId = savedProject?.templateId || templateIdParam || 'ROYAL-RAJ-01';
    const t = getTemplateById(effectiveTemplateId);

    if (t) {
      setTemplate(t);
      if (savedProject && savedProject.templateId === t.id) {
        setFrontDesign(savedProject.frontDesign);
        setBackDesign(savedProject.backDesign);
        if (savedProject.suitePages) {
          setSuitePages(savedProject.suitePages as Record<SuitePageKey, CardSideDesign>);
        } else {
          setSuitePages(getDefaultSuitePages(t));
        }
        setEvents(savedProject.events || []);
        if (savedProject.specs) {
          setSpecs(savedProject.specs);
        }
      } else {
        const defaultPages = getDefaultSuitePages(t);
        setSuitePages(defaultPages);
        setFrontDesign(defaultPages.coverFront);
        setBackDesign(defaultPages.coverBack);
      }
    }
  }, [templateIdParam]);

  if (!template || !frontDesign || !backDesign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F2]">
        <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const priceBreakdown = calculatePrice(template.basePricePerCard, specs);
  const payableAmount = paymentOption === 'advance' ? priceBreakdown.advancePayable : priceBreakdown.grandTotal;

  const handleCompleteOrder = async () => {
    setValidationError(null);

    // Validation
    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.shippingAddress.trim()) {
      setValidationError('Please complete all required customer shipping fields.');
      return;
    }
    if (!proofConfirmed) {
      setValidationError('You must certify that you have verified all spelling and event dates.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Generate unique Order ID
      const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // 2. Build full order payload
      const order: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customer,
        templateId: template.id,
        templateTitle: template.title,
        frontCustomization: frontDesign,
        backCustomization: backDesign,
        suitePages: suitePages || undefined,
        events,
        specs,
        priceBreakdown,
        status: 'New Order',
        statusHistory: [
          {
            status: 'New Order',
            timestamp: new Date().toISOString(),
            note: `Order submitted by customer. Payment: ${paymentOption === 'advance' ? 'Advance Deposit Paid' : 'Full Payment Completed'}.`,
          },
        ],
        paymentStatus: paymentOption === 'advance' ? 'Paid (Advance)' : 'Paid (Full)',
        paymentMethod: 'Razorpay UPI/Card/NetBanking',
        razorpayPaymentId: `pay_RPZ_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        proofApproved: true,
      };

      // 3. Pre-flight validation
      const validation = validateOrderForPrint(order);
      if (!validation.isValid) {
        setValidationError(validation.errors.join(' '));
        setIsSubmitting(false);
        return;
      }

      // 4. Save to persistent storage / orders list
      createOrder(order);

      // 5. Navigate to order confirmation page
      router.push(`/order-confirmation/${order.id}`);
    } catch (e) {
      console.error('Order submission error', e);
      setValidationError('An unexpected error occurred while saving your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
          <Link
            href={`/editor/${template.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Card Studio</span>
          </Link>

          {/* Stepper */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setCurrentStep('specs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                currentStep === 'specs'
                  ? 'bg-gold-500 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/30 text-center text-[10px] leading-4">1</span>
              <span>Printing Specs</span>
            </button>

            <span className="text-stone-300">/</span>

            <button
              type="button"
              onClick={() => setCurrentStep('review')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                currentStep === 'review' || currentStep === 'payment'
                  ? 'bg-gold-500 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/30 text-center text-[10px] leading-4">2</span>
              <span>Proof &amp; Order</span>
            </button>
          </div>
        </div>

        {/* STEP 1: SPECIFICATIONS & PRICING SELECTOR */}
        {currentStep === 'specs' && (
          <div>
            <div className="mb-6">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Select Printing Specifications
              </h1>
              <p className="text-xs text-stone-600 mt-1">
                Choose your paper weight, metallic foil stamping, matching envelopes, and quantity.
              </p>
            </div>

            <PrintingSpecsSelector
              basePricePerCard={template.basePricePerCard}
              specs={specs}
              onChangeSpecs={setSpecs}
              onProceedToCheckout={() => setCurrentStep('review')}
            />
          </div>
        )}

        {/* STEP 2 & 3: FINAL PROOF, CUSTOMER DETAILS & RAZORPAY PAYMENT */}
        {(currentStep === 'review' || currentStep === 'payment') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: VISUAL PROOF & WEDDING DETAILS (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Card Physical Visual Proof */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Final Visual Proof
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Verify spelling, names, timings &amp; venue details across all invitation suite pages
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnvelopeModalOpen(true)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-500/15 via-amber-400/20 to-gold-500/15 hover:from-gold-500/25 text-amber-950 font-serif font-bold text-xs border border-gold-300 shadow-xs transition-all hover:scale-105"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                    <span>3D Envelope Unbox</span>
                  </button>
                </div>

                {/* Suite Page Navigation Pills */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 border-y border-stone-100">
                  {(['coverFront', 'insideLeft', 'insideRight', 'coverBack', 'baraatCard', 'sangeetCard'] as SuitePageKey[]).map((key) => {
                    const isSelected = previewPageKey === key;
                    const meta = SUITE_PAGE_LABELS[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPreviewPageKey(key)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-gold-500 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {meta?.shortLabel || key}
                      </button>
                    );
                  })}
                </div>

                {/* Card Canvas Scaled Container with 3D Tilt */}
                {(() => {
                  const activeProofDesign =
                    (suitePages && suitePages[previewPageKey]) ||
                    (previewPageKey === 'coverBack' ? backDesign : frontDesign);
                  const isBaraat = previewPageKey === 'baraatCard';

                  if (!activeProofDesign) return null;

                  return (
                    <div className="flex justify-center py-4 bg-[#F5EED8]/30 rounded-xl border border-stone-200 overflow-hidden">
                      <AnimatedCardTilt maxTilt={7}>
                        <div
                          className={`relative rounded shadow-xl overflow-hidden select-none transition-all animate-foil-sheen ${
                            isBaraat ? 'w-[320px] sm:w-[380px] aspect-[7/5]' : 'w-[260px] sm:w-[310px] aspect-[5/7]'
                          }`}
                          style={{
                            backgroundColor: activeProofDesign.backgroundValue.startsWith('#')
                              ? activeProofDesign.backgroundValue
                              : '#FAF8F2',
                          }}
                        >
                          <BorderFrame
                            style={activeProofDesign.borderStyle}
                            color={activeProofDesign.borderColor}
                            isFoil={true}
                          />

                          {/* Motifs */}
                          {activeProofDesign.motifs.map((m) => (
                            <div
                              key={m.id}
                              className="absolute transform -translate-x-1/2 -translate-y-1/2"
                              style={{ left: `${m.position.xPercent}%`, top: `${m.position.yPercent}%` }}
                            >
                              <MotifIcon type={m.type} color={m.color} size={m.size * 0.7} />
                            </div>
                          ))}

                          {/* Text Elements */}
                          <div className="absolute inset-0 z-20">
                            {activeProofDesign.elements.map((el) => (
                              <div
                                key={el.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 whitespace-pre-line leading-relaxed"
                                style={{
                                  left: `${el.xPercent}%`,
                                  top: `${el.yPercent}%`,
                                  width: el.widthPercent ? `${el.widthPercent}%` : '85%',
                                  fontSize: `clamp(7px, ${el.fontSize * (isBaraat ? 0.28 : 0.29)}px, 18px)`,
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
                        </div>
                      </AnimatedCardTilt>
                    </div>
                  );
                })()}
              </div>

              {/* Multi-Events Review */}
              {events.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                  <h4 className="font-serif text-sm font-bold text-stone-900">
                    Program &amp; Functions Schedule
                  </h4>
                  <div className="space-y-2">
                    {events.map((ev, i) => (
                      <div key={i} className="text-xs p-2.5 bg-stone-50 rounded-lg border border-stone-100 flex justify-between">
                        <div>
                          <strong className="text-stone-800">{ev.name}</strong>
                          <div className="text-stone-500">{ev.venue}</div>
                        </div>
                        <div className="text-right text-stone-600 font-mono">
                          <div>{ev.date}</div>
                          <div>{ev.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: SHIPPING DETAILS, PROOF CONFIRMATION & PAYMENT (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Shipping Address Form */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Delivery &amp; Customer Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kunwar Devavrat Sisodia"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-gold-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98290 12345"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-gold-500 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="you@domain.com"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-gold-500 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Shipping Street Address *
                    </label>
                    <textarea
                      rows={2}
                      placeholder="House / Villa No., Street, Landmark"
                      value={customer.shippingAddress}
                      onChange={(e) => setCustomer({ ...customer, shippingAddress: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-gold-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="Jaipur"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        placeholder="Rajasthan"
                        value={customer.state}
                        onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        placeholder="302006"
                        value={customer.pincode}
                        onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg font-sans font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mandatory Spellcheck & Proof Confirmation */}
              <div className="bg-gradient-to-r from-gold-50 to-amber-50 p-5 rounded-2xl border border-gold-300/80 space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="proof-certify"
                    checked={proofConfirmed}
                    onChange={(e) => setProofConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-gold-600 rounded cursor-pointer shrink-0"
                  />
                  <label htmlFor="proof-certify" className="text-xs text-stone-800 leading-relaxed cursor-pointer">
                    <strong className="text-stone-900 block font-serif text-sm">
                      Mandatory Spellcheck &amp; Production Proof Certification
                    </strong>
                    I certify that I have verified all spelling, bride &amp; groom names, parents’ names,
                    auspicious dates, muhurats, and venue addresses on both the front and back sides.
                    I acknowledge that once submitted, plates and hot foil stamping dies will be prepared based on this exact vector proof.
                  </label>
                </div>
              </div>

              {/* Payment Option: Advance (25%) vs Full Payment */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Select Payment Option (Razorpay Architecture)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentOption('advance')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentOption === 'advance'
                        ? 'border-gold-500 bg-gold-50/50 ring-2 ring-gold-400'
                        : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-900">25% Booking Advance</span>
                      <span className="text-xs font-mono font-bold text-gold-700">
                        ₹{priceBreakdown.advancePayable.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Balance payable prior to courier dispatch after video proof approval.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentOption('full')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentOption === 'full'
                        ? 'border-gold-500 bg-gold-50/50 ring-2 ring-gold-400'
                        : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-900">100% Full Payment</span>
                      <span className="text-xs font-mono font-bold text-gold-700">
                        ₹{priceBreakdown.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Complete payment with instant production priority queue.
                    </p>
                  </div>
                </div>

                {/* Validation error message if any */}
                {validationError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Submit Order Button */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCompleteOrder}
                  className="w-full py-4 px-6 bg-gradient-to-r from-gold-600 via-gold-500 to-amber-600 hover:from-gold-700 hover:to-amber-700 disabled:opacity-50 text-white font-serif font-bold text-base rounded-xl shadow-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating Print-Ready Files &amp; Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Submit My Order &amp; Pay ₹{payableAmount.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-bit Encrypted Checkout • Supported via Razorpay UPI &amp; Cards</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3D Envelope Unboxing Modal */}
      {frontDesign && (
        <InteractiveEnvelopePreview
          isOpen={envelopeModalOpen}
          onClose={() => setEnvelopeModalOpen(false)}
          cardDesign={frontDesign}
          coupleNames={customer.fullName || 'Bride & Groom'}
        />
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F2]">
          <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
