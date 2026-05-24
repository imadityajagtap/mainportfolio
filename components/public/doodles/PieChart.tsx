interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hand-drawn Pie Chart Doodle
 * Represents market segmentation and data distribution
 */
export const PieChart = ({ className, style }: DoodleProps) => (
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
    {/* Outer circle - slightly imperfect */}
    <circle cx="50" cy="50" r="35" />

    {/* Slice 1 - line from center to top */}
    <line x1="50" y1="50" x2="50" y2="15" />

    {/* Slice 2 - line from center to top-right */}
    <line x1="50" y1="50" x2="75" y2="28" />

    {/* Slice 3 - line from center to right */}
    <line x1="50" y1="50" x2="85" y2="50" />

    {/* Slice 4 - line from center to bottom-right */}
    <line x1="50" y1="50" x2="70" y2="75" />

    {/* One slice slightly pulled out for emphasis */}
    <path d="M 52 16 Q 58 18, 62 22 L 54 48 Z" />

    {/* Percentage dots in slices */}
    <circle cx="60" cy="35" r="1.5" fill="currentColor" />
    <circle cx="65" cy="50" r="1.5" fill="currentColor" />
    <circle cx="58" cy="65" r="1.5" fill="currentColor" />
    <circle cx="35" cy="55" r="1.5" fill="currentColor" />
  </svg>
);
