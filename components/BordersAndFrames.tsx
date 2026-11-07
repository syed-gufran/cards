import React from 'react';
import { BorderStyle } from '@/types/wedding-card';

interface BorderFrameProps {
  style: BorderStyle;
  color: string;
  isFoil?: boolean;
}

export const BorderFrame: React.FC<BorderFrameProps> = ({
  style,
  color,
  isFoil = false,
}) => {
  const foilGradientId = `border-foil-${Math.random().toString(36).substring(2, 9)}`;
  const effectiveStroke = isFoil ? `url(#${foilGradientId})` : color;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox="0 0 600 840"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {isFoil && (
          <linearGradient id={foilGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBA67" />
            <stop offset="25%" stopColor="#FFF2B2" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="75%" stopColor="#AA8012" />
            <stop offset="100%" stopColor="#FFEAA7" />
          </linearGradient>
        )}
      </defs>

      {/* RENDER STYLES */}
      {style === 'royal-filigree' && (
        <g stroke={effectiveStroke}>
          {/* Outer Border */}
          <rect x="24" y="24" width="552" height="792" rx="4" strokeWidth="2.5" />
          {/* Inner Inset Border */}
          <rect x="36" y="36" width="528" height="768" rx="2" strokeWidth="1" strokeDasharray="4 2" />

          {/* Top Left Filigree */}
          <path d="M24 64C46 64 64 46 64 24" strokeWidth="2" />
          <path d="M24 76C54 76 76 54 76 24" strokeWidth="1.2" />
          <circle cx="50" cy="50" r="4" fill={effectiveStroke} />

          {/* Top Right Filigree */}
          <path d="M576 64C554 64 536 46 536 24" strokeWidth="2" />
          <path d="M576 76C546 76 524 54 524 24" strokeWidth="1.2" />
          <circle cx="550" cy="50" r="4" fill={effectiveStroke} />

          {/* Bottom Left Filigree */}
          <path d="M24 776C46 776 64 794 64 816" strokeWidth="2" />
          <path d="M24 764C54 764 76 786 76 816" strokeWidth="1.2" />
          <circle cx="50" cy="790" r="4" fill={effectiveStroke} />

          {/* Bottom Right Filigree */}
          <path d="M576 776C554 776 536 794 536 816" strokeWidth="2" />
          <path d="M576 764C546 764 524 786 524 816" strokeWidth="1.2" />
          <circle cx="550" cy="790" r="4" fill={effectiveStroke} />

          {/* Top Center Crown Ornament */}
          <path d="M275 36C290 28 310 28 325 36" strokeWidth="2" />
          <circle cx="300" cy="28" r="3" fill={effectiveStroke} />

          {/* Bottom Center Ornament */}
          <path d="M275 804C290 812 310 812 325 804" strokeWidth="2" />
          <circle cx="300" cy="812" r="3" fill={effectiveStroke} />
        </g>
      )}

      {style === 'mughal-arch' && (
        <g stroke={effectiveStroke}>
          {/* Outer rectangular boundary */}
          <rect x="22" y="22" width="556" height="796" strokeWidth="2.5" />
          <rect x="30" y="30" width="540" height="780" strokeWidth="1" />

          {/* Polylobed Cusped Mughal Arch Header */}
          <path
            d="M30 220V170C70 170 100 150 140 140C180 130 210 110 240 90C270 70 290 50 300 42C310 50 330 70 360 90C390 110 420 130 460 140C500 150 530 170 570 170V220"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Secondary Inset Arch */}
          <path
            d="M40 220V180C80 180 110 160 150 150C190 140 220 120 250 100C275 82 295 62 300 54C305 62 325 82 350 100C380 120 410 140 450 150C490 160 520 180 560 180V220"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />

          {/* Arch Finial */}
          <circle cx="300" cy="38" r="3.5" fill={effectiveStroke} />
          <path d="M300 34V24" strokeWidth="2" />

          {/* Base border detailing */}
          <path d="M30 800H570" strokeWidth="1.5" />
          <path d="M40 790H560" strokeWidth="1" strokeDasharray="4 2" />
        </g>
      )}

      {style === 'mandala-corner' && (
        <g stroke={effectiveStroke}>
          {/* Crisp Double Frame */}
          <rect x="26" y="26" width="548" height="788" strokeWidth="2" />
          <rect x="38" y="38" width="524" height="764" strokeWidth="0.8" />

          {/* Top Left Quarter Mandala */}
          <g transform="translate(38, 38)">
            <circle cx="0" cy="0" r="60" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="45" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="30" strokeWidth="1" />
            <circle cx="0" cy="0" r="15" strokeWidth="2" />
            <path d="M0 60L42 42L60 0" strokeWidth="1" />
          </g>

          {/* Top Right Quarter Mandala */}
          <g transform="translate(562, 38)">
            <circle cx="0" cy="0" r="60" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="45" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="30" strokeWidth="1" />
            <circle cx="0" cy="0" r="15" strokeWidth="2" />
            <path d="M0 60L-42 42L-60 0" strokeWidth="1" />
          </g>

          {/* Bottom Left Quarter Mandala */}
          <g transform="translate(38, 802)">
            <circle cx="0" cy="0" r="60" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="45" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="30" strokeWidth="1" />
            <circle cx="0" cy="0" r="15" strokeWidth="2" />
            <path d="M0 -60L42 -42L60 0" strokeWidth="1" />
          </g>

          {/* Bottom Right Quarter Mandala */}
          <g transform="translate(562, 802)">
            <circle cx="0" cy="0" r="60" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="45" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="30" strokeWidth="1" />
            <circle cx="0" cy="0" r="15" strokeWidth="2" />
            <path d="M0 -60L-42 -42L-60 0" strokeWidth="1" />
          </g>
        </g>
      )}

      {style === 'ornate-gold' && (
        <g stroke={effectiveStroke}>
          {/* Multi-layered Ornate Frame */}
          <rect x="20" y="20" width="560" height="800" strokeWidth="3" />
          <rect x="28" y="28" width="544" height="784" strokeWidth="1" strokeDasharray="2 3" />
          <rect x="34" y="34" width="532" height="772" strokeWidth="1.5" />

          {/* Corner Rosettes */}
          {[[45, 45], [555, 45], [45, 795], [555, 795]].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="8" strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r="4" fill={effectiveStroke} />
              <path d={`M${cx - 14} ${cy}H${cx + 14}M${cx} ${cy - 14}V${cy + 14}`} strokeWidth="1" />
            </g>
          ))}
        </g>
      )}

      {style === 'minimal-double' && (
        <g stroke={effectiveStroke}>
          {/* Editorial Minimalist Frame */}
          <rect x="30" y="30" width="540" height="780" strokeWidth="1" />
          <rect x="36" y="36" width="528" height="768" strokeWidth="0.6" />

          {/* Micro Corner Insets */}
          <path d="M30 46H46V30" strokeWidth="1" />
          <path d="M570 46H554V30" strokeWidth="1" />
          <path d="M30 794H46V810" strokeWidth="1" />
          <path d="M570 794H554V810" strokeWidth="1" />
        </g>
      )}

      {style === 'floral-vine' && (
        <g stroke={effectiveStroke}>
          <rect x="28" y="28" width="544" height="784" rx="6" strokeWidth="2" />
          {/* Leaves along top */}
          <path d="M150 28C160 20 180 20 190 28M240 28C250 20 270 20 280 28M320 28C330 20 350 20 360 28M410 28C420 20 440 20 450 28" strokeWidth="1.5" />
          {/* Leaves along bottom */}
          <path d="M150 812C160 820 180 820 190 812M240 812C250 820 270 820 280 812M320 812C330 820 350 820 360 812M410 812C420 820 440 820 450 812" strokeWidth="1.5" />
          {/* Floral sprays in corners */}
          <path d="M28 70C38 60 55 58 65 65C60 48 45 35 28 28" strokeWidth="1.8" />
          <path d="M572 70C562 60 545 58 535 65C540 48 555 35 572 28" strokeWidth="1.8" />
          <path d="M28 770C38 780 55 782 65 775C60 792 45 805 28 812" strokeWidth="1.8" />
          <path d="M572 770C562 780 545 782 535 775C540 792 555 805 572 812" strokeWidth="1.8" />
        </g>
      )}

      {style === 'pichwai-arch' && (
        <g stroke={effectiveStroke}>
          {/* Pichwai Arch with Scalloped Lotus Petals */}
          <rect x="25" y="25" width="550" height="790" strokeWidth="2.5" />
          <rect x="35" y="35" width="530" height="770" strokeWidth="1" strokeDasharray="2 4" />
          <path
            d="M50 220V140C90 140 120 110 160 110C200 110 230 80 270 80C285 80 295 65 300 55C305 65 315 80 330 80C370 80 400 110 440 110C480 110 510 140 550 140V220"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Lotus petal scallops on base */}
          <path
            d="M50 780C75 795 100 780 125 780C150 780 175 795 200 780C225 780 250 795 275 780C300 780 325 795 350 780C375 780 400 795 425 780C450 780 475 795 500 780C525 780 550 795 550 780"
            strokeWidth="1.8"
          />
        </g>
      )}

      {style === 'geometric-jali' && (
        <g stroke={effectiveStroke}>
          {/* Islamic Star & Hexagon Lattice Frame */}
          <rect x="22" y="22" width="556" height="796" strokeWidth="2.5" />
          <rect x="42" y="42" width="516" height="756" strokeWidth="1.5" />

          {/* Trellis Pattern inside border margin */}
          <path d="M22 62H42M22 102H42M22 142H42M22 182H42M22 222H42M22 262H42M22 302H42" strokeWidth="1" />
          <path d="M558 62H578M558 102H578M558 142H578M558 182H578M558 222H578M558 262H578M558 302H578" strokeWidth="1" />

          {/* Geometric Corner Stars */}
          {[[32, 32], [568, 32], [32, 808], [568, 808]].map(([cx, cy], idx) => (
            <g key={idx}>
              <rect x={cx - 6} y={cy - 6} width="12" height="12" strokeWidth="1" />
              <rect x={cx - 6} y={cy - 6} width="12" height="12" transform={`rotate(45, ${cx}, ${cy})`} strokeWidth="1" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
};

