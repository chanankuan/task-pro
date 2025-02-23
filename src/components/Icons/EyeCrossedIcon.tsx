export default function EyeCrossedIcon({
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
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      color="#000000"
      className={className}
    >
      <path d="M22 12C22 12 19 18 12 18C5 18 2 12 2 12C2 12 5 6 12 6C19 6 22 12 22 12Z" />{" "}
      <circle cx="12" cy="12" r="3" /> <path d="M3 21L20 4" />{" "}
    </svg>
  );
}
