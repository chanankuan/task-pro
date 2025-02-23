import React from "react";

export function PlusIconWrapper({
  children,
  color,
  w = 28,
  h = 28,
}: {
  children: React.ReactNode;
  color: string;
  w?: number;
  h?: number;
}) {
  return (
    <span
      style={{
        width: w,
        height: h,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        backgroundColor: color,
      }}
    >
      {children}
    </span>
  );
}
