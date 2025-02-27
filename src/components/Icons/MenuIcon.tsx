import sprite from "../../assets/svg-sprites/sprite.svg";

export function MenuIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" className={className}>
      <use href={`${sprite}#icon-menu`} />
    </svg>
  );
}
