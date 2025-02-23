import sprite from "../../assets/svg-sprites/sprite.svg";

export function Logo() {
  return (
    <svg width={32} height={32} aria-hidden="true">
      <use href={`${sprite}#icon-logo`} />
    </svg>
  );
}
