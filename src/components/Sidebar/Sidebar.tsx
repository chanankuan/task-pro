// import { motion } from "motion/react";
import clsx from "clsx";
import s from "./Sidebar.module.scss";
import { Backdrop } from "./Backdrop/Backdrop";
import { PlusIconWrapper } from "../Icons/PlusIconWrapper";
import { BoardList } from "./BoardList/BoardList";
import { HelpCircleIcon, Logo, LogoutIcon, PlusIcon } from "../Icons";
// Images
import plant from "../../assets/images/sidebar/plant.png";
import plant2x from "../../assets/images/sidebar/plant@2x.png";

export function Sidebar({
  isActive,
  onCloseSidebar,
}: {
  isActive: boolean;
  onCloseSidebar: () => void;
}) {
  return (
    <>
      <div className={clsx(s.sidebar, isActive && s.active)}>
        <section className={s["sidebar--header-section"]}>
          <div className={s["sidebar--header-section--wrapper"]}>
            <Logo />
            <span>Task Pro</span>
          </div>
        </section>

        <section className={s["sidebar--board-section"]}>
          <div className={s["sidebar--boards-header"]}>
            <h2 className={s["sidebar--boards-header--title"]}>My boards</h2>
            <div className={s["create-board"]}>
              <h3>Create a new board</h3>
              <button onClick={() => console.log("Open modal")}>
                <PlusIconWrapper
                  w={40}
                  h={36}
                  color="var(--sb-icon-wrapper-bg-color)"
                >
                  <PlusIcon
                    size={20}
                    stroke="var(--plus-icon-fg-tertiary-color)"
                  />
                </PlusIconWrapper>
              </button>
            </div>
          </div>

          <div className={s["sidebar--board-list"]}>
            <BoardList />
          </div>
        </section>

        <section className={s["sidebar--help-section"]}>
          <div className={s["sidebar--help-section--wrapper"]}>
            <picture>
              <source srcSet={`${plant} 1x, ${plant2x} 2x`} />
              <img
                src="/src/assets/images/welcome/start-page-icon-mobile.png"
                alt="A picture of a plant"
                className={s["welcome-image"]}
              />
            </picture>
            <p className={s["sidebar--help-section--text"]}>
              If you need help with <span>TaskPro</span>, check out our support
              resources or reach out to our customer support team.
            </p>
            <button className={s["sidebar--help-section--need-help-button"]}>
              <HelpCircleIcon size={20} />
              <span>Need help?</span>
            </button>
          </div>
        </section>

        <section className={s["sidebar--footer-section"]}>
          <button
            className={s["sidebar--footer-section--logout-button"]}
            aria-label="Logout"
            onClick={() => console.log("Logout action")}
          >
            <LogoutIcon size={32} />
            Log out
          </button>
        </section>
      </div>
      <Backdrop isActive={isActive} onCloseModal={onCloseSidebar}></Backdrop>
    </>
  );
}
