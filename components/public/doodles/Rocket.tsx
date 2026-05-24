interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hand-drawn Rocket Doodle
 * Represents growth, launch, and scaling
 */
export const Rocket = ({ className, style }: DoodleProps) => (
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
    {/* Rocket body - slightly wobbly */}
    <path d="M 50 20 Q 45 25, 45 35 L 45 65 L 55 65 L 55 35 Q 55 25, 50 20" />

    {/* Nose cone */}
    <path d="M 45 35 Q 50 15, 55 35" />

    {/* Window */}
    <circle cx="50" cy="45" r="5" />

    {/* Left fin */}
    <path d="M 45 55 L 35 70 L 45 65 Z" />

    {/* Right fin */}
    <path d="M 55 55 L 65 70 L 55 65 Z" />

    {/* Flames/exhaust - wavy lines */}
    <path d="M 47 65 Q 45 72, 43 80" />
    <path d="M 50 65 Q 50 75, 50 85" />
    <path d="M 53 65 Q 55 72, 57 80" />

    {/* Stars around rocket */}
    <path d="M 20 30 L 22 32 M 22 30 L 20 32" />
    <path d="M 75 25 L 77 27 M 77 25 L 75 27" />
    <path d="M 70 50 L 72 52 M 72 50 L 70 52" />

    {/* Speed lines */}
    <path d="M 25 40 L 35 40" strokeDasharray="3,3" />
    <path d="M 30 50 L 38 50" strokeDasharray="3,3" />
  </svg>
);
