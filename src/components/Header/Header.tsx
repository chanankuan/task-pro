import { useState } from "react";
import s from "./Header.module.scss";
import { AnimatePresence } from "framer-motion";
import { motion } from "motion/react";

import { Container } from "../../layouts";
import { MenuIcon } from "../Icons/MenuIcon";
import { ShevronIcon } from "../Icons";
import { ThemeModal } from "./ThemeModal/ThemeModal";
import { UserInfo } from "./UserInfo/UserInfo";

export function Header() {
  const [isModalShown, setIsModalShown] = useState(false);

  function toggleIsModalShown() {
    setIsModalShown((prevIsModalShown) => !prevIsModalShown);
  }

  return (
    <header className={s.header}>
      <Container>
        <div className={s.wrapper}>
          <button className={s["menu-button"]} aria-label="Open sidebar menu">
            <MenuIcon className={s["icon-menu"]} />
          </button>

          <div className={s["user-block"]}>
            <div style={{ position: "relative" }}>
              <button
                className={s["theme-button"]}
                aria-label="Change theme"
                onClick={toggleIsModalShown}
              >
                Theme{" "}
                <span>
                  <ShevronIcon
                    size={16}
                    stroke="var(--primary-color)"
                    rotate={isModalShown ? 180 : 0}
                  />
                </span>
              </button>

              <AnimatePresence>
                {isModalShown ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, y: 10, x: 20 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    key="modal"
                  >
                    <ThemeModal />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <UserInfo />
          </div>
        </div>
      </Container>
    </header>
  );
}
