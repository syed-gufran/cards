'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, Search, Compass, ShieldCheck, Heart } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFEFA]/95 backdrop-blur-md border-b border-[#ECE2D4]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-gold-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-gold-100" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-stone-900 uppercase">
                Card Assist
              </span>
              <span className="block text-[9px] font-sans tracking-[0.25em] text-gold-700 uppercase -mt-1 font-semibold">
                Haute Wedding Stationery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs tracking-wider uppercase font-medium text-stone-700">
            <Link
              href="/gallery"
              className="hover:text-gold-700 transition-colors py-2 flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-gold-500" />
              <span>Explore Designs</span>
            </Link>
            <Link
              href="/gallery?category=Royal"
              className="hover:text-gold-700 transition-colors py-2"
            >
              Royal Rajputana
            </Link>
            <Link
              href="/gallery?category=Muslim"
              className="hover:text-gold-700 transition-colors py-2"
            >
              Noor Nikah
            </Link>
            <Link
              href="/gallery?category=Sikh"
              className="hover:text-gold-700 transition-colors py-2"
            >
              Anand Karaj
            </Link>
            <Link
              href="/track"
              className="hover:text-gold-700 transition-colors py-2"
            >
              Track Order
            </Link>
            <Link
              href="/admin"
              className="hover:text-gold-700 transition-colors py-2 text-stone-500"
            >
              Admin Portal
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/gallery"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-amber-600 hover:from-gold-700 hover:to-amber-700 text-white text-xs font-semibold tracking-wider uppercase shadow-md shadow-gold-500/20 transition-all transform hover:-translate-y-0.5"
            >
              Design Your Invitation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F2] border-b border-stone-200 px-5 pt-3 pb-6 space-y-3">
          <Link
            href="/gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-800 py-2 border-b border-stone-200"
          >
            Explore All 12 Collections
          </Link>
          <Link
            href="/gallery?category=Royal"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-800 py-2 border-b border-stone-200"
          >
            Royal Rajputana Invitations
          </Link>
          <Link
            href="/gallery?category=Muslim"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-800 py-2 border-b border-stone-200"
          >
            Noor Nikah Collection
          </Link>
          <Link
            href="/gallery?category=Sikh"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-800 py-2 border-b border-stone-200"
          >
            Anand Karaj Sikh Cards
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-800 py-2 border-b border-stone-200"
          >
            Track My Order Status
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-800 py-2"
          >
            Business Admin Dashboard
          </Link>
          <div className="pt-2">
            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 bg-gold-500 text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md"
            >
              Start Designing Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

