export function LogoutIcon({
  size,
  fill = "none",
  stroke = "none",
  className,
}: {
  size: number;
  fill?: string;
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill={fill}
      className={className}
    >
      <path
        d="M11.8667 10.08C12.28 5.28001 14.7467 3.32001 20.1467 3.32001H20.32C26.28 3.32001 28.6667 5.70667 28.6667 11.6667V20.36C28.6667 26.32 26.28 28.7067 20.32 28.7067H20.1467C14.7867 28.7067 12.32 26.7733 11.88 22.0533"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.66666 16H19.84"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.8667 11.5333L21.3333 16L16.8667 20.4667"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
