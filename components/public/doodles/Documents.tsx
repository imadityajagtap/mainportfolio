interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hand-drawn Documents Doodle
 * Represents reports, analysis, and documentation
 */
export const Documents = ({ className, style }: DoodleProps) => (
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
    {/* Back document */}
    <rect x="25" y="25" width="45" height="55" rx="2" />

    {/* Lines on back document */}
    <line x1="30" y1="35" x2="60" y2="35" />
    <line x1="30" y1="42" x2="60" y2="42" />
    <line x1="30" y1="49" x2="55" y2="49" />

    {/* Middle document - slightly offset */}
    <rect x="30" y="30" width="45" height="55" rx="2" />

    {/* Lines on middle document */}
    <line x1="35" y1="40" x2="65" y2="40" />
    <line x1="35" y1="47" x2="65" y2="47" />
    <line x1="35" y1="54" x2="60" y2="54" />
    <line x1="35" y1="61" x2="65" y2="61" />

    {/* Front document with folded corner */}
    <path d="M 35 35 L 35 80 L 80 80 L 80 48 L 67 35 Z" />

    {/* Folded corner detail */}
    <path d="M 67 35 L 67 48 L 80 48" />

    {/* Lines on front document */}
    <line x1="40" y1="55" x2="70" y2="55" />
    <line x1="40" y1="62" x2="70" y2="62" />
    <line x1="40" y1="69" x2="65" y2="69" />

    {/* Small graph/chart on front document */}
    <path d="M 43 45 L 48 42 L 53 44 L 58 40" strokeWidth="1.5" />
  </svg>
);
