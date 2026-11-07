export type WeddingCategory =
  | 'Traditional'
  | 'Royal'
  | 'Floral'
  | 'Minimal'
  | 'Hindu'
  | 'Muslim'
  | 'Sikh'
  | 'Modern'
  | 'Luxury';

export type MotifType =
  | 'ganesha'
  | 'bismillah'
  | 'ek_onkar'
  | 'kalash'
  | 'doli'
  | 'peacock'
  | 'lotus'
  | 'paisley'
  | 'rings'
  | 'monogram'
  | 'none';

export type BorderStyle =
  | 'royal-filigree'
  | 'mandala-corner'
  | 'mughal-arch'
  | 'ornate-gold'
  | 'minimal-double'
  | 'floral-vine'
  | 'pichwai-arch'
  | 'geometric-jali';

export interface CardMotif {
  id: string;
  type: MotifType;
  position: { xPercent: number; yPercent: number };
  size: number; // width in px on reference 600x840 canvas
  color: string;
  opacity?: number;
}

export interface CardTextElement {
  id: string;
  label: string; // e.g. "Religious Shloka", "Bride Name", "Groom Name", "Host Line", "Date & Time", "Venue", "RSVP"
  text: string;
  defaultText: string;
  xPercent: number; // 0 - 100 center/start
  yPercent: number; // 0 - 100
  fontSize: number; // in px
  fontFamily: string; // e.g. "Cormorant Garamond", "Cinzel", "Great Vibes", "Rozha One", "Montserrat"
  color: string;
  fontWeight: 'normal' | '500' | '600' | 'bold';
  fontStyle?: 'normal' | 'italic';
  letterSpacing?: number; // em or px
  textAlign: 'left' | 'center' | 'right';
  isLocked?: boolean; // if locked, customer cannot move or edit
  isOptional?: boolean; // can be deleted / hidden
  widthPercent?: number;
  category: 'header' | 'religious' | 'host' | 'couple' | 'event' | 'venue' | 'rsvp' | 'custom';
}

export interface CardSideDesign {
  backgroundType: 'solid' | 'gradient' | 'texture' | 'pattern';
  backgroundValue: string; // CSS color, gradient or pattern class
  paperTexture?: 'smooth' | 'linen' | 'handmade' | 'metallic';
  borderStyle: BorderStyle;
  borderColor: string;
  borderFoilEffect?: boolean;
  motifs: CardMotif[];
  elements: CardTextElement[];
  userPhotoUrl?: string; // Optional user uploaded photo/monogram
  userPhotoPosition?: { xPercent: number; yPercent: number; widthPercent: number };
}

export type SuitePageKey =
  | 'coverFront'   // Outside Front Cover
  | 'insideLeft'    // Inside Left Page (Host & Blessings)
  | 'insideRight'   // Inside Right Page (Vivah Muhurtham & Vows)
  | 'coverBack'     // Outside Back (Family RSVP & Residence)
  | 'baraatCard'    // Baraat / Visiting / Entry Pass Card
  | 'sangeetCard';  // Mehendi & Sangeet Insert Card

export interface ScannedCardResult {
  capturedImage: string;
  detectedOrientation: 'portrait' | 'landscape';
  detectedColors: {
    primaryBackground: string;
    accentColor: string;
  };
  extractedTexts?: {
    brideName?: string;
    groomName?: string;
    weddingDate?: string;
    venue?: string;
    shloka?: string;
  };
}

export interface DesignTemplate {
  id: string; // Unique design ID, e.g. "ROYAL-RAJ-01"
  title: string;
  category: WeddingCategory;
  description: string;
  tags: string[];
  dimensions: {
    widthMm: number;
    heightMm: number;
    label: string; // e.g. "5 x 7 inches (127 x 178 mm)"
  };
  orientation: 'portrait' | 'landscape' | 'square';
  basePricePerCard: number; // INR
  rating: number;
  reviewCount: number;
  featured?: boolean;
  themeColor: string; // Accent color hex for badges/previews
  frontDesign: CardSideDesign;
  backDesign: CardSideDesign;
  suitePages?: Partial<Record<SuitePageKey, CardSideDesign>>;
  sampleBrideName: string;
  sampleGroomName: string;
  sampleWeddingDate: string;
}

export interface WeddingEvent {
  id: string;
  name: string; // e.g. "Mehendi & Sangeet", "Haldi Ceremony", "Muhurtham / Nikah", "Grand Reception"
  date: string;
  time: string;
  venue: string;
  address?: string;
  dressCode?: string;
}

export interface CardSizeOption {
  id: string;
  label: string;
  dimensions: string;
  priceMultiplier: number;
}

export interface PaperTypeOption {
  id: string;
  name: string;
  gsm: number;
  description: string;
  surchargePerCard: number;
  textureLabel: string;
}

export interface FinishOption {
  id: string;
  name: string;
  description: string;
  surchargePerCard: number;
  colorHex?: string;
}

export interface EnvelopeOption {
  id: string;
  name: string;
  description: string;
  pricePerUnit: number;
  includesLiner?: boolean;
}

export interface PrintingSpecification {
  sizeId: string;
  paperTypeId: string;
  finishId: string;
  envelopeId: string;
  sides: 'single' | 'double';
  quantity: number;
}

export interface PriceBreakdown {
  quantity: number;
  baseCardTotal: number;
  paperSurchargeTotal: number;
  finishSurchargeTotal: number;
  doubleSidedSurchargeTotal: number;
  envelopeTotal: number;
  subtotal: number;
  volumeDiscountPercent: number;
  volumeDiscountAmount: number;
  taxGstAmount: number; // 18% GST standard in India for stationery
  shippingAmount: number;
  grandTotal: number;
  advancePayable: number; // 25% booking advance option
}

export type OrderStatus =
  | 'New Order'
  | 'Under Review'
  | 'Awaiting Customer Approval'
  | 'Approved for Printing'
  | 'Printing in Progress'
  | 'Dispatched'
  | 'Completed'
  | 'Cancelled';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  altPhone?: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. "ORD-2026-8942"
  createdAt: string;
  updatedAt: string;
  customer: CustomerDetails;
  templateId: string;
  templateTitle: string;
  frontCustomization: CardSideDesign;
  backCustomization: CardSideDesign;
  suitePages?: Partial<Record<SuitePageKey, CardSideDesign>>;
  events: WeddingEvent[];
  specs: PrintingSpecification;
  priceBreakdown: PriceBreakdown;
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: string;
    note: string;
  }>;
  paymentStatus: 'Paid (Advance)' | 'Paid (Full)' | 'Pending';
  paymentMethod: 'Razorpay UPI/Card/NetBanking' | 'Bank Transfer (NEFT/RTGS)';
  razorpayPaymentId?: string;
  printReadyPdfUrl?: string;
  proofApproved: boolean;
  trackingNumber?: string;
  courierPartner?: string;
}

export interface CustomerProject {
  id: string;
  templateId: string;
  updatedAt: string;
  frontDesign: CardSideDesign;
  backDesign: CardSideDesign;
  suitePages?: Partial<Record<SuitePageKey, CardSideDesign>>;
  events: WeddingEvent[];
  specs: PrintingSpecification;
}
