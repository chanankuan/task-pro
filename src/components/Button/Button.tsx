import React from "react";
import s from "./Button.module.scss";
import clsx from "clsx";

export function Button({
  children,
  action,
  primary = false,
  secondary = false,
  small = false,
}: {
  children: React.ReactNode;
  action: () => void;
  primary?: boolean;
  secondary?: boolean;
  small?: boolean;
}) {
  return (
    <button
      onClick={action}
      className={clsx(s.button, {
        [s.small]: small,
        [s.primary]: primary,
        [s.secondary]: secondary,
      })}
    >
      {children}
    </button>
  );
}
