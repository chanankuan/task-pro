import { useState } from "react";
import s from "./ThemeModal.module.scss";
import clsx from "clsx";

// TODO: delete
enum Theme {
  LIGHT = "light",
  DARK = "dark",
  VIOLET = "violet",
}

export function ThemeModal() {
  // TODO: get current theme from redux store
  const [current, setCurrent] = useState(Theme.LIGHT);

  document.documentElement.setAttribute("data-theme", current);

  function handleChangeTheme(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrent(e.target.value as Theme);
  }

  return (
    <div className={s.modal}>
      <ul>
        <li>
          <input
            type="radio"
            name="theme"
            id={Theme.LIGHT}
            value={Theme.LIGHT}
            checked={current === Theme.LIGHT}
            onChange={handleChangeTheme}
            className={clsx("visually-hidden", s["theme-input"])}
          />
          <label htmlFor={Theme.LIGHT} className={s["theme-label"]}>
            {Theme.LIGHT}
          </label>
        </li>
        <li>
          <input
            type="radio"
            name="theme"
            id={Theme.DARK}
            value={Theme.DARK}
            checked={current === Theme.DARK}
            onChange={handleChangeTheme}
            className={clsx("visually-hidden", s["theme-input"])}
          />
          <label htmlFor={Theme.DARK} className={s["theme-label"]}>
            {Theme.DARK}
          </label>
        </li>
        <li>
          <input
            type="radio"
            name="theme"
            id={Theme.VIOLET}
            value={Theme.VIOLET}
            checked={current === Theme.VIOLET}
            onChange={handleChangeTheme}
            className={clsx("visually-hidden", s["theme-input"])}
          />
          <label htmlFor={Theme.VIOLET} className={s["theme-label"]}>
            {Theme.VIOLET}
          </label>
        </li>
      </ul>
    </div>
  );
}
