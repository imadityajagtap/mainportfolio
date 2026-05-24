interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hand-drawn Target Doodle
 * Represents goals, objectives, and strategic targeting
 */
export const Target = ({ className, style }: DoodleProps) => (
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

    {/* Second circle */}
    <circle cx="50" cy="50" r="25" />

    {/* Third circle */}
    <circle cx="50" cy="50" r="15" />

    {/* Bullseye center */}
    <circle cx="50" cy="50" r="5" fill="currentColor" />

    {/* Arrow hitting the target */}
    <path d="M 85 20 L 55 45" />

    {/* Arrow head */}
    <path d="M 55 45 L 58 42" />
    <path d="M 55 45 L 58 48" />

    {/* Arrow tail feathers */}
    <path d="M 82 23 L 85 20 L 88 23" />
    <path d="M 82 17 L 85 20 L 82 23" />

    {/* Impact marks around bullseye */}
    <path d="M 42 50 L 38 50" />
    <path d="M 50 42 L 50 38" />
    <path d="M 58 50 L 62 50" />
  </svg>
);
