'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DesignTemplate, WeddingCategory, CardSideDesign } from '@/types/wedding-card';
import { saveTemplate } from '@/utils/storage';
import { getDefaultSuitePages } from '@/utils/suite-pages';
import {
  Camera,
  Upload,
  RefreshCw,
  X,
  Sparkles,
  Check,
  CheckCircle2,
  ScanLine,
  Sliders,
  AlertCircle,
} from 'lucide-react';

interface CardScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated?: (templateId: string) => void;
}

export const CardScannerModal: React.FC<CardScannerModalProps> = ({
  isOpen,
  onClose,
  onTemplateCreated,
}) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // Captured snapshot state
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedBgColor, setDetectedBgColor] = useState<string>('#FAF8F2');
  const [detectedAccentColor, setDetectedAccentColor] = useState<string>('#D4AF37');

  // Detected fields
  const [cardTitle, setCardTitle] = useState<string>('My Scanned Wedding Card');
  const [cardCategory, setCardCategory] = useState<WeddingCategory>('Royal');
  const [brideName, setBrideName] = useState<string>('Ananya');
  const [groomName, setGroomName] = useState<string>('Rohan');
  const [weddingDate, setWeddingDate] = useState<string>('Sunday, 14th December 2026');
  const [venue, setVenue] = useState<string>('The Grand Palace, Civil Lines');
  const [shloka, setShloka] = useState<string>('॥ श्री गणेशाय नमः ॥');

  // Start Camera Stream
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported by your browser. Please upload an image instead.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera error', err);
      setCameraError(
        'Unable to access camera. Please check camera permissions or upload a card photo from your gallery.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Analyze dominant colors from captured canvas image
  const analyzeDominantColors = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      const imgData = ctx.getImageData(0, 0, width, height).data;
      let r = 0,
        g = 0,
        b = 0;
      let count = 0;

      // Sample pixels
      for (let i = 0; i < imgData.length; i += 40) {
        r += imgData[i];
        g += imgData[i + 1];
        b += imgData[i + 2];
        count++;
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      const toHex = (c: number) => c.toString(16).padStart(2, '0');
      const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      setDetectedBgColor(hex);

      // Determine contrasting accent color (Gold or Deep Crimson)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      if (brightness > 130) {
        setDetectedAccentColor('#801222'); // Dark red / maroon for light background
      } else {
        setDetectedAccentColor('#D4AF37'); // Gold for dark background
      }
    } catch (e) {
      // Fallback
      setDetectedBgColor('#4D0711');
      setDetectedAccentColor('#D4AF37');
    }
  };

  // Snap photo from live camera
  const handleSnap = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1200;
    canvas.height = video.videoHeight || 1600;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      analyzeDominantColors(ctx, canvas.width, canvas.height);
      stopCamera();
    }
    setIsCapturing(false);
  };

  // Upload card from device file picker
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCapturedImage(dataUrl);

      // Analyze image
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          analyzeDominantColors(ctx, img.width, img.height);
        }
      };
      img.src = dataUrl;
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Generate Template & Open in Editor
  const handleCreateTemplate = () => {
    if (!capturedImage) return;

    const uniqueId = `SCAN-${Date.now().toString().slice(-6)}`;

    // Build the front design using the scanned card as the base artwork!
    const scannedFrontDesign: CardSideDesign = {
      backgroundType: 'solid',
      backgroundValue: detectedBgColor,
      borderStyle: 'royal-filigree',
      borderColor: detectedAccentColor,
      borderFoilEffect: true,
      userPhotoUrl: capturedImage, // High-res scanned background artwork
      userPhotoPosition: { xPercent: 50, yPercent: 50, widthPercent: 96 },
      motifs: [
        {
          id: 'motif-scan-1',
          type: 'ganesha',
          position: { xPercent: 50, yPercent: 12 },
          size: 48,
          color: detectedAccentColor,
        },
      ],
      elements: [
        {
          id: 'scan-shloka',
          label: 'Religious Invocation',
          text: shloka,
          defaultText: shloka,
          xPercent: 50,
          yPercent: 20,
          fontSize: 15,
          fontFamily: 'serif',
          color: detectedAccentColor,
          fontWeight: 'bold',
          textAlign: 'center',
          category: 'religious',
        },
        {
          id: 'scan-host',
          label: 'Host Family Line',
          text: 'Together with their families,\nrequest the pleasure of your company on the auspicious marriage of',
          defaultText: 'Together with their families,\nrequest the pleasure of your company on the auspicious marriage of',
          xPercent: 50,
          yPercent: 32,
          fontSize: 12,
          fontFamily: 'serif',
          color: detectedAccentColor,
          fontWeight: 'normal',
          textAlign: 'center',
          widthPercent: 82,
          category: 'host',
        },
        {
          id: 'scan-bride',
          label: "Bride's Name",
          text: brideName,
          defaultText: brideName,
          xPercent: 50,
          yPercent: 44,
          fontSize: 38,
          fontFamily: 'serif',
          color: detectedAccentColor,
          fontWeight: 'bold',
          textAlign: 'center',
          category: 'couple',
        },
        {
          id: 'scan-joiner',
          label: 'Joiner',
          text: '— weds —',
          defaultText: '— weds —',
          xPercent: 50,
          yPercent: 51,
          fontSize: 14,
          fontFamily: 'serif',
          fontStyle: 'italic',
          color: detectedAccentColor,
          fontWeight: 'normal',
          textAlign: 'center',
          category: 'couple',
        },
        {
          id: 'scan-groom',
          label: "Groom's Name",
          text: groomName,
          defaultText: groomName,
          xPercent: 50,
          yPercent: 58,
          fontSize: 38,
          fontFamily: 'serif',
          color: detectedAccentColor,
          fontWeight: 'bold',
          textAlign: 'center',
          category: 'couple',
        },
        {
          id: 'scan-date',
          label: 'Wedding Date',
          text: weddingDate,
          defaultText: weddingDate,
          xPercent: 50,
          yPercent: 72,
          fontSize: 12.5,
          fontFamily: 'serif',
          color: detectedAccentColor,
          fontWeight: '600',
          letterSpacing: 1.2,
          textAlign: 'center',
          category: 'event',
        },
        {
          id: 'scan-venue',
          label: 'Venue Address',
          text: venue,
          defaultText: venue,
          xPercent: 50,
          yPercent: 82,
          fontSize: 11,
          fontFamily: 'sans',
          color: detectedAccentColor,
          fontWeight: 'normal',
          letterSpacing: 1,
          textAlign: 'center',
          category: 'venue',
        },
      ],
    };

    // Scanned Back Design
    const scannedBackDesign: CardSideDesign = {
      backgroundType: 'solid',
      backgroundValue: detectedBgColor,
      borderStyle: 'royal-filigree',
      borderColor: detectedAccentColor,
      borderFoilEffect: true,
      motifs: [],
      elements: [
        {
          id: 'scan-b-title',
          label: 'Itinerary Header',
          text: 'WEDDING CELEBRATIONS & CEREMONIES',
          defaultText: 'WEDDING CELEBRATIONS & CEREMONIES',
          xPercent: 50,
          yPercent: 20,
          fontSize: 14,
          fontFamily: 'serif',
          color: detectedAccentColor,
          fontWeight: 'bold',
          letterSpacing: 2,
          textAlign: 'center',
          category: 'header',
        },
        {
          id: 'scan-b-events',
          label: 'Functions Program',
          text: 'MEHENDI & SANGEET NIGHT\nSaturday, 13th Dec | 07:00 PM\n\nBARAAT & VIVAH SANSKAR\nSunday, 14th Dec | 06:30 PM Onwards\n\nGRAND RECEPTION\nMonday, 15th Dec | 08:00 PM',
          defaultText: 'MEHENDI & SANGEET NIGHT\nSaturday, 13th Dec | 07:00 PM\n\nBARAAT & VIVAH SANSKAR\nSunday, 14th Dec | 06:30 PM Onwards\n\nGRAND RECEPTION\nMonday, 15th Dec | 08:00 PM',
          xPercent: 50,
          yPercent: 52,
          fontSize: 12,
          fontFamily: 'serif',
          color: detectedAccentColor,
          fontWeight: 'normal',
          textAlign: 'center',
          category: 'event',
        },
      ],
    };

    const newTemplate: DesignTemplate = {
      id: uniqueId,
      title: cardTitle,
      category: cardCategory,
      description: `Digitized wedding card scanned via live camera. Features custom scanned artwork and editable text overlays.`,
      tags: ['Scanned', 'Camera Scan', 'Custom', cardCategory],
      dimensions: {
        widthMm: 127,
        heightMm: 178,
        label: '5" × 7" (127 × 178 mm)',
      },
      orientation: 'portrait',
      basePricePerCard: 65,
      rating: 5.0,
      reviewCount: 1,
      themeColor: detectedAccentColor,
      frontDesign: scannedFrontDesign,
      backDesign: scannedBackDesign,
      sampleBrideName: brideName,
      sampleGroomName: groomName,
      sampleWeddingDate: weddingDate,
    };

    // Initialize all full suite pages (Inside Left, Inside Right, Outside Back, Baraat Pass card)
    newTemplate.suitePages = getDefaultSuitePages(newTemplate);

    // Save to persistent storage
    saveTemplate(newTemplate);

    onClose();

    if (onTemplateCreated) {
      onTemplateCreated(uniqueId);
    } else {
      router.push(`/editor/${uniqueId}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="bg-stone-900 border border-gold-500/30 rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                Scan Any Card With Camera
              </h3>
              <p className="text-[11px] text-stone-400">
                Snap physical card or upload photo to digitize and edit instantly
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-full bg-stone-800 hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: CAMERA VIEWFINDER (IF NO SNAPSHOT YET) */}
          {!capturedImage ? (
            <div className="space-y-4">
              <div className="relative aspect-[3/4] sm:aspect-[4/3] max-h-[380px] bg-black rounded-2xl overflow-hidden border border-gold-500/40 shadow-inner flex items-center justify-center">
                {/* Live Camera Video */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Viewfinder Target Framing Guidelines */}
                <div className="absolute inset-6 sm:inset-10 border border-gold-400/50 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between">
                    <span className="w-5 h-5 border-t-2 border-l-2 border-gold-400" />
                    <span className="w-5 h-5 border-t-2 border-r-2 border-gold-400" />
                  </div>

                  {/* Animated laser scanning line */}
                  <motion.div
                    className="w-full h-1 bg-gradient-to-r from-transparent via-gold-300 to-transparent shadow-[0_0_12px_#D4AF37] my-auto"
                    animate={{ y: [-90, 90, -90] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  <div className="flex justify-between">
                    <span className="w-5 h-5 border-b-2 border-l-2 border-gold-400" />
                    <span className="w-5 h-5 border-b-2 border-r-2 border-gold-400" />
                  </div>
                </div>

                {/* Camera error message if any */}
                {cameraError && (
                  <div className="absolute inset-0 bg-stone-900/90 p-6 flex flex-col items-center justify-center text-center space-y-3 z-20">
                    <AlertCircle className="w-10 h-10 text-amber-400" />
                    <p className="text-xs text-stone-300 max-w-sm">{cameraError}</p>
                    <label className="px-4 py-2 bg-gold-500 text-stone-950 font-bold text-xs rounded-xl cursor-pointer hover:bg-gold-400 transition-colors">
                      Choose Photo From Device
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Viewfinder Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-1">
                {/* File Upload Fallback */}
                <label className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-gold-400" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Capture Snap Button */}
                <button
                  type="button"
                  onClick={handleSnap}
                  disabled={isCapturing || !!cameraError}
                  className="px-6 py-3 bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-600 hover:to-amber-600 disabled:opacity-40 text-stone-950 font-serif font-bold text-sm rounded-xl shadow-lg shadow-gold-500/20 flex items-center gap-2 transition-all transform active:scale-95"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>Capture Card Now</span>
                </button>

                {/* Switch Camera */}
                <button
                  type="button"
                  onClick={toggleCamera}
                  className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl border border-stone-700 transition-colors"
                  title="Switch Camera"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: SCANNED RESULT & SMART DIGITIZER FORM */
            <div className="space-y-6">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Card Captured &amp; Color Palette Extracted!</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCapturedImage(null);
                    startCamera();
                  }}
                  className="text-[11px] text-stone-400 hover:text-white underline"
                >
                  Retake Photo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                {/* Snapshot Thumbnail with detected colors */}
                <div className="sm:col-span-5 space-y-3">
                  <div className="relative aspect-[5/7] rounded-xl overflow-hidden border-2 border-gold-500/50 shadow-xl bg-stone-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={capturedImage}
                      alt="Scanned card"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 p-2 bg-black/70 backdrop-blur-xs rounded-lg text-[10px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Detected Base:</span>
                        <span
                          className="w-3.5 h-3.5 rounded border border-white"
                          style={{ backgroundColor: detectedBgColor }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Foil Accent:</span>
                        <span
                          className="w-3.5 h-3.5 rounded border border-white"
                          style={{ backgroundColor: detectedAccentColor }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detected / Extracted Editable Text Form */}
                <div className="sm:col-span-7 space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      Template Title
                    </label>
                    <input
                      type="text"
                      value={cardTitle}
                      onChange={(e) => setCardTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-serif"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1">
                        Category
                      </label>
                      <select
                        value={cardCategory}
                        onChange={(e) => setCardCategory(e.target.value as WeddingCategory)}
                        className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white"
                      >
                        <option value="Royal">Royal Rajputana</option>
                        <option value="Muslim">Noor Nikah</option>
                        <option value="Sikh">Anand Karaj</option>
                        <option value="Hindu">Traditional Hindu</option>
                        <option value="Minimal">Minimalist</option>
                        <option value="Floral">Pastel Floral</option>
                        <option value="Luxury">Imperial Luxury</option>
                        <option value="Modern">Modern &amp; Destination</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1">
                        Invocation / Shloka
                      </label>
                      <input
                        type="text"
                        value={shloka}
                        onChange={(e) => setShloka(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-serif"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1">
                        Bride&apos;s Name
                      </label>
                      <input
                        type="text"
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-serif font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1">
                        Groom&apos;s Name
                      </label>
                      <input
                        type="text"
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-serif font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      Wedding Date &amp; Timing
                    </label>
                    <input
                      type="text"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      Venue &amp; Location
                    </label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Conversion CTA */}
              <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-stone-400">
                  ✨ Will generate full multi-page suite (Cover, Inside pages &amp; Baraat pass)
                </span>
                <button
                  type="button"
                  onClick={handleCreateTemplate}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-stone-950 font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Convert to Editable Template &amp; Open Studio →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

