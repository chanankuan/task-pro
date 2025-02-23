export function StatusIcon({
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
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_87_220)">
        <path
          d="M2.22522 4.66665C3.37792 2.67398 5.5324 1.33331 8.00001 1.33331C11.6819 1.33331 14.6667 4.31808 14.6667 7.99998C14.6667 11.6819 11.6819 14.6666 8.00001 14.6666C5.5324 14.6666 3.37792 13.326 2.22522 11.3333"
          stroke={stroke}
          strokeOpacity="0.5"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 10.6666L10.6667 7.99998L8 5.33331"
          stroke={stroke}
          strokeOpacity="0.5"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.33337 8L10.6667 8"
          stroke={stroke}
          strokeOpacity="0.5"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_87_220">
          <rect width={size} height={size} fill={fill} />
        </clipPath>
      </defs>
    </svg>
  );
}
