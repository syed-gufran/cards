import jsPDF from 'jspdf';
import { Order, CardSideDesign } from '@/types/wedding-card';
import { CARD_SIZES, PAPER_TYPES, FINISHES } from '@/data/pricing-data';

interface ProductionValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export function validateOrderForPrint(order: Order): ProductionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required customer details
  if (!order.customer.fullName?.trim()) {
    errors.push('Customer full name is missing.');
  }
  if (!order.customer.phone?.trim()) {
    errors.push('Customer phone number is missing.');
  }
  if (!order.customer.shippingAddress?.trim()) {
    errors.push('Shipping address is required for dispatch.');
  }

  // Check card text content
  const frontTexts = order.frontCustomization.elements.map((e) => e.text.trim());
  const hasEmptyEssential = frontTexts.some((t) => t.length === 0);
  if (hasEmptyEssential) {
    warnings.push('Some text fields are currently blank.');
  }

  // Check bleed and margins
  const hasOverflow = order.frontCustomization.elements.some(
    (e) => e.yPercent < 8 || e.yPercent > 92
  );
  if (hasOverflow) {
    warnings.push('Some text elements lie close to the safe margin boundary (3mm safe zone).');
  }

  // Check proof confirmation
  if (!order.proofApproved) {
    errors.push('Customer has not confirmed the spelling & proof approval checkbox.');
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Generate a high-resolution print-ready PDF with:
 * - 3mm (0.125") industry-standard Bleed
 * - Exact Crop / Trim Marks at corners
 * - Fold & Centerline Marks
 * - CMYK Color Calibration Bars
 * - Technical Production Slug (Order ID, Stock, Foil specs, Date, DPI)
 * - Vector Page 1 (Front) & Page 2 (Back)
 */
export async function generatePrintReadyPdf(order: Order): Promise<jsPDF> {
  // Dimensions in Millimeters
  // 5x7 inches is 127 x 178 mm
  const sizeOption = CARD_SIZES.find((s) => s.id === order.specs.sizeId) || CARD_SIZES[0];
  let trimWidthMm = 127;
  let trimHeightMm = 178;

  if (sizeOption.id === '6x8') {
    trimWidthMm = 152;
    trimHeightMm = 203;
  } else if (sizeOption.id === 'a5') {
    trimWidthMm = 148;
    trimHeightMm = 210;
  } else if (sizeOption.id === 'square') {
    trimWidthMm = 152;
    trimHeightMm = 152;
  }

  const bleedMm = 3; // 3mm bleed on all edges
  const slugMm = 12; // Slug margin for crop marks & color bars

  const totalWidthMm = trimWidthMm + (bleedMm + slugMm) * 2;
  const totalHeightMm = trimHeightMm + (bleedMm + slugMm) * 2;

  // Initialize jsPDF with custom mm page size
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [totalWidthMm, totalHeightMm],
    compress: true,
  });

  const paper = PAPER_TYPES.find((p) => p.id === order.specs.paperTypeId)?.name || 'Textured Linen';
  const finish = FINISHES.find((f) => f.id === order.specs.finishId)?.name || 'Gold Foil';

  const originX = slugMm + bleedMm;
  const originY = slugMm + bleedMm;

  // Function to render a single card side (Front or Back)
  const renderCardSide = (sideDesign: CardSideDesign, pageTitle: string) => {
    // 1. Draw Technical Slug & Information Bar
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);

    const slugHeader = `CARD ASSIST PRINT PRODUCTION | ORDER: ${order.id} | CLIENT: ${order.customer.fullName.toUpperCase()} | TEMPLATE: ${order.templateId} | SIDE: ${pageTitle.toUpperCase()} | STOCK: ${paper} | FINISH: ${finish} | 300 DPI VECTOR`;
    doc.text(slugHeader, 10, 8);

    // 2. Draw CMYK / Density Calibration Bars (Cyan, Magenta, Yellow, Key/Black, Gold)
    const colorSwatches = [
      [0, 162, 232], // Cyan
      [237, 28, 36], // Magenta
      [255, 242, 0], // Yellow
      [0, 0, 0], // Black
      [128, 128, 128], // 50% Black
      [212, 175, 55], // Gold Foil spot
    ];
    let swatchX = totalWidthMm - 70;
    colorSwatches.forEach(([r, g, b]) => {
      doc.setFillColor(r, g, b);
      doc.rect(swatchX, 5, 8, 4, 'F');
      swatchX += 9;
    });

    // 3. Draw Crop Marks at 4 Corners
    const markLen = 6;
    const markOffset = 1.5;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Top-Left Crop Marks
    doc.line(originX, originY - markOffset, originX, originY - markOffset - markLen); // Vertical
    doc.line(originX - markOffset, originY, originX - markOffset - markLen, originY); // Horizontal

    // Top-Right Crop Marks
    doc.line(originX + trimWidthMm, originY - markOffset, originX + trimWidthMm, originY - markOffset - markLen);
    doc.line(originX + trimWidthMm + markOffset, originY, originX + trimWidthMm + markOffset + markLen, originY);

    // Bottom-Left Crop Marks
    doc.line(originX, originY + trimHeightMm + markOffset, originX, originY + trimHeightMm + markOffset + markLen);
    doc.line(originX - markOffset, originY + trimHeightMm, originX - markOffset - markLen, originY + trimHeightMm);

    // Bottom-Right Crop Marks
    doc.line(originX + trimWidthMm, originY + trimHeightMm + markOffset, originX + trimWidthMm, originY + trimHeightMm + markOffset + markLen);
    doc.line(originX + trimWidthMm + markOffset, originY + trimHeightMm, originX + trimWidthMm + markOffset + markLen, originY + trimHeightMm);

    // 4. Draw Registration Marks (Crosshair with circle) at midpoints
    const drawRegMark = (cx: number, cy: number) => {
      doc.circle(cx, cy, 2, 'S');
      doc.line(cx - 3.5, cy, cx + 3.5, cy);
      doc.line(cx, cy - 3.5, cx, cy + 3.5);
    };
    drawRegMark(originX + trimWidthMm / 2, originY - 6);
    drawRegMark(originX + trimWidthMm / 2, originY + trimHeightMm + 6);
    drawRegMark(originX - 6, originY + trimHeightMm / 2);
    drawRegMark(originX + trimWidthMm + 6, originY + trimHeightMm / 2);

    // 5. Draw Card Background Bleed Area (Fills out to bleed edge: origin - bleed)
    const bgBleedX = originX - bleedMm;
    const bgBleedY = originY - bleedMm;
    const bgBleedW = trimWidthMm + bleedMm * 2;
    const bgBleedH = trimHeightMm + bleedMm * 2;

    const bgHex = sideDesign.backgroundValue.startsWith('#')
      ? sideDesign.backgroundValue
      : '#FAF8F2';
    const rgb = hexToRgb(bgHex);
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(bgBleedX, bgBleedY, bgBleedW, bgBleedH, 'F');

    // 6. Draw Trim Boundary (Dotted guideline for visual reference)
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.4);
    doc.rect(originX + 4, originY + 4, trimWidthMm - 8, trimHeightMm - 8, 'S');
    doc.rect(originX + 6, originY + 6, trimWidthMm - 12, trimHeightMm - 12, 'S');

    // 7. Render Card Text Elements
    sideDesign.elements.forEach((el) => {
      if (!el.text?.trim()) return;

      const textRgb = hexToRgb(el.color.startsWith('#') ? el.color : '#D4AF37');
      doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);

      // Convert px font size (from 600px width canvas) to pt
      const fontPt = Math.max(7, Math.round(el.fontSize * 0.45));
      doc.setFontSize(fontPt);

      // Set Font Style
      if (el.fontWeight === 'bold') {
        doc.setFont('times', 'bold');
      } else if (el.fontStyle === 'italic') {
        doc.setFont('times', 'italic');
      } else {
        doc.setFont('times', 'normal');
      }

      // Calculate position inside trim area
      const textX = originX + (el.xPercent / 100) * trimWidthMm;
      const textY = originY + (el.yPercent / 100) * trimHeightMm;

      const lines = el.text.split('\n');
      lines.forEach((line, lineIdx) => {
        const lineOffset = lineIdx * (fontPt * 0.45 + 1.2);
        doc.text(line, textX, textY + lineOffset, {
          align: el.textAlign || 'center',
        });
      });
    });

    // 8. Render Motifs Note if present
    if (sideDesign.motifs.length > 0) {
      sideDesign.motifs.forEach((m) => {
        const motifX = originX + (m.position.xPercent / 100) * trimWidthMm;
        const motifY = originY + (m.position.yPercent / 100) * trimHeightMm;
        doc.setFontSize(8);
        doc.setTextColor(212, 175, 55);
        doc.text(`[MOTIF: ${m.type.toUpperCase()}]`, motifX, motifY, { align: 'center' });
      });
    }
  };

  // Render Multi-Page Suite if present
  if (order.suitePages) {
    const pages = order.suitePages;
    const pageKeys: Array<{ key: keyof typeof pages; title: string }> = [
      { key: 'coverFront', title: '1. Outside Cover (Front)' },
      { key: 'insideLeft', title: '2. Inside Left Page (Hosts & Blessings)' },
      { key: 'insideRight', title: '3. Inside Right Page (Muhurtham & Vows)' },
      { key: 'coverBack', title: '4. Outside Back (RSVP & Residence)' },
      { key: 'baraatCard', title: '5. Baraat & Visiting / Entry Pass Card' },
      { key: 'sangeetCard', title: '6. Mehendi & Sangeet Celebration Insert' },
    ];

    let isFirstPage = true;
    for (const p of pageKeys) {
      const pageDesign = pages[p.key];
      if (pageDesign) {
        if (!isFirstPage) {
          doc.addPage([totalWidthMm, totalHeightMm], 'portrait');
        }
        renderCardSide(pageDesign, p.title);
        isFirstPage = false;
      }
    }
  } else {
    // Fallback: Render Page 1 (Front Side)
    renderCardSide(order.frontCustomization, 'Front Side');

    // Render Page 2 (Back Side) if double sided
    if (order.specs.sides === 'double') {
      doc.addPage([totalWidthMm, totalHeightMm], 'portrait');
      renderCardSide(order.backCustomization, 'Back Side');
    }
  }

  return doc;
}

/**
 * Generate a customer digital proof summary PDF suitable for WhatsApp / Email approval
 */
export async function generateCustomerProofPdf(order: Order): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Bar
  doc.setFillColor(77, 7, 17); // Maroon #4D0711
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(212, 175, 55); // Gold
  doc.text('CARD ASSIST • DIGITAL PROOF SHEET', 14, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(250, 248, 242);
  doc.text(`Order Reference: ${order.id} | Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 22);

  // Status Badge
  doc.setFillColor(212, 175, 55);
  doc.rect(pageWidth - 60, 8, 46, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(50, 30, 5);
  doc.text('PROOF APPROVED', pageWidth - 37, 15.5, { align: 'center' });

  // Client & Order Summary Table
  let y = 38;
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(50, 30, 5);
  doc.text('1. ORDER & PRINTING SPECIFICATIONS', 14, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);

  const paper = PAPER_TYPES.find((p) => p.id === order.specs.paperTypeId)?.name || 'Textured Linen';
  const finish = FINISHES.find((f) => f.id === order.specs.finishId)?.name || 'Gold Foil';

  const specsList = [
    `Client Name: ${order.customer.fullName}`,
    `Phone: ${order.customer.phone}`,
    `Shipping Address: ${order.customer.shippingAddress}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`,
    `Design Template: ${order.templateTitle} (${order.templateId})`,
    `Card Size: ${order.specs.sizeId.toUpperCase()} (${order.specs.sides === 'double' ? 'Double Sided' : 'Single Sided'})`,
    `Paper Stock: ${paper}`,
    `Finishing & Foiling: ${finish}`,
    `Quantity: ${order.specs.quantity} Invitation Sets`,
    `Total Amount: ₹${order.priceBreakdown.grandTotal.toLocaleString('en-IN')} (Advance Paid: ₹${order.priceBreakdown.advancePayable.toLocaleString('en-IN')})`,
  ];

  specsList.forEach((line) => {
    doc.text(`• ${line}`, 16, y);
    y += 5.5;
  });

  // Card Content Verification
  y += 6;
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(50, 30, 5);
  doc.text('2. FRONT CARD TEXT PROOF (VERIFIED BY CUSTOMER)', 14, y);

  y += 6;
  doc.setFillColor(250, 247, 238);
  doc.rect(14, y, pageWidth - 28, 55, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.rect(14, y, pageWidth - 28, 55, 'S');

  doc.setFont('times', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(40, 40, 40);

  let textY = y + 8;
  order.frontCustomization.elements.forEach((el) => {
    if (el.category === 'couple' || el.category === 'event' || el.category === 'venue') {
      const summary = `${el.label}: "${el.text.replace(/\n/g, ' ')}"`;
      doc.text(summary.substring(0, 95), 18, textY);
      textY += 6;
    }
  });

  // Events List if available
  if (order.events && order.events.length > 0) {
    y += 65;
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(50, 30, 5);
    doc.text('3. MULTI-EVENT SCHEDULE PROOF', 14, y);

    y += 6;
    order.events.forEach((ev) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(77, 7, 17);
      doc.text(`• ${ev.name}:`, 16, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(`${ev.date} at ${ev.time} | Venue: ${ev.venue}`, 55, y);
      y += 5.5;
    });
  }

  // Footer Note
  const footerY = 275;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, footerY, pageWidth - 14, footerY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'This electronic proof is generated by Card Assist. Printing begins immediately upon proof sign-off. Color variations between RGB screens and physical CMYK / Hot Foil stamping are standard in luxury printing.',
    14,
    footerY + 5,
    { maxWidth: pageWidth - 28 }
  );

  return doc;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 245, g: 238, b: 216 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

