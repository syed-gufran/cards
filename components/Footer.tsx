import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Truck, Award, Heart, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14121E] text-stone-300 border-t border-stone-800">
      {/* Trust Badges Strip */}
      <div className="border-b border-stone-800/80 py-8 bg-[#0D0B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Award className="w-6 h-6 text-gold-400" />
              <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider font-mono">
                24K Real Hot Foil
              </h4>
              <p className="text-[11px] text-stone-400">Genuine metallic stamped foils and deep embossing</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
              <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider font-mono">
                Pre-Press Proof Guarantee
              </h4>
              <p className="text-[11px] text-stone-400">Digital PDF verified before printing runs</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 text-gold-400" />
              <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider font-mono">
                Artisanal Papers (Up to 600 GSM)
              </h4>
              <p className="text-[11px] text-stone-400">Hand-deckled cotton rag, shimmer pearl &amp; velvet duplex</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Truck className="w-6 h-6 text-gold-400" />
              <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider font-mono">
                Insured Doorstep Express
              </h4>
              <p className="text-[11px] text-stone-400">Dispatched in tamper-proof presentation boxes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-amber-700 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4 text-gold-100" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-white uppercase">
                Card Assist
              </span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              India’s premier bespoke wedding stationery and self-service invitation design studio.
              Empowering couples to craft museum-grade invitations with live vector previews,
              traditional regional wording, and master-crafted printing.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>The Heritage Print Atelier, Civil Lines, Jaipur, Rajasthan 302006</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+91 98290 12345 / +91 141 238 9000 (Mon-Sat, 10 AM - 7 PM IST)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>concierge@cardassist.luxury</span>
              </p>
            </div>
          </div>

          {/* Design Categories */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white tracking-wider uppercase mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/gallery?category=Royal" className="hover:text-gold-400 transition-colors">
                  The Royal Rajputana
                </Link>
              </li>
              <li>
                <Link href="/gallery?category=Muslim" className="hover:text-gold-400 transition-colors">
                  Noor-e-Nikah Collection
                </Link>
              </li>
              <li>
                <Link href="/gallery?category=Sikh" className="hover:text-gold-400 transition-colors">
                  Anand Karaj Sikh Cards
                </Link>
              </li>
              <li>
                <Link href="/gallery?category=Traditional" className="hover:text-gold-400 transition-colors">
                  Pichwai Lotus &amp; Temple
                </Link>
              </li>
              <li>
                <Link href="/gallery?category=Minimal" className="hover:text-gold-400 transition-colors">
                  Champagne Silk Minimalist
                </Link>
              </li>
              <li>
                <Link href="/gallery?category=Floral" className="hover:text-gold-400 transition-colors">
                  Pastel Botanical &amp; Rose Gold
                </Link>
              </li>
              <li>
                <Link href="/gallery?category=Luxury" className="hover:text-gold-400 transition-colors">
                  Midnight Velvet Constellation
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Services */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white tracking-wider uppercase mb-4">
              Assistance &amp; Tools
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/track" className="hover:text-gold-400 transition-colors">
                  Track Existing Order
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold-400 transition-colors">
                  All 12 Invitation Templates
                </Link>
              </li>
              <li>
                <span className="text-stone-500">Sample Paper Swatch Kit</span>
              </li>
              <li>
                <span className="text-stone-500">Custom Wax Seal Stamping</span>
              </li>
              <li>
                <span className="text-stone-500">Multilingual Proofing</span>
              </li>
              <li>
                <span className="text-stone-500">Corporate &amp; Event Stationery</span>
              </li>
            </ul>
          </div>

          {/* Business & Legal */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white tracking-wider uppercase mb-4">
              Management
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/admin" className="hover:text-gold-400 transition-colors font-medium text-gold-400">
                  Business Admin Portal →
                </Link>
              </li>
              <li>
                <span className="text-stone-500">Print Production Validation</span>
              </li>
              <li>
                <span className="text-stone-500">Paper GSM Technical Specs</span>
              </li>
              <li>
                <span className="text-stone-500">Privacy &amp; Data Security</span>
              </li>
              <li>
                <span className="text-stone-500">Terms of Bespoke Production</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Card Assist Luxury Wedding Stationery Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Crafted for Indian weddings with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>and pure gold foil</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

