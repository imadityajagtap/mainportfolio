interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hand-drawn Upward Trend Arrow Doodle
 * Represents growth and positive performance
 */
export const TrendArrow = ({ className, style }: DoodleProps) => (
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
    {/* Wobbly upward trending line */}
    <path d="M 10 85 Q 18 78, 25 75 T 40 62 T 55 48 T 70 32 T 90 18" />

    {/* Arrow head */}
    <path d="M 90 18 L 82 24" />
    <path d="M 90 18 L 86 28" />

    {/* Dots along the trend line for emphasis */}
    <circle cx="25" cy="75" r="2" fill="currentColor" />
    <circle cx="40" cy="62" r="2" fill="currentColor" />
    <circle cx="55" cy="48" r="2" fill="currentColor" />
    <circle cx="70" cy="32" r="2" fill="currentColor" />
  </svg>
);
