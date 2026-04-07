const BengaliPattern = ({ className = "", opacity = 0.04 }: { className?: string; opacity?: number }) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <defs>
      <pattern id="bengali-motif" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        {/* Nakshi Kantha inspired diamond */}
        <path
          d="M60 10 L80 30 L60 50 L40 30 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity={opacity}
        />
        {/* Inner diamond */}
        <path
          d="M60 20 L70 30 L60 40 L50 30 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity={opacity * 0.8}
        />
        {/* Center dot */}
        <circle cx="60" cy="30" r="2" fill="currentColor" opacity={opacity * 0.6} />

        {/* Corner petals - top left */}
        <path
          d="M10 10 Q20 0 30 10 Q20 20 10 10"
          fill="currentColor"
          opacity={opacity * 0.5}
        />
        {/* Corner petals - bottom right */}
        <path
          d="M90 90 Q100 80 110 90 Q100 100 90 90"
          fill="currentColor"
          opacity={opacity * 0.5}
        />

        {/* Paisley curves */}
        <path
          d="M5 60 Q15 45 30 55 Q20 65 5 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity={opacity * 0.7}
        />
        <path
          d="M90 60 Q100 45 115 55 Q105 65 90 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity={opacity * 0.7}
        />

        {/* Horizontal vine */}
        <path
          d="M0 90 Q30 80 60 90 Q90 100 120 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity={opacity * 0.4}
        />

        {/* Small dots decoration */}
        <circle cx="30" cy="70" r="1.2" fill="currentColor" opacity={opacity * 0.5} />
        <circle cx="90" cy="70" r="1.2" fill="currentColor" opacity={opacity * 0.5} />
        <circle cx="60" cy="100" r="1.2" fill="currentColor" opacity={opacity * 0.5} />

        {/* Lotus petal hints */}
        <path
          d="M55 105 Q60 95 65 105"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity={opacity * 0.6}
        />
        <path
          d="M50 108 Q60 96 70 108"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity={opacity * 0.4}
        />
      </pattern>

      {/* Animated gradient overlay for the pattern */}
      <linearGradient id="pattern-fade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(45, 55%, 50%)" stopOpacity="1" />
        <stop offset="50%" stopColor="hsl(235, 70%, 55%)" stopOpacity="0.6" />
        <stop offset="100%" stopColor="hsl(45, 55%, 50%)" stopOpacity="1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bengali-motif)" className="text-accent" />
  </svg>
);

export default BengaliPattern;
