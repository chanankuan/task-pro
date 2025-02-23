import boardIcons from "../../assets/svg-sprites/board-icons.svg";

export function BoardIcon({ id, selected }: { id: number; selected: boolean }) {
  return (
    <svg
      width={18}
      height={18}
      style={{
        stroke: selected ? "var(--primary-color)" : "var(--icon-primary-color)",
      }}
      // className={clsx(s["board-icon"], selected && s.selected)}
    >
      <use href={`${boardIcons}#icon-board-${id}`} />
    </svg>
  );
}
