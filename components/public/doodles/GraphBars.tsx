interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hand-drawn Bar Chart Doodle
 * Represents data visualization and analytics
 */
export const GraphBars = ({ className, style }: DoodleProps) => (
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
    {/* Axes - slightly wobbly */}
    <path d="M 15 85 L 15 15" />
    <path d="M 15 85 L 90 85" />

    {/* Bar 1 - shortest */}
    <rect x="22" y="65" width="10" height="20" />
    <path d="M 27 62 L 27 58" strokeDasharray="2,2" />

    {/* Bar 2 - medium */}
    <rect x="37" y="50" width="10" height="35" />
    <path d="M 42 47 L 42 43" strokeDasharray="2,2" />

    {/* Bar 3 - tall */}
    <rect x="52" y="35" width="10" height="50" />
    <path d="M 57 32 L 57 28" strokeDasharray="2,2" />

    {/* Bar 4 - tallest */}
    <rect x="67" y="25" width="10" height="60" />
    <path d="M 72 22 L 72 18" strokeDasharray="2,2" />

    {/* Axis labels (small marks) */}
    <line x1="12" y1="65" x2="15" y2="65" />
    <line x1="12" y1="45" x2="15" y2="45" />
    <line x1="12" y1="25" x2="15" y2="25" />
  </svg>
);
