import s from "./Backdrop.module.scss";
import clsx from "clsx";

export function Backdrop({
  isActive,
  onCloseModal,
}: {
  isActive: boolean;
  onCloseModal: () => void;
}) {
  return (
    <div
      className={clsx(s["modal-backdrop"], isActive && s.active)}
      onClick={onCloseModal}
    ></div>
  );
}
