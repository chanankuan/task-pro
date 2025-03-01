import s from "./BoardCard.module.scss";
import { BoardIcon, DeleteIcon, EditIcon } from "../../Icons";
import clsx from "clsx";
import { memo } from "react";

// TODO: delete
type Board = {
  id: number;
  title: string;
  iconId: number;
  bgName: string;
  filter: null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

function BoardCard({
  board,
  selected,
  onUpdateCurrent,
}: {
  board: Board;
  selected: boolean;
  onUpdateCurrent: (id: number) => void;
}) {
  return (
    <div
      className={clsx(s["board-card"], selected && s.selected)}
      onClick={() => onUpdateCurrent(board.id)}
    >
      <span>
        <BoardIcon id={board.iconId} size={18} />
      </span>
      <h3 className={s["board-card--title"]}>{board.title}</h3>

      <div className={s["board-card--action-buttons"]}>
        <button
          aria-label="Edit board"
          onClick={() => console.log("Open edit board modal")}
        >
          <EditIcon
            size={16}
            stroke="var(--sb-secondary-color)"
            className={s.icon}
          />
        </button>
        <button
          aria-label="Delete board"
          onClick={() => console.log("Delete board modal")}
        >
          <DeleteIcon
            size={16}
            stroke="var(--sb-secondary-color)"
            className={s.icon}
          />
        </button>
      </div>
    </div>
  );
}

export default memo(BoardCard);
