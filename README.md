# Card Assist — Haute Indian Wedding Stationery Platform

> A production-ready, bespoke wedding invitation designer and print-ordering platform built with Next.js 14, React, TypeScript, Tailwind CSS, and jsPDF.

---

## 💍 Overview

**Card Assist** automates the entire wedding card design and ordering pipeline. Couples can independently browse luxury collections, customize card wording in real-time, inspect religious shlokas and event itineraries across front and back views, configure tactile printing finishes (real 24K hot foil stamping, hand-deckled cotton, velvet duplex board), and submit production-ready orders without back-and-forth email friction.

---

## 🌟 Key Capabilities

### 1. Curated 12 Indian Wedding Collections
- **The Royal Rajputana Splendor** (`ROYAL-RAJ-01`): Deep crimson velvet, 24K hot gold foil filigree, sacred Ganesha invocation, and palace heritage aesthetics.
- **Noor-e-Nikah Imperial Jali** (`NOOR-NIKAH-02`): Emerald green texture, Mughal polylobed cusped archways, calligraphic Bismillah emblem, and regal Urdu-English phrasing.
- **The Anand Karaj Splendor** (`ANAND-KARAJ-03`): Warm ivory linen, golden Ik Onkar insignia, sacred Gurmukhi hymns, and marigold corner mandalas.
- **Champagne Silk Minimalist** (`CHAMPAGNE-MINIMAL-04`): Ultra-clean cream silk, double hairlines, editorial typography, and interlocking monogram.
- **Pichwai Lotus & Cow Heritage** (`VRINDA-PICHWAI-05`): Nathdwara sacred lotus pond, Radha-Krishna shloka, and heritage sage green texture.
- **Gulmohar Pastel Botanical** (`GULMOHAR-FLORAL-06`): Romantic blush pink, rose gold metallic foil, and hand-painted botanical sprays.
- **Kalyana Vaibhogam Temple Gold** (`KALYANAM-SOUTH-07`): Sandalwood cream, Kanjivaram gold filigree, Kalash motif, and Sanskrit Ganapataye Namaha blessings.
- **Midnight Velvet Constellation** (`MIDNIGHT-ROYAL-08`): Deep midnight navy, star constellation borders, and modern evening gala typography.
- **Imperial Crest & Noir Gold** (`IMPERIAL-MONOGRAM-09`): Charcoal slate, bespoke family crest monogram, and 24K mirror gold foil borders.
- **Shubho Drishti Vermilion** (`SHUBHO-DRISHTI-10`): Traditional Bengali sindoor red, pure gold Kolka motifs, and Saat Paak ritual itinerary.
- **Kashmiri Pashmina Paisley** (`KASHMIRI-PAISLEY-11`): Warm taupe beige, hand-drawn Kashmiri kalka paisley, and burnished bronze accents.
- **Goan Coastal Ochre Fusion** (`GOAN-SUNSET-12`): Terracotta ochre, tropical coastal fronds, and beachside sunset wedding styling.

---

### 2. Live Customisation Studio (`/editor/[id]`)
- **Center Vector Canvas**: Updates immediately as the user edits. Front and back side toggle with 3D paper shadow, zoom controls (50% to 140%), and print guide boundaries (Safe margin dashed line, trim line, and 3mm bleed margin).
- **Text & Wording Tab**: Edit bride, groom, parents, grandparents, wedding date, muhurtham, venue address, and RSVP.
- **Indian Wording Library Modal**: 1-click insertion of authentic Hindu shlokas, Quranic Nikah verses, Gurmukhi Anand Karaj hymns, South Indian invocations, and contemporary wedding poetry.
- **Typography Controls**: Choose font families (Cormorant Garamond, Cinzel, Great Vibes Script, Plus Jakarta Sans), sizes, alignment, letter spacing, bold/italic, and color palettes (24K Gold `#D4AF37`, Antique Gold, Crimson Maroon, Emerald, Rose Gold, Midnight Navy).
- **Motifs & Borders**: Swap traditional Indian motifs (Ganesha, Bismillah, Ik Onkar, Kalash, Lotus, Peacock, Doli, Monogram, Rings, Paisley) and select from 8 scalable SVG border frames.
- **Multi-Event Itinerary**: Schedule Haldi, Mehendi, Sangeet, Wedding, and Reception with dates, timings, venues, and dress codes.
- **Photo / Monogram Upload**: Upload couple pre-wedding portrait or custom monogram with instant placement on the card.
- **History**: Full Undo, Redo, and Reset to Template defaults.

---

### 3. Printing Specifications & Dynamic Pricing
- **Dimensions**: Standard Royal (5" × 7"), Grand Imperial (6" × 8"), Editorial A5 (5.8" × 8.3"), Square Prestige (6" × 6").
- **Paper Stocks**:
  - 350 GSM Italian Fine Linen Matte
  - 400 GSM Shimmer Metallic Pearl
  - 450 GSM Hand-Deckled Artisanal Cotton
  - 600 GSM Ultra-Thick Velvet Duplex Board
- **Artisan Finishes**: Real 24K Hot Stamped Gold Foil, Rose Gold Foil, Deep Blind Embossing, Raised Spot UV Gloss.
- **Envelopes**: Premium Vellum, Foil-Lined with Monogram Flap, Hand-Poured Wax Seal Kit.
- **Dynamic Cost Calculator**: Instant volume discounts (7% at 100 pcs, 12% at 150 pcs, 18% at 250 pcs, 25% at 500+ pcs), 18% stationery GST, and free courier shipping on orders above ₹15,000.
- **Booking Options**: 25% Advance Booking Deposit or 100% Full Payment.

---

### 4. Print-Ready Vector PDF Generation
- High-resolution vector output via `jspdf`.
- **3mm (0.125") industry-standard Bleed** on all 4 edges.
- **Precision Crop / Trim Marks** at corner intersections.
- **Registration Crosshair Marks** at cardinal midpoints.
- **CMYK & Gold Density Calibration Bars**.
- **Technical Production Slug**: Client name, Order ID, paper stock, foil specification, and 300 DPI resolution certificate.
- **Customer Digital Proof Sheet**: A4 summary sheet for instant verification.

---

### 5. Business Admin Dashboard (`/admin`)
- **Order Management**: Search by client name, order ID, or phone number.
- **Order Status Workflow**: Move orders through pipeline:
  `New Order` → `Under Review` → `Approved for Printing` → `Printing in Progress` → `Dispatched` → `Completed`.
- **Pre-Press Inspector Modal**: Inspect front and back proofs and download 300 DPI print-ready PDFs with 1 click.
- **Template Manager**: Upload and register new custom templates with custom design IDs, pricing, and category assignments.
- **Pricing Configuration**: Modify base rates, finish surcharges, volume discount tiers, and courier thresholds.
- **Business Analytics**: Track total revenue, live orders in production, and collection popularity.

---

### 6. Customer Order Tracking (`/track`)
- Track by Order ID and registered phone/email.
- Live 6-stage visual milestone stepper.
- Express courier tracking number (AWB) integration.
- Instant access to approved customer proof.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🗄️ Database Setup (Supabase)
The complete PostgreSQL schema with Row-Level Security (RLS) is located at:
`supabase/schema.sql`

To run:
1. Open your [Supabase Project Dashboard](https://supabase.com).
2. Go to the **SQL Editor**.
3. Paste the contents of `supabase/schema.sql` and click **Run**.

---

## 💳 Razorpay Payment Integration
Set the following environment variables in `.env.local` or Vercel:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

---

## ☁️ Deployment on Vercel
1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. Configure the environment variables from `.env.example`.
4. Click **Deploy**.

# cards
# cards
# cards
# cards
# cards
# cards
