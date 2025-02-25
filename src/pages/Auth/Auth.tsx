import React from "react";
import { NavLink, useLocation } from "react-router";
import s from "./Auth.module.scss";
import { AuthLayout, Container } from "../../layouts";
import { LoginForm, RegisterForm } from "../../components/Auth";

export function Auth() {
  const location = useLocation();
  const isLogin = location.pathname.includes("login");

  return (
    <React.Fragment>
      <title>{isLogin ? "Login - Task Pro" : "Register - Task Pro"}</title>

      <AuthLayout>
        <Container>
          <div className={s.wrapper}>
            <nav className={s.navbar}>
              <ul className={s["nav-list"]}>
                <li>
                  <NavLink
                    to="/auth/register"
                    end
                    className={({ isActive }) =>
                      isActive ? `${s["nav-link"]} ${s.active}` : s["nav-link"]
                    }
                  >
                    Registration
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/auth/login"
                    end
                    className={({ isActive }) =>
                      isActive ? `${s["nav-link"]} ${s.active}` : s["nav-link"]
                    }
                  >
                    Log In
                  </NavLink>
                </li>
              </ul>
            </nav>
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </Container>
      </AuthLayout>
    </React.Fragment>
  );
}
