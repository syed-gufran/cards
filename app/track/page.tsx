'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order, OrderStatus } from '@/types/wedding-card';
import { getOrders } from '@/utils/storage';
import { generateCustomerProofPdf, generatePrintReadyPdf } from '@/utils/pdf-generator';
import { motion } from 'framer-motion';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  FileCheck,
  Truck,
  Sparkles,
  Printer,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';
  const initialContact = searchParams.get('contact') || '';

  const [orderIdQuery, setOrderIdQuery] = useState<string>(initialOrderId);
  const [contactQuery, setContactQuery] = useState<string>(initialContact);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    if (initialOrderId) {
      handleSearch(initialOrderId, initialContact);
    }
  }, [initialOrderId, initialContact]);

  const handleSearch = (oid?: string, ctc?: string) => {
    const idToSearch = (oid || orderIdQuery).trim().toLowerCase();
    const contactToSearch = (ctc || contactQuery).trim().toLowerCase();

    setSearched(true);
    const allOrders = getOrders();

    const match = allOrders.find((ord) => {
      const matchId = ord.id.toLowerCase() === idToSearch;
      if (!contactToSearch) return matchId;

      const matchPhone = ord.customer.phone.toLowerCase().includes(contactToSearch);
      const matchEmail = ord.customer.email.toLowerCase().includes(contactToSearch);
      return matchId || matchPhone || matchEmail;
    });

    setSearchedOrder(match || null);
  };

  const steps: Array<{ status: OrderStatus; label: string; desc: string }> = [
    {
      status: 'New Order',
      label: 'Order Placed',
      desc: 'Configuration & proof received in our studio',
    },
    {
      status: 'Under Review',
      label: 'Art Department Review',
      desc: 'Bleed, safe margins & typography inspection',
    },
    {
      status: 'Approved for Printing',
      label: 'Proof Approved',
      desc: 'Customer approved digital proof PDF',
    },
    {
      status: 'Printing in Progress',
      label: 'Production & Foiling',
      desc: 'Heidelberg press run & hot gold foil stamping',
    },
    {
      status: 'Dispatched',
      label: 'Dispatched via Courier',
      desc: 'Packed in gift boxes with tracking AWB',
    },
    {
      status: 'Completed',
      label: 'Delivered',
      desc: 'Delivered to couple’s residence',
    },
  ];

  const getStepStatus = (stepIndex: number, currentStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = [
      'New Order',
      'Under Review',
      'Awaiting Customer Approval',
      'Approved for Printing',
      'Printing in Progress',
      'Dispatched',
      'Completed',
    ];

    const currentIdx = statusOrder.indexOf(currentStatus);
    if (currentIdx === -1) return 'pending';

    // Map step to index
    if (stepIndex <= currentIdx) return 'completed';
    if (stepIndex === currentIdx + 1) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-[#FAF8F2] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-semibold">
            <Package className="w-3.5 h-3.5 text-gold-600" />
            <span>Real-Time Production Tracker</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Track Your Invitation Order
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Enter your unique Order ID and registered phone number or email to view live status updates.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3"
          >
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold text-stone-700 uppercase font-mono mb-1">
                Order ID (e.g. ORD-2026-9041)
              </label>
              <input
                type="text"
                placeholder="ORD-2026-XXXX"
                value={orderIdQuery}
                onChange={(e) => setOrderIdQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono uppercase focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold text-stone-700 uppercase font-mono mb-1">
                Phone Number or Email (Optional)
              </label>
              <input
                type="text"
                placeholder="+91 98290 12345 or email"
                value={contactQuery}
                onChange={(e) => setContactQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-1 focus:ring-gold-500 font-sans"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gold-500 hover:bg-gold-600 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Links */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
            <span>Explore sample orders:</span>
            {['ORD-2026-9041', 'ORD-2026-9038', 'ORD-2026-9034'].map((demoId) => (
              <button
                key={demoId}
                type="button"
                onClick={() => {
                  setOrderIdQuery(demoId);
                  setContactQuery('');
                  handleSearch(demoId, '');
                }}
                className="font-mono text-gold-700 hover:text-gold-900 underline"
              >
                {demoId}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Display */}
        {searched && !searchedOrder && (
          <div className="p-8 bg-white rounded-2xl border border-dashed border-stone-300 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="font-serif text-base font-bold text-stone-800">Order Not Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn&apos;t locate an order matching that reference. Please verify your order ID or contact our studio concierge.
            </p>
          </div>
        )}

        {searchedOrder && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* Order Status Banner */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-foil-sheen">
              <div>
                <span className="text-[10px] font-mono font-bold text-gold-700 uppercase tracking-widest">
                  Live Order Tracker
                </span>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  {searchedOrder.id}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Ordered on {new Date(searchedOrder.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })} • Client: {searchedOrder.customer.fullName}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-100 text-gold-900 border border-gold-300">
                  {searchedOrder.status}
                </span>
              </div>
            </div>

            {/* Stepper Progress Timeline */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="font-serif text-base font-bold text-stone-900 mb-6">
                Production Timeline &amp; Milestones
              </h3>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-200 space-y-8">
                {steps.map((step, idx) => {
                  const state = getStepStatus(idx, searchedOrder.status);

                  return (
                    <div key={step.status} className="relative group">
                      {/* Milestone Icon Bullet */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          state === 'completed'
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                            : state === 'current'
                            ? 'bg-gold-500 text-white ring-4 ring-gold-200 animate-pulse-gold'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {state === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-[10px]">{idx + 1}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-serif text-sm font-bold ${
                              state === 'completed' || state === 'current'
                                ? 'text-stone-900'
                                : 'text-stone-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {state === 'current' && (
                            <span className="text-[9px] font-mono bg-gold-100 text-gold-900 font-bold px-1.5 py-0.2 rounded">
                              Current Stage
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tracking AWB if Dispatched */}
              {searchedOrder.trackingNumber && (
                <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>
                      Dispatched via <strong>{searchedOrder.courierPartner || 'Express Air Courier'}</strong>
                    </span>
                  </div>
                  <span className="font-mono font-bold">AWB: {searchedOrder.trackingNumber}</span>
                </div>
              )}
            </div>

            {/* Order Specification Summary & Download Proof */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-sm font-bold text-stone-900">
                  {searchedOrder.templateTitle} ({searchedOrder.specs.quantity} Sets)
                </h4>
                <p className="text-xs text-stone-500">
                  Pre-press verified proof available for digital review.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const doc = await generateCustomerProofPdf(searchedOrder);
                    doc.save(`${searchedOrder.id}_DIGITAL_PROOF.pdf`);
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300 transition-colors flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5 text-gold-600" />
                  <span>Download Proof PDF</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F2]">
          <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}
