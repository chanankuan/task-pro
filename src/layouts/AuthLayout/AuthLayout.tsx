import React from "react";
import s from "./AuthLayout.module.scss";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className={s["main-bg"]}>{children}</div>;
}
