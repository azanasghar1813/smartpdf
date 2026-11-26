import React from 'react';

interface FlagIconProps {
  countryCode: string;
  className?: string;
  title?: string;
}

/**
 * High-definition vector SVG flag component.
 * Renders consistent, vibrant national flags across Windows, macOS, Linux, iOS, and Android
 * without relying on system emoji fonts (which do not render flags on Windows).
 */
export const FlagIcon: React.FC<FlagIconProps> = ({ countryCode, className = 'w-5 h-3.5', title }) => {
  const code = (countryCode || '').toUpperCase();

  switch (code) {
    // 🇺🇸 United States (English)
    case 'US':
      return (
        <svg
          viewBox="0 0 640 480"
          className={`inline-block overflow-hidden rounded-[2px] shadow-2xs border border-black/10 flex-shrink-0 ${className}`}
          role="img"
          aria-label={title || 'United States Flag'}
        >
          <g fillRule="evenodd">
            {/* 13 Stripes */}
            <path fill="#bd3d44" d="M0 0h640v480H0z" />
            <path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640" />
            {/* Canton */}
            <path fill="#192f5d" d="M0 0h260v258.5H0z" />
            {/* Stars pattern preview */}
            <g fill="#fff">
              <circle cx="26" cy="24" r="7" />
              <circle cx="78" cy="24" r="7" />
              <circle cx="130" cy="24" r="7" />
              <circle cx="182" cy="24" r="7" />
              <circle cx="234" cy="24" r="7" />
              <circle cx="52" cy="52" r="7" />
              <circle cx="104" cy="52" r="7" />
              <circle cx="156" cy="52" r="7" />
              <circle cx="208" cy="52" r="7" />
              <circle cx="26" cy="80" r="7" />
              <circle cx="78" cy="80" r="7" />
              <circle cx="130" cy="80" r="7" />
              <circle cx="182" cy="80" r="7" />
              <circle cx="234" cy="80" r="7" />
              <circle cx="52" cy="108" r="7" />
              <circle cx="104" cy="108" r="7" />
              <circle cx="156" cy="108" r="7" />
              <circle cx="208" cy="108" r="7" />
              <circle cx="26" cy="136" r="7" />
              <circle cx="78" cy="136" r="7" />
              <circle cx="130" cy="136" r="7" />
              <circle cx="182" cy="136" r="7" />
              <circle cx="234" cy="136" r="7" />
              <circle cx="52" cy="164" r="7" />
              <circle cx="104" cy="164" r="7" />
              <circle cx="156" cy="164" r="7" />
              <circle cx="208" cy="164" r="7" />
              <circle cx="26" cy="192" r="7" />
              <circle cx="78" cy="192" r="7" />
              <circle cx="130" cy="192" r="7" />
              <circle cx="182" cy="192" r="7" />
              <circle cx="234" cy="192" r="7" />
              <circle cx="52" cy="220" r="7" />
              <circle cx="104" cy="220" r="7" />
              <circle cx="156" cy="220" r="7" />
              <circle cx="208" cy="220" r="7" />
            </g>
          </g>
        </svg>
      );

    // 🇪🇸 Spain (Spanish)
    case 'ES':
      return (
        <svg
          viewBox="0 0 640 480"
          className={`inline-block overflow-hidden rounded-[2px] shadow-2xs border border-black/10 flex-shrink-0 ${className}`}
          role="img"
          aria-label={title || 'Spain Flag'}
        >
          <path fill="#c60b1e" d="M0 0h640v480H0z" />
          <path fill="#ffc400" d="M0 120h640v240H0z" />
          {/* Coat of arms silhouette */}
          <g transform="translate(140, 190)">
            <rect x="0" y="0" width="48" height="60" rx="6" fill="#c60b1e" />
            <rect x="8" y="8" width="32" height="44" rx="4" fill="#ffc400" />
            <circle cx="24" cy="30" r="6" fill="#c60b1e" />
            <rect x="-14" y="-8" width="6" height="76" rx="2" fill="#e5e7eb" />
            <rect x="56" y="-8" width="6" height="76" rx="2" fill="#e5e7eb" />
            <circle cx="-11" cy="-12" r="6" fill="#ffc400" />
            <circle cx="59" cy="-12" r="6" fill="#ffc400" />
          </g>
        </svg>
      );

    // 🇧🇷 Brazil (Portuguese)
    case 'BR':
    case 'PT':
      return (
        <svg
          viewBox="0 0 640 480"
          className={`inline-block overflow-hidden rounded-[2px] shadow-2xs border border-black/10 flex-shrink-0 ${className}`}
          role="img"
          aria-label={title || 'Brazil Flag'}
        >
          {/* Green field */}
          <path fill="#009b3a" d="M0 0h640v480H0z" />
          {/* Yellow Rhombus */}
          <path fill="#fedf00" d="M320 40L600 240L320 440L40 240z" />
          {/* Blue Disc */}
          <circle cx="320" cy="240" r="110" fill="#002776" />
          {/* Curved White Band (Ordem e Progresso) */}
          <path
            d="M215 250 C260 215, 380 215, 425 255 C390 230, 250 230, 215 250 Z"
            fill="#ffffff"
          />
          {/* Southern Cross constellation dots */}
          <g fill="#ffffff">
            <circle cx="320" cy="280" r="4.5" />
            <circle cx="310" cy="265" r="3.5" />
            <circle cx="335" cy="268" r="3.5" />
            <circle cx="322" cy="295" r="3" />
            <circle cx="340" cy="285" r="2.5" />
          </g>
        </svg>
      );

    // 🇩🇪 Germany (German)
    case 'DE':
      return (
        <svg
          viewBox="0 0 640 480"
          className={`inline-block overflow-hidden rounded-[2px] shadow-2xs border border-black/10 flex-shrink-0 ${className}`}
          role="img"
          aria-label={title || 'Germany Flag'}
        >
          <path fill="#000" d="M0 0h640v160H0z" />
          <path fill="#dd0000" d="M0 160h640v160H0z" />
          <path fill="#ffce00" d="M0 320h640v160H0z" />
        </svg>
      );

    // 🇫🇷 France (French)
    case 'FR':
      return (
        <svg
          viewBox="0 0 640 480"
          className={`inline-block overflow-hidden rounded-[2px] shadow-2xs border border-black/10 flex-shrink-0 ${className}`}
          role="img"
          aria-label={title || 'France Flag'}
        >
          <path fill="#0055a5" d="M0 0h213.3v480H0z" />
          <path fill="#fff" d="M213.3 0h213.4v480H213.3z" />
          <path fill="#ef4135" d="M426.7 0H640v480H426.7z" />
        </svg>
      );

    // 🇸🇦 Saudi Arabia (Arabic)
    case 'SA':
    case 'AR':
      return (
        <svg
          viewBox="0 0 640 480"
          className={`inline-block overflow-hidden rounded-[2px] shadow-2xs border border-black/10 flex-shrink-0 ${className}`}
          role="img"
          aria-label={title || 'Saudi Arabia Flag'}
        >
          <path fill="#006c35" d="M0 0h640v480H0z" />
          {/* Stylized Arabic calligraphy & sword */}
          <g fill="#ffffff">
            <path d="M160 210 Q320 180 480 210 Q320 195 160 210 Z" />
            <path d="M200 235 Q320 220 440 235 Q320 228 200 235 Z" />
            {/* Sword */}
            <path d="M170 300 H470 Q485 300 470 293 H200 L185 285 L180 300 L160 300 Q155 305 160 310 L180 310 L185 320 L200 307 H470 Q485 300 470 300 Z" />
          </g>
        </svg>
      );

    // 🇮🇳 India (Hindi)
    case 'IN':
      return (
        <svg
          viewBox="0 0 640 480"
          className={`inline-block overflow-hidden rounded-[2px] shadow-2xs border border-black/10 flex-shrink-0 ${className}`}
          role="img"
          aria-label={title || 'India Flag'}
        >
          {/* Saffron */}
          <path fill="#ff9933" d="M0 0h640v160H0z" />
          {/* White */}
          <path fill="#ffffff" d="M0 160h640v160H0z" />
          {/* Green */}
          <path fill="#128807" d="M0 320h640v160H0z" />
          {/* Ashoka Chakra */}
          <g transform="translate(320, 240)">
            <circle r="46" fill="none" stroke="#000080" strokeWidth="6" />
            <circle r="9" fill="#000080" />
            {/* 24 spokes wheel representation */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="-44"
                y1="0"
                x2="44"
                y2="0"
                stroke="#000080"
                strokeWidth="3"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>
        </svg>
      );

    // 🇵🇰 Pakistan (Urdu)
    case 'PK':
      return (
        <svg
          viewBox="0 0 640 480"
          className={`inline-block overflow-hidden rounded-[2px] shadow-2xs border border-black/10 flex-shrink-0 ${className}`}
          role="img"
          aria-label={title || 'Pakistan Flag'}
        >
          {/* White vertical hoist */}
          <path fill="#ffffff" d="M0 0h160v480H0z" />
          {/* Pakistan dark green fly */}
          <path fill="#01411c" d="M160 0h480v480H160z" />
          {/* Crescent Moon & Star */}
          <g transform="translate(400, 240) rotate(-40)">
            {/* Outer white crescent */}
            <circle cx="0" cy="0" r="95" fill="#ffffff" />
            {/* Inner green cutter to form the crescent */}
            <circle cx="28" cy="-12" r="88" fill="#01411c" />
            {/* 5-pointed star */}
            <polygon
              points="65,-40 76,-10 106,-10 82,8 91,38 65,20 40,38 49,8 24,-10 54,-10"
              fill="#ffffff"
            />
          </g>
        </svg>
      );

    // Default fallback: display sleek country code badge
    default:
      return (
        <span
          className={`inline-flex items-center justify-center font-mono font-bold text-[9px] uppercase bg-slate-200 text-slate-700 rounded-[2px] px-1 py-0.5 border border-slate-300 ${className}`}
          title={title || code}
        >
          {code || '??'}
        </span>
      );
  }
};
