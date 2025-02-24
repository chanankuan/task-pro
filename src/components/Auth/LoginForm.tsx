import { useState } from "react";
import s from "./Form.module.scss";
import EyeIcon from "../Icons/EyeIcon";
import EyeCrossedIcon from "../Icons/EyeCrossedIcon";

export function LoginForm() {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  function toggleIsPasswordShown() {
    setIsPasswordShown((prevIsPasswordShown) => !prevIsPasswordShown);
  }

  return (
    <form>
      <ul className={s.list}>
        <li>
          <input
            type="email"
            placeholder="Enter your email"
            className={s.input}
            autoComplete="email"
          />
        </li>
        <li>
          <div className={s["input-wrapper"]}>
            <input
              type={isPasswordShown ? "text" : "password"}
              placeholder="Create a password"
              className={s.input}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={toggleIsPasswordShown}
              className={s.icon}
            >
              {isPasswordShown ? (
                <EyeIcon size={18} stroke="#ffffff" />
              ) : (
                <EyeCrossedIcon size={18} stroke="#ffffff" />
              )}
            </button>
          </div>
        </li>
      </ul>

      <button type="submit" className={s["submit-button"]}>
        Log In Now
      </button>
    </form>
  );
}
