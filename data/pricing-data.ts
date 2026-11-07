import {
  CardSizeOption,
  PaperTypeOption,
  FinishOption,
  EnvelopeOption,
  PrintingSpecification,
  PriceBreakdown,
} from '@/types/wedding-card';

export const CARD_SIZES: CardSizeOption[] = [
  {
    id: '5x7',
    label: 'Standard Royal (5" × 7")',
    dimensions: '127 mm × 178 mm',
    priceMultiplier: 1.0,
  },
  {
    id: '6x8',
    label: 'Grand Imperial (6" × 8")',
    dimensions: '152 mm × 203 mm',
    priceMultiplier: 1.25,
  },
  {
    id: 'a5',
    label: 'Editorial A5 (5.8" × 8.3")',
    dimensions: '148 mm × 210 mm',
    priceMultiplier: 1.2,
  },
  {
    id: 'square',
    label: 'Square Prestige (6" × 6")',
    dimensions: '152 mm × 152 mm',
    priceMultiplier: 1.15,
  },
];

export const PAPER_TYPES: PaperTypeOption[] = [
  {
    id: 'textured-matte',
    name: '350 GSM Italian Fine Linen Matte',
    gsm: 350,
    description: 'Crisp woven texture with an anti-glare, understated luxury feel. Perfect for high-contrast typography.',
    surchargePerCard: 0,
    textureLabel: 'Fine Linen Texture',
  },
  {
    id: 'metallic-pearl',
    name: '400 GSM Shimmer Metallic Pearl',
    gsm: 400,
    description: 'Subtle mineral pearlescent sheen that catches candle and banquet lighting with ethereal warmth.',
    surchargePerCard: 18,
    textureLabel: 'Iridescent Pearl',
  },
  {
    id: 'cotton-deckled',
    name: '450 GSM Hand-Deckled Artisanal Cotton',
    gsm: 450,
    description: '100% recycled cotton pulp with authentic feathery deckled edges. Old-world royal craftsmanship.',
    surchargePerCard: 35,
    textureLabel: 'Feathered Deckled Cotton',
  },
  {
    id: 'velvet-board',
    name: '600 GSM Ultra-Thick Velvet Duplex Board',
    gsm: 600,
    description: 'Unbending rigidity with silk-touch velvet lamination. The ultimate benchmark for high-end Indian weddings.',
    surchargePerCard: 55,
    textureLabel: 'Ultra-Thick Velvet',
  },
];

export const FINISHES: FinishOption[] = [
  {
    id: 'matte',
    name: 'Fine Satin Touch (No Foil)',
    description: 'Silky smooth protective sealant without metallic reflection.',
    surchargePerCard: 0,
  },
  {
    id: 'gold-foil',
    name: 'Real 24K Hot Stamped Gold Foil',
    description: 'Hand-pressed metallic gold foil applied to names, motifs, and borders with brilliant lustrous mirror sheen.',
    surchargePerCard: 28,
    colorHex: '#D4AF37',
  },
  {
    id: 'rose-gold-foil',
    name: 'Rose Gold Metallic Foil',
    description: 'Romantic blush copper-tinted metallic foil for modern floral and pastel aesthetics.',
    surchargePerCard: 30,
    colorHex: '#B76E79',
  },
  {
    id: 'embossing',
    name: 'Deep Blind Embossing',
    description: 'Raised dimensional impression pressed into thick board without ink, giving an opulent sculptural touch.',
    surchargePerCard: 25,
  },
  {
    id: 'spot-uv',
    name: 'Raised Spot UV Gloss Highlighting',
    description: 'Glass-like glossy clear polymer coating over typography and motifs for a dramatic textural contrast.',
    surchargePerCard: 22,
  },
];

export const ENVELOPES: EnvelopeOption[] = [
  {
    id: 'standard-ivory',
    name: 'Matching 280 GSM Premium Vellum Envelope',
    description: 'Thick coordinated envelope with diamond flap and gummed adhesive.',
    pricePerUnit: 25,
    includesLiner: false,
  },
  {
    id: 'gold-lined',
    name: 'Luxury Foil-Lined Envelope (Custom Monogram Flap)',
    description: 'Handmade envelope lined with shimmering metallic gold foil interior and foil return address printing.',
    pricePerUnit: 48,
    includesLiner: true,
  },
  {
    id: 'velvet-wax-seal',
    name: 'Bespoke Velvet Envelope + Personalized Wax Seal',
    description: 'Velvet-lined envelope with real hand-poured metallic sealing wax stamp customized with couple initials.',
    pricePerUnit: 75,
    includesLiner: true,
  },
  {
    id: 'none',
    name: 'No Envelopes (Cards Only)',
    description: 'Cards only, carefully wrapped in acid-free tissue and presentation box.',
    pricePerUnit: 0,
    includesLiner: false,
  },
];

export const QUANTITY_OPTIONS = [50, 100, 150, 200, 250, 300, 500, 1000];

export function calculatePrice(
  basePricePerCard: number,
  specs: PrintingSpecification
): PriceBreakdown {
  const { quantity, sizeId, paperTypeId, finishId, envelopeId, sides } = specs;

  const size = CARD_SIZES.find((s) => s.id === sizeId) || CARD_SIZES[0];
  const paper = PAPER_TYPES.find((p) => p.id === paperTypeId) || PAPER_TYPES[0];
  const finish = FINISHES.find((f) => f.id === finishId) || FINISHES[0];
  const envelope = ENVELOPES.find((e) => e.id === envelopeId) || ENVELOPES[0];

  const adjustedBase = Math.round(basePricePerCard * size.priceMultiplier);
  const baseCardTotal = adjustedBase * quantity;

  const paperSurchargeTotal = paper.surchargePerCard * quantity;
  const finishSurchargeTotal = finish.surchargePerCard * quantity;

  // Double-sided print adds 35% of adjusted base per card
  const doubleSidedSurchargeTotal = sides === 'double' ? Math.round(adjustedBase * 0.35) * quantity : 0;

  const envelopeTotal = envelope.pricePerUnit * quantity;

  const rawSubtotal =
    baseCardTotal +
    paperSurchargeTotal +
    finishSurchargeTotal +
    doubleSidedSurchargeTotal +
    envelopeTotal;

  // Volume discount tiers
  let discountPercent = 0;
  if (quantity >= 500) {
    discountPercent = 25; // 25% discount for 500+
  } else if (quantity >= 250) {
    discountPercent = 18; // 18% discount for 250-499
  } else if (quantity >= 150) {
    discountPercent = 12; // 12% discount for 150-249
  } else if (quantity >= 100) {
    discountPercent = 7; // 7% discount for 100-149
  }

  const volumeDiscountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const discountedSubtotal = rawSubtotal - volumeDiscountAmount;

  // 18% GST (Standard stationery printing tax in India)
  const taxGstAmount = Math.round(discountedSubtotal * 0.18);

  // Insured express courier delivery (Free on orders above ₹15,000, otherwise ₹750)
  const shippingAmount = discountedSubtotal >= 15000 ? 0 : 750;

  const grandTotal = discountedSubtotal + taxGstAmount + shippingAmount;

  // 25% Advance booking deposit
  const advancePayable = Math.round(grandTotal * 0.25);

  return {
    quantity,
    baseCardTotal,
    paperSurchargeTotal,
    finishSurchargeTotal,
    doubleSidedSurchargeTotal,
    envelopeTotal,
    subtotal: discountedSubtotal,
    volumeDiscountPercent: discountPercent,
    volumeDiscountAmount,
    taxGstAmount,
    shippingAmount,
    grandTotal,
    advancePayable,
  };
}

