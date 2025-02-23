import React from "react";
import { useLocation } from "react-router";

export function Auth() {
  const location = useLocation();

  return (
    <React.Fragment>
      <title>
        {location.pathname.includes("login")
          ? "Login - Task Pro"
          : "Register - Task Pro"}
      </title>
      <h1>{location.pathname.includes("login") ? "Login" : "Register"}</h1>
    </React.Fragment>
  );
}
