import sprite from "../../assets/svg-sprites/sprite.svg";

export function HelpCircleIcon({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} className={className}>
      <use href={`${sprite}#icon-help-circle`} />
    </svg>
  );
}
