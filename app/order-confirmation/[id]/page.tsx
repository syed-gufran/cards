'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/types/wedding-card';
import { getOrderById } from '@/utils/storage';
import { generatePrintReadyPdf, generateCustomerProofPdf } from '@/utils/pdf-generator';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { AmbientGoldParticles } from '@/components/AmbientGoldParticles';
import {
  CheckCircle2,
  Download,
  Printer,
  FileCheck,
  Calendar,
  Truck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  useEffect(() => {
    if (!orderId) return;
    const foundOrder = getOrderById(orderId);
    if (foundOrder) {
      setOrder(foundOrder);

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#801222', '#F5EED8', '#B88E18'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F2]">
        <div className="text-center space-y-3">
          <p className="font-serif text-lg text-stone-700">Loading Order Confirmation...</p>
        </div>
      </div>
    );
  }

  const handleDownloadPrintPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = await generatePrintReadyPdf(order);
      doc.save(`${order.id}_PRINT_READY_300DPI_BLEED.pdf`);
    } catch (e) {
      console.error('Error downloading print-ready PDF', e);
      alert('Could not export PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadProofPdf = async () => {
    try {
      const doc = await generateCustomerProofPdf(order);
      doc.save(`${order.id}_CUSTOMER_DIGITAL_PROOF.pdf`);
    } catch (e) {
      console.error('Error generating proof PDF', e);
    }
  };

  return (
    <div className="bg-[#FAF8F2] min-h-screen py-12 relative overflow-hidden">
      <AmbientGoldParticles count={30} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Celebration Header Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl text-center space-y-4 mb-8 relative overflow-hidden animate-foil-sheen"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-block px-3.5 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-mono font-bold tracking-wider uppercase">
            Order Reference: {order.id}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
            Order Confirmed &amp; In Production
          </h1>

          <p className="text-stone-600 text-sm max-w-xl mx-auto leading-relaxed">
            Congratulations! Your bespoke wedding invitation design configuration and print specifications
            have been recorded. Our master pre-press technicians are reviewing your vector proof.
          </p>

          {/* Quick PDF Downloads Pill Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPrintPdf}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-amber-600 hover:from-gold-700 hover:to-amber-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generating...' : 'Download Print-Ready PDF (With Bleed & Crop Marks)'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadProofPdf}
              className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all border border-stone-300"
            >
              <FileCheck className="w-4 h-4 text-gold-600" />
              <span>Download Customer Digital Proof PDF</span>
            </button>
          </div>
        </motion.div>

        {/* Order Details & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Order Details */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Order Information
            </h3>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Design Suite:</span>
                <strong className="text-stone-900">{order.templateTitle}</strong>
              </div>
              <div className="flex justify-between">
                <span>Template ID:</span>
                <strong className="text-stone-900 font-mono">{order.templateId}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Quantity:</span>
                <strong className="text-stone-900 font-mono">{order.specs.quantity} Invitation Sets</strong>
              </div>
              <div className="flex justify-between">
                <span>Card Format:</span>
                <strong className="text-stone-900">{order.specs.sizeId.toUpperCase()} ({order.specs.sides === 'double' ? 'Double Sided' : 'Single Sided'})</strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment ID:</span>
                <span className="font-mono text-stone-700">{order.razorpayPaymentId}</span>
              </div>
            </div>
          </div>

          {/* Shipping Destination */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Courier Delivery Details
            </h3>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Recipient:</span>
                <strong className="text-stone-900">{order.customer.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Contact Phone:</span>
                <strong className="text-stone-900">{order.customer.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="text-stone-800">{order.customer.email}</span>
              </div>
              <div className="pt-2 border-t border-stone-100">
                <span className="text-stone-500 block mb-0.5">Shipping Address:</span>
                <p className="text-stone-800 font-medium">
                  {order.customer.shippingAddress}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="bg-stone-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-lg font-bold">Want to monitor progress?</h4>
            <p className="text-xs text-stone-300">
              Track your production stages from plate etching to express delivery.
            </p>
          </div>
          <Link
            href={`/track?orderId=${order.id}&contact=${encodeURIComponent(order.customer.phone)}`}
            className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-serif font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap"
          >
            Track Order Live →
          </Link>
        </div>
      </div>
    </div>
  );
}

