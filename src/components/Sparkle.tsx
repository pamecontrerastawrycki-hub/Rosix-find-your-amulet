/**
 * Tiny four-point Y2K star. Pure inline SVG — no icon library, no requests.
 * Decorative only, so it is hidden from assistive tech.
 */

interface SparkleProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export function Sparkle({ size = 16, className = '', color, style }: SparkleProps) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 0c.7 6.4 4.9 10.6 12 12-7.1 1.4-11.3 5.6-12 12-.7-6.4-4.9-10.6-12-12C7.1 10.6 11.3 6.4 12 0Z"
        fill={color ?? 'currentColor'}
      />
    </svg>
  );
}
