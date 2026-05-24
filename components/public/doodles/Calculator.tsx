interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hand-drawn Calculator Doodle
 * Represents financial calculations and analysis
 */
export const Calculator = ({ className, style }: DoodleProps) => (
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
    {/* Calculator body - slightly wonky rectangle */}
    <rect x="25" y="15" width="50" height="70" rx="4" />

    {/* Screen */}
    <rect x="30" y="22" width="40" height="15" rx="2" />

    {/* Display numbers */}
    <path d="M 33 28 L 38 28 M 35.5 28 L 35.5 33" />
    <path d="M 42 28 L 47 28 L 47 33 L 42 33 L 42 28" />

    {/* Button rows - imperfect grid */}
    <circle cx="35" cy="50" r="3" />
    <circle cx="50" cy="50" r="3" />
    <circle cx="65" cy="50" r="3" />

    <circle cx="35" cy="62" r="3" />
    <circle cx="50" cy="62" r="3" />
    <circle cx="65" cy="62" r="3" />

    <circle cx="35" cy="74" r="3" />
    <circle cx="50" cy="74" r="3" />
    <circle cx="65" cy="74" r="3" />

    {/* Plus sign on one button */}
    <path d="M 63 50 L 67 50 M 65 48 L 65 52" />

    {/* Equals sign on another button */}
    <path d="M 48 72 L 52 72 M 48 76 L 52 76" />
  </svg>
);
