export function DeleteIcon({
  size,
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
      <path
        d="M6 2H10"
        strokeOpacity="0.5"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 4H14"
        strokeOpacity="0.5"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33337 4L3.73396 10.0089C3.80834 11.1245 3.84553 11.6823 4.02783 12.1304C4.35882 12.9441 5.02976 13.5718 5.86361 13.8479C6.32289 14 6.88194 14 8.00004 14V14C9.11814 14 9.67719 14 10.1365 13.8479C10.9703 13.5718 11.6413 12.9441 11.9723 12.1304C12.1546 11.6823 12.1917 11.1245 12.2661 10.0089L12.6667 4"
        strokeOpacity="0.5"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
