'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SAMPLE_TEMPLATES } from '@/data/sample-templates';
import { DesignTemplate } from '@/types/wedding-card';
import { MotifIcon } from '@/components/MotifIcons';
import { BorderFrame } from '@/components/BordersAndFrames';
import { HomeScannerCta } from '@/components/HomeScannerCta';
import { AmbientGoldParticles } from '@/components/AmbientGoldParticles';
import { AnimatedCardTilt } from '@/components/AnimatedCardTilt';
import { CardFormatModal } from '@/components/CardFormatModal';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Layers,
  Palette,
  Printer,
  ChevronRight,
  CheckCircle2,
  Clock,
  HeartHandshake,
} from 'lucide-react';

export default function HomePage() {
  const [formatModalTemplate, setFormatModalTemplate] = useState<DesignTemplate | null>(null);
  const featuredTemplates = SAMPLE_TEMPLATES.filter((t) => t.featured).slice(0, 4);

  const categories = [
    { name: 'Royal Rajputana', category: 'Royal', description: 'Deep crimsons, royal arches & 24K gold foil', count: '3 Designs' },
    { name: 'Noor-e-Nikah', category: 'Muslim', description: 'Mughal cusped jali, Bismillah calligraphy & emeralds', count: '2 Designs' },
    { name: 'Anand Karaj', category: 'Sikh', description: 'Ik Onkar emblems, marigold motifs & Gurmukhi blessings', count: '2 Designs' },
    { name: 'Traditional Hindu', category: 'Hindu', description: 'Vedic Sanskrit shlokas, Kalash, Ganesha & temple gold', count: '3 Designs' },
    { name: 'Champagne Minimal', category: 'Minimal', description: 'Editorial typography, double hairlines & understated luxury', count: '2 Designs' },
    { name: 'Botanical Floral', category: 'Floral', description: 'Soft blush watercolors, rose gold foil & romantic florals', count: '2 Designs' },
    { name: 'Imperial Luxury', category: 'Luxury', description: 'Charcoal slate, bespoke family crests & black tie styling', count: '2 Designs' },
    { name: 'Modern Destination', category: 'Modern', description: 'Goan sunset ochres, Kashmiri pashmina paisleys & fusion', count: '2 Designs' },
  ];

  const testimonials = [
    {
      quote:
        'We designed our royal wedding card in under 30 minutes! The live preview matched our physical 600 GSM gold-foiled cards with astonishing precision. Zero designer back-and-forth.',
      author: 'Princess Gayatri & Kunwar Devavrat',
      location: 'Jaipur, Rajasthan',
      wedding: 'Palace Wedding at Jai Mahal',
      rating: 5,
    },
    {
      quote:
        'Finding authentic Bismillah calligraphy and proper Surah verses on modern invitation websites used to be impossible. Card Assist made it seamless. Our families in Hyderabad loved it!',
      author: 'Inaya Khan & Zayd Siddiqui',
      location: 'Hyderabad, Telangana',
      wedding: 'Falaknuma Palace Nikah',
      rating: 5,
    },
    {
      quote:
        'The Gurmukhi verses rendered flawlessly, and the paper quality with real hot stamped gold foil was sensational. Even our elders complimented how respectful and beautiful it turned out.',
      author: 'Simran Kaur & Angad Dhillon',
      location: 'New Delhi & Chandigarh',
      wedding: 'Anand Karaj at Gurdwara Sahib',
      rating: 5,
    },
  ];

  return (
    <div className="bg-[#FFFEFA] overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-[#FAF7EE] via-[#F5EED8]/40 to-[#FFFEFA] overflow-hidden">
        {/* Ambient Floating Gold Particles */}
        <AmbientGoldParticles count={25} />

        {/* Subtle decorative background watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-gold-200/20 to-amber-100/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Accent Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-100/80 border border-gold-300/60 shadow-xs">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span className="text-xs font-serif font-bold text-gold-900 tracking-widest uppercase">
                Haute Indian Wedding Stationery
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.1]">
              Your Wedding Invitation, <br />
              <span className="gold-text italic font-normal">Your Way.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-stone-600 font-sans leading-relaxed max-w-2xl mx-auto">
              Design, customise, preview, and order your bespoke luxury wedding cards online in minutes.
              Enjoy live vector previews, authentic regional wording, real 24K gold foil stamping, and
              direct-to-doorstep museum-grade printing — completely self-service.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/gallery"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-amber-600 hover:from-gold-700 hover:to-amber-700 text-white font-serif font-bold text-base tracking-wider uppercase shadow-xl shadow-gold-500/25 transition-all transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 group"
              >
                <span>Design Your Invitation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-serif font-semibold text-base tracking-wide border border-stone-300 shadow-sm transition-all text-center"
              >
                How It Works
              </Link>
            </div>

            {/* Trust points micro-strip */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Designer Delays</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>24K Mirror Hot Stamped Gold Foil</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Print-Ready High-Res Proofs</span>
              </span>
            </div>
          </div>

          {/* Interactive Card Preview Teaser Display */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-white/90 to-[#FAF8F2] border border-gold-200/80 shadow-2xl backdrop-blur-xl">
              <div className="text-center mb-8">
                <span className="text-[11px] font-mono tracking-widest text-gold-700 uppercase font-bold">
                  Live Interactive Customisation Studio
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  Crafted for Royal Indian Celebrations
                </h2>
              </div>

              {/* Grid of 3 Sample Cards in Perspective */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredTemplates.slice(0, 3).map((template, idx) => (
                  <Link
                    key={template.id}
                    href={`/editor/${template.id}`}
                    className="group block h-full cursor-pointer transition-transform hover:-translate-y-1"
                  >
                    <AnimatedCardTilt maxTilt={8} className="h-full">
                      <div
                        className="relative block rounded-2xl overflow-hidden shadow-lg border border-stone-200 animate-foil-sheen h-full"
                        style={{
                          backgroundColor: template.frontDesign.backgroundValue,
                        }}
                      >
                        {/* Visual Card Representation */}
                        <div className="relative aspect-[5/7] p-5 flex flex-col justify-between">
                          <BorderFrame
                            style={template.frontDesign.borderStyle}
                            color={template.frontDesign.borderColor}
                            isFoil={template.frontDesign.borderFoilEffect}
                          />

                          {/* Top Motif */}
                          <div className="flex justify-center z-20 pt-2">
                            {template.frontDesign.motifs[0] && (
                              <MotifIcon
                                type={template.frontDesign.motifs[0].type}
                                color={template.frontDesign.motifs[0].color}
                                size={44}
                              />
                            )}
                          </div>

                          {/* Couple Title Teaser */}
                          <div className="text-center z-20 my-auto space-y-1">
                            <div className="text-[10px] tracking-widest uppercase font-serif" style={{ color: template.frontDesign.borderColor }}>
                              {template.category} Wedding
                            </div>
                            <div
                              className="font-serif text-xl sm:text-2xl font-bold"
                              style={{ color: template.frontDesign.borderColor }}
                            >
                              {template.sampleBrideName.split(' ')[0]} &amp; {template.sampleGroomName.split(' ')[0]}
                            </div>
                            <div className="text-[10px] font-sans opacity-80" style={{ color: template.frontDesign.borderColor }}>
                              {template.sampleWeddingDate}
                            </div>
                          </div>

                          {/* Bottom Price & Customize Hover Pill */}
                          <div className="z-20 text-center">
                            <span className="inline-block px-4 py-2 rounded-full text-xs font-semibold bg-white/95 text-stone-900 shadow-md group-hover:bg-gold-500 group-hover:text-white transition-all transform group-hover:scale-105">
                              Customise this Design →
                            </span>
                          </div>
                        </div>
                      </div>
                    </AnimatedCardTilt>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* New Camera Scanner Feature Showcase */}
          <HomeScannerCta />
        </div>
      </section>

      {/* 2. THE THREE-STEP SEAMLESS PROCESS */}
      <section id="how-it-works" className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono font-bold text-gold-700 uppercase tracking-widest">
              Effortless &amp; Completely Self-Service
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              How Card Assist Works
            </h2>
            <p className="text-stone-600 text-sm">
              We eliminated the endless email chains and manual revisions. You are in complete artistic control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-8 rounded-2xl bg-[#FAF8F2] border border-stone-200 shadow-sm text-center space-y-4 group hover:border-gold-300 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gold-100 text-gold-800 flex items-center justify-center mx-auto shadow-inner font-serif text-2xl font-bold">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Choose Your Design
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Browse our curated gallery of 12 royal and modern Indian wedding templates.
                Filter by faith (Hindu, Muslim, Sikh), style (Traditional, Minimal, Floral), or budget.
              </p>
              <div className="pt-2">
                <Link href="/gallery" className="text-xs font-bold text-gold-700 hover:text-gold-900 flex items-center justify-center gap-1">
                  <span>Browse Templates</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-2xl bg-[#FAF8F2] border border-stone-200 shadow-sm text-center space-y-4 group hover:border-gold-300 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gold-100 text-gold-800 flex items-center justify-center mx-auto shadow-inner font-serif text-2xl font-bold">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Customise in Studio
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Personalise bride &amp; groom names, auspicious timings, venue, and multi-day itinerary.
                Select authentic religious shlokas, tweak fonts, and preview front &amp; back in 3D.
              </p>
              <div className="pt-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Real-time Instant Preview
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-2xl bg-[#FAF8F2] border border-stone-200 shadow-sm text-center space-y-4 group hover:border-gold-300 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gold-100 text-gold-800 flex items-center justify-center mx-auto shadow-inner font-serif text-2xl font-bold">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Submit &amp; Print
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Select your paper GSM, hot gold foil finishes, and matching envelopes.
                Review the proof PDF, confirm spelling, and we dispatch museum-grade invitations to your doorstep.
              </p>
              <div className="pt-2">
                <span className="text-xs font-bold text-gold-700">
                  300 DPI Vector PDF Included
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WEDDING INVITATION CATEGORIES */}
      <section className="py-20 bg-[#FAF7EE]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono font-bold text-gold-700 uppercase tracking-widest">
                Curated Collections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Explore by Wedding Theme
              </h2>
            </div>
            <Link
              href="/gallery"
              className="mt-4 md:mt-0 text-sm font-semibold text-gold-800 hover:text-gold-900 flex items-center gap-1 group"
            >
              <span>View All 12 Templates</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/gallery?category=${cat.category}`}
                className="group p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-gold-400 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-gold-700 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-mono font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {cat.description}
                </p>
                <span className="text-xs font-semibold text-gold-700 group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                  <span>Explore category</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED TEMPLATES SHOWCASE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-mono font-bold text-gold-700 uppercase tracking-widest">
              Most Loved Suites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Featured Wedding Invitations
            </h2>
            <p className="text-stone-600 text-sm">
              Each template includes fully customizable front and back designs, protected artwork borders, and verified vector typography.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SAMPLE_TEMPLATES.slice(0, 4).map((template) => (
              <div
                key={template.id}
                className="group rounded-2xl overflow-hidden border border-stone-200 bg-[#FAF8F2] shadow-sm hover:shadow-xl hover:border-gold-300 transition-all flex flex-col"
              >
                {/* Visual Card Preview */}
                <div
                  onClick={() => setFormatModalTemplate(template)}
                  className="relative aspect-[5/7] p-4 flex flex-col justify-between overflow-hidden cursor-pointer"
                  style={{ backgroundColor: template.frontDesign.backgroundValue }}
                >
                  <BorderFrame
                    style={template.frontDesign.borderStyle}
                    color={template.frontDesign.borderColor}
                    isFoil={template.frontDesign.borderFoilEffect}
                  />

                  {/* Motif */}
                  <div className="flex justify-center z-10 pt-2">
                    {template.frontDesign.motifs[0] && (
                      <MotifIcon
                        type={template.frontDesign.motifs[0].type}
                        color={template.frontDesign.motifs[0].color}
                        size={38}
                      />
                    )}
                  </div>

                  {/* Center Names */}
                  <div className="text-center z-10 my-auto space-y-1">
                    <div
                      className="font-serif text-lg font-bold"
                      style={{ color: template.frontDesign.borderColor }}
                    >
                      {template.sampleBrideName.split(' ')[0]} &amp; {template.sampleGroomName.split(' ')[0]}
                    </div>
                    <div
                      className="text-[9px] font-sans opacity-80"
                      style={{ color: template.frontDesign.borderColor }}
                    >
                      {template.dimensions.label}
                    </div>
                  </div>

                  {/* Bottom Design ID Tag */}
                  <div className="z-10 flex justify-between items-center text-[9px] font-mono text-stone-400">
                    <span className="bg-black/30 backdrop-blur-xs px-1.5 py-0.5 rounded text-white/90">
                      ID: {template.id}
                    </span>
                    <span className="bg-black/30 backdrop-blur-xs px-1.5 py-0.5 rounded text-white/90">
                      ★ {template.rating}
                    </span>
                  </div>
                </div>

                {/* Card Info Box */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-gold-700 tracking-wider uppercase font-mono">
                        {template.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-900">
                        ₹{template.basePricePerCard}/card
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-stone-900 mb-1.5 group-hover:text-gold-700 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
                      {template.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormatModalTemplate(template)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider text-center shadow-xs transition-colors block cursor-pointer"
                  >
                    Customise This Card →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="py-20 bg-[#FAF7EE] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono font-bold text-gold-700 uppercase tracking-widest">
              Real Weddings
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Loved by Brides &amp; Grooms
            </h2>
            <p className="text-stone-600 text-sm">
              Hear from couples who independently created their bespoke wedding cards with Card Assist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-gold-500 mb-3">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <h4 className="font-serif text-sm font-bold text-stone-900">
                    {test.author}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {test.wedding} • {test.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 bg-gradient-to-r from-maroon-900 via-stone-900 to-maroon-900 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="w-12 h-12 rounded-full bg-gold-400/20 text-gold-300 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Ready to Design Your Wedding Invitation?
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Start with our 12 sample templates. Customise names, dates, venues, and regional shlokas
            with instant live preview. No designer required.
          </p>
          <div className="pt-2">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 hover:from-gold-500 hover:to-amber-600 text-stone-950 font-serif font-bold text-base tracking-wider uppercase shadow-xl transition-all transform hover:scale-105"
            >
              <span>Explore All Invitation Designs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Format & Colorway Interactive Modal */}
      <CardFormatModal
        template={formatModalTemplate}
        isOpen={!!formatModalTemplate}
        onClose={() => setFormatModalTemplate(null)}
      />
    </div>
  );
}

