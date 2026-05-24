interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hand-drawn Briefcase Doodle
 * Represents business, work, and professional experience
 */
export const Briefcase = ({ className, style }: DoodleProps) => (
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
    {/* Main briefcase body - slightly wobbly */}
    <rect x="20" y="40" width="60" height="35" rx="3" />

    {/* Top flap/handle area */}
    <path d="M 35 40 L 35 30 Q 35 25, 40 25 L 60 25 Q 65 25, 65 30 L 65 40" />

    {/* Handle */}
    <path d="M 40 35 Q 50 28, 60 35" />

    {/* Lock/clasp in center */}
    <rect x="48" y="50" width="4" height="8" rx="1" />

    {/* Corner details - slightly imperfect lines */}
    <path d="M 25 45 L 30 45" />
    <path d="M 70 45 L 75 45" />
    <path d="M 25 70 L 30 70" />
    <path d="M 70 70 L 75 70" />

    {/* Side panels */}
    <line x1="35" y1="40" x2="35" y2="75" />
    <line x1="65" y1="40" x2="65" y2="75" />

    {/* Bottom feet */}
    <line x1="25" y1="75" x2="25" y2="78" />
    <line x1="75" y1="75" x2="75" y2="78" />
  </svg>
);
