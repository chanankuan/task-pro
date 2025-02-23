export function PlusIcon({
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
      viewBox="0 0 14 14"
      fill={fill}
      className={className}
    >
      <path
        d="M7 2.91669V11.0834"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.9165 7H11.0832"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
