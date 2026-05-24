interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hand-drawn Light Bulb Doodle
 * Represents ideas, innovation, and insights
 */
export const LightBulb = ({ className, style }: DoodleProps) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Bulb shape - slightly imperfect circle */}
    <path d="M 50 20 Q 35 20, 30 35 Q 28 45, 32 55 L 38 65 L 62 65 L 68 55 Q 72 45, 70 35 Q 65 20, 50 20" />

    {/* Filament lines inside */}
    <path d="M 45 35 Q 50 40, 55 35" />
    <path d="M 42 45 Q 50 50, 58 45" />

    {/* Base of bulb */}
    <rect x="42" y="65" width="16" height="8" rx="1" />
    <rect x="44" y="73" width="12" height="6" rx="1" />

    {/* Light rays - hand-drawn style */}
    <path d="M 50 10 L 50 18" />
    <path d="M 70 18 L 64 24" />
    <path d="M 82 35 L 74 38" />
    <path d="M 30 18 L 36 24" />
    <path d="M 18 35 L 26 38" />
  </svg>
);
