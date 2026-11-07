import React from 'react';
import { MotifType } from '@/types/wedding-card';

interface MotifIconProps {
  type: MotifType;
  color?: string;
  size?: number;
  className?: string;
}

export const MotifIcon: React.FC<MotifIconProps> = ({
  type,
  color = '#D4AF37',
  size = 48,
  className = '',
}) => {
  if (type === 'none') return null;

  switch (type) {
    case 'ganesha':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Ornate Ganesha Silhouette */}
          <path
            d="M50 12C45 12 40 16 38 21C36 26 37 31 39 36C40 38 41 40 40 43C38 48 31 52 26 56C23 58 20 62 21 66C22 71 27 75 32 76C37 77 42 75 45 72C48 69 49 65 50 61C52 56 55 52 58 50C62 47 68 46 72 43C76 40 79 36 79 31C79 24 74 19 67 16C62 14 56 12 50 12Z"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Trunk Curve */}
          <path
            d="M50 42C47 48 46 56 48 63C49 67 52 70 56 70C60 70 63 67 63 63C63 58 59 55 56 52"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Crown (Mukut) */}
          <path
            d="M44 14L50 6L56 14M47 8L50 4L53 8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Tilak */}
          <circle cx="50" cy="24" r="2.5" fill={color} />
          <path d="M46 22H54" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          {/* Modak in trunk */}
          <circle cx="61" cy="62" r="3" fill={color} />
          {/* Tusk */}
          <path d="M42 36H36" stroke={color} strokeWidth="2" strokeLinecap="round" />
          {/* Ears */}
          <path
            d="M34 26C27 28 23 35 25 43C26 47 30 50 34 50"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M66 26C73 28 77 35 75 43C74 47 70 50 66 50"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'bismillah':
      return (
        <svg
          width={size * 1.5}
          height={size}
          viewBox="0 0 150 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Calligraphic Bismillah Motif */}
          <path
            d="M20 50C25 45 35 45 42 50C48 54 48 60 44 64C40 68 33 67 31 63C29 59 32 54 38 52C46 50 56 53 64 58C72 63 80 62 86 56C92 50 96 42 102 36C108 30 115 32 120 38C125 44 125 52 120 58C115 64 105 68 95 68C85 68 76 64 68 59"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M75 30V48M82 28V46M90 26V44"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M48 35C52 35 55 38 55 42M108 22C112 22 116 26 116 30"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Calligraphic diacritics / nuktas */}
          <circle cx="36" cy="72" r="2.2" fill={color} />
          <circle cx="68" cy="70" r="2.2" fill={color} />
          <circle cx="106" cy="46" r="2.2" fill={color} />
          <circle cx="126" cy="40" r="2.2" fill={color} />
          {/* Crescent and star mini ornament */}
          <path
            d="M75 16C77 17 78 19 78 21C78 24 75 26 72 26C74 25 75 23 75 21C75 19 74 17 72 16C73 16 74 16 75 16Z"
            fill={color}
          />
        </svg>
      );

    case 'ek_onkar':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Ik Onkar Sacred Symbol */}
          <path
            d="M28 42C28 32 36 24 46 24C56 24 64 32 64 42C64 48 60 54 54 57C48 60 42 62 38 68C34 74 36 82 43 85C50 88 58 86 64 80"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M44 24C44 18 52 14 62 14C74 14 84 22 84 34C84 46 76 54 66 58"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M64 42H78C82 42 86 38 86 34"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M62 14C62 8 54 6 48 8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'kalash':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Pot base */}
          <path
            d="M32 82C32 85 36 88 50 88C64 88 68 85 68 82L66 78H34L32 82Z"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          {/* Pot body */}
          <path
            d="M34 78C26 72 22 60 26 48C28 44 32 42 38 42H62C68 42 72 44 74 48C78 60 74 72 66 78H34Z"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Sacred thread (Moli) band */}
          <path d="M26 56H74M28 64H72" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          {/* Swastik / Auspicious mark in center */}
          <path d="M46 54H54M50 50V58M46 50V54M54 54V58" stroke={color} strokeWidth="1.5" />
          {/* Mango leaves */}
          <path
            d="M36 42C30 34 26 24 30 18C36 22 40 32 44 42"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M64 42C70 34 74 24 70 18C64 22 60 32 56 42"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M45 42C44 30 46 20 50 14C54 20 56 30 55 42"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Coconut (Nariyal) */}
          <circle cx="50" cy="30" r="10" stroke={color} strokeWidth="2" />
          <path d="M46 22L50 16L54 22" stroke={color} strokeWidth="2" />
        </svg>
      );

    case 'lotus':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Central Petal */}
          <path
            d="M50 20C44 34 43 54 50 72C57 54 56 34 50 20Z"
            stroke={color}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Left Inner Petal */}
          <path
            d="M48 26C38 38 33 54 44 72C35 62 34 46 48 26Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Right Inner Petal */}
          <path
            d="M52 26C62 38 67 54 56 72C65 62 66 46 52 26Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Left Outer Wing Petal */}
          <path
            d="M42 42C24 48 16 62 32 76C20 70 24 54 42 42Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Right Outer Wing Petal */}
          <path
            d="M58 42C76 48 84 62 68 76C80 70 76 54 58 42Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Calyx Base */}
          <path
            d="M30 76C42 82 58 82 70 76C64 80 56 83 50 83C44 83 36 80 30 76Z"
            fill={color}
          />
        </svg>
      );

    case 'peacock':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Royal Peacock Graceful Curve */}
          <path
            d="M62 20C60 17 56 16 54 18C52 20 53 24 55 26C58 29 60 34 58 38C55 44 48 48 42 54C34 62 30 72 32 82C38 82 46 80 52 74C60 66 66 54 68 44C70 34 67 25 62 20Z"
            stroke={color}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Beak & Eye */}
          <path d="M54 18L48 19" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="56" cy="20" r="1.5" fill={color} />
          {/* Crest feathers (Kalgi) */}
          <path d="M57 16L59 10M60 17L64 12M58 17L62 11" stroke={color} strokeWidth="1.5" />
          <circle cx="59" cy="10" r="1.2" fill={color} />
          <circle cx="64" cy="12" r="1.2" fill={color} />
          {/* Tail Plumes */}
          <path
            d="M32 78C24 74 20 62 22 52C23 48 26 44 32 40"
            stroke={color}
            strokeWidth="1.8"
            strokeDasharray="2 3"
          />
          <path
            d="M36 82C28 80 18 70 18 58C18 48 24 38 32 30"
            stroke={color}
            strokeWidth="1.8"
            strokeDasharray="2 3"
          />
          {/* Feather Eyes (Peacock Spots) */}
          <circle cx="26" cy="50" r="3" stroke={color} strokeWidth="1.5" />
          <circle cx="22" cy="62" r="3" stroke={color} strokeWidth="1.5" />
        </svg>
      );

    case 'doli':
      return (
        <svg
          width={size * 1.3}
          height={size}
          viewBox="0 0 130 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Palanquin carrying pole */}
          <path d="M10 50H120" stroke={color} strokeWidth="3" strokeLinecap="round" />
          {/* Pole ends decorative knobs */}
          <circle cx="10" cy="50" r="4" fill={color} />
          <circle cx="120" cy="50" r="4" fill={color} />
          {/* Dome of Doli */}
          <path
            d="M38 50C38 34 50 24 65 24C80 24 92 34 92 50"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Kalash on Doli crown */}
          <path d="M65 18V24M61 24H69" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="65" cy="16" r="2.5" fill={color} />
          {/* Main Cabin Frame */}
          <rect
            x="40"
            y="50"
            width="50"
            height="32"
            rx="4"
            stroke={color}
            strokeWidth="2.5"
          />
          {/* Curtains / Jali lattice */}
          <path
            d="M48 50V78M82 50V78M48 64H82"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          {/* Hanging tassels */}
          <path d="M42 82L42 90M52 82L52 88M65 82L65 91M78 82L78 88M88 82L88 90" stroke={color} strokeWidth="1.5" />
        </svg>
      );

    case 'paisley':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Ornate Indian Kalka / Paisley Motif */}
          <path
            d="M50 82C34 82 24 70 24 54C24 38 34 26 44 18C48 14 54 12 56 16C58 20 54 26 50 30C42 38 38 46 38 54C38 62 44 68 52 68C60 68 66 62 66 54C66 44 60 36 56 30"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="52" cy="54" r="5" stroke={color} strokeWidth="1.8" />
          <path
            d="M52 49V45M57 54H61M52 59V63M47 54H43"
            stroke={color}
            strokeWidth="1.5"
          />
          <path
            d="M26 58C28 66 34 74 44 76M28 46C30 38 36 30 44 24"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="1 3"
          />
        </svg>
      );

    case 'rings':
      return (
        <svg
          width={size * 1.2}
          height={size}
          viewBox="0 0 120 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Left Ring */}
          <circle cx="44" cy="55" r="24" stroke={color} strokeWidth="3" />
          {/* Right Ring */}
          <circle cx="76" cy="55" r="24" stroke={color} strokeWidth="3" />
          {/* Sparkling Solitaire Diamond */}
          <path
            d="M76 22L84 31H68L76 22Z"
            stroke={color}
            strokeWidth="2"
            fill={color}
            fillOpacity="0.3"
          />
          <path d="M76 14V20M66 18L70 22M86 18L82 22" stroke={color} strokeWidth="1.8" />
        </svg>
      );

    case 'monogram':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Royal Shield / Monogram Wreath */}
          <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="34" stroke={color} strokeWidth="1.2" />
          {/* Laurel Leaves left */}
          <path
            d="M26 52C24 44 26 36 32 30M24 58C23 66 28 72 34 76"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Laurel Leaves right */}
          <path
            d="M74 52C76 44 74 36 68 30M76 58C77 66 72 72 66 76"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Crown on top */}
          <path
            d="M42 22L50 14L58 22L54 26H46L42 22Z"
            stroke={color}
            strokeWidth="1.8"
            fill={color}
            fillOpacity="0.2"
          />
          {/* Interlocking initials silhouette */}
          <text
            x="50"
            y="56"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fontWeight="bold"
            fontFamily="serif"
            fill={color}
          >
            &amp;
          </text>
        </svg>
      );

    default:
      return null;
  }
};

