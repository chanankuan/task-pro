import sprite from "../../assets/svg-sprites/sprite.svg";

export function LogoutIcon({
  size,
  className,
}: {
  size: number;

  className?: string;
}) {
  return (
    <svg width={size} height={size} className={className}>
      <use href={`${sprite}#icon-logout`} />
    </svg>
  );
}
