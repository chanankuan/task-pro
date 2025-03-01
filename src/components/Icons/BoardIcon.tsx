import boardIcons from "../../assets/svg-sprites/board-icons.svg";

export function BoardIcon({
  id,
  size,
  className,
}: {
  id: number;
  size: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} className={className}>
      <use href={`${boardIcons}#icon-board-${id}`} />
    </svg>
  );
}
