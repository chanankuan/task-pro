import sprite from "../../assets/svg-sprites/sprite.svg";

export function DefaultAvatar({ size }: { size: number }) {
  return (
    <svg width={size} height={size}>
      <use href={`${sprite}#icon-avatar-default`} />
    </svg>
  );
}
