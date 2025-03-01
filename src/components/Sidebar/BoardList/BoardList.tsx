import s from "./BoardList.module.scss";
import BoardCard from "../BoardCard/BoardCard";
import { useCallback, useState } from "react";

// TODO: delete
const boards = [
  {
    id: 1,
    title: "Project office",
    iconId: 1,
    bgName: "bg-13",
    filter: null,
    createdAt: "2025-01-14T08:40:30.723Z",
    updatedAt: "2025-01-14T08:40:30.723Z",
    deletedAt: null,
  },
  {
    id: 2,
    title: "Project office",
    iconId: 3,
    bgName: "bg-13",
    filter: null,
    createdAt: "2025-01-14T08:40:30.723Z",
    updatedAt: "2025-01-14T08:40:30.723Z",
    deletedAt: null,
  },
  {
    id: 3,
    title: "Project office",
    iconId: 8,
    bgName: "bg-13",
    filter: null,
    createdAt: "2025-01-14T08:40:30.723Z",
    updatedAt: "2025-01-14T08:40:30.723Z",
    deletedAt: null,
  },
  {
    id: 9,
    title: "CS50’s Introduction to Computer Science",
    iconId: 5,
    bgName: "bg-13",
    filter: null,
    createdAt: "2025-01-14T08:40:30.723Z",
    updatedAt: "2025-01-14T08:40:30.723Z",
    deletedAt: null,
  },
];

export function BoardList() {
  const [currentId, setCurrentId] = useState(boards[0].id);

  const handleUpdateCurrent = useCallback((id: number) => {
    setCurrentId(id);
  }, []);

  return (
    <ul className={s["board-list"]}>
      {boards.map((board) => {
        return (
          <li key={board.id}>
            <BoardCard
              board={board}
              selected={board.id === currentId}
              onUpdateCurrent={handleUpdateCurrent}
            />
          </li>
        );
      })}
    </ul>
  );
}
