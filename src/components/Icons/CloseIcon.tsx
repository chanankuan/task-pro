import sprite from "../../assets/svg-sprites/sprite.svg";

export function CloseIcon() {
  return (
    <svg width={18} height={18}>
      <use href={`${sprite}#icon-close`} />
    </svg>
  );
}
