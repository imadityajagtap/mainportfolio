interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hand-drawn Candlestick Chart Doodle
 * Represents financial analysis and market trends
 */
export const CandlestickChart = ({ className, style }: DoodleProps) => (
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
    {/* Base line */}
    <path d="M 10 90 L 92 90" />

    {/* Candlestick 1 - bearish */}
    <line x1="20" y1="35" x2="20" y2="20" />
    <rect x="15" y="35" width="10" height="25" />
    <line x1="20" y1="60" x2="20" y2="75" />

    {/* Candlestick 2 - bullish */}
    <line x1="35" y1="50" x2="35" y2="35" />
    <rect x="30" y="50" width="10" height="20" />
    <line x1="35" y1="70" x2="35" y2="80" />

    {/* Candlestick 3 - bullish */}
    <line x1="50" y1="40" x2="50" y2="25" />
    <rect x="45" y="40" width="10" height="28" />
    <line x1="50" y1="68" x2="50" y2="78" />

    {/* Candlestick 4 - bullish */}
    <line x1="65" y1="30" x2="65" y2="18" />
    <rect x="60" y="30" width="10" height="32" />
    <line x1="65" y1="62" x2="65" y2="72" />

    {/* Candlestick 5 - bullish */}
    <line x1="80" y1="22" x2="80" y2="12" />
    <rect x="75" y="22" width="10" height="35" />
    <line x1="80" y1="57" x2="80" y2="68" />
  </svg>
);
