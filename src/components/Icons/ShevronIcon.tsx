export function ShevronIcon({
  size,
  fill = "none",
  stroke = "none",
  rotate = 0,
  className,
}: {
  size: number;
  fill?: string;
  stroke?: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 17"
      fill={fill}
      className={className}
      transform={`rotate(${rotate})`}
    >
      <path
        d="M4 6.5L8 10.5L12 6.5"
        stroke={stroke}
        strokeOpacity="0.8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
