import React from "react";
import s from "./Container.module.scss";

export function Container({ children }: { children: React.ReactNode }) {
  return <div className={s.container}>{children}</div>;
}
