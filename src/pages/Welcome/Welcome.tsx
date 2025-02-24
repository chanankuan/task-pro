import s from "./Welcome.module.scss";
import { Container } from "../../layouts";
import { Link } from "react-router";
import { AuthLayout } from "../../layouts";

export function Welcome() {
  return (
    <AuthLayout>
      <Container>
        <div className={s.wrapper}>
          <title>Welcome - Task Pro</title>

          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/src/assets/images/welcome/start-page-icon-mobile.png 1x, /src/assets/images/welcome/start-page-icon-mobile@2x.png 2x"
            />
            <source
              media="(min-width: 768px)"
              srcSet="/src/assets/images/welcome/start-page-icon-tablet.png 1x, /src/assets/images/welcome/start-page-icon-tablet@2x.png 2x"
            />
            <source
              media="(min-width: 1440px)"
              srcSet="/src/assets/images/welcome/start-page-icon-desktop.png 1x, /src/assets/images/welcome/start-page-icon-desktop@2x.png 2x"
            />
            <img
              src="/src/assets/images/welcome/start-page-icon-mobile.png"
              alt="Emoji of a male sitting behind his macbook"
              className={s["welcome-image"]}
            />
          </picture>

          <h1 className={s.title}>
            <img src="/public/logo.svg" alt="Company Logo" className={s.logo} />
            Task Pro
          </h1>
          <p className={s.description}>
            Supercharge your productivity and take control of your tasks with
            Task Pro - Don't wait, start achieving your goals now!
          </p>

          <Link to="/auth/register" className={s["register-btn"]}>
            Registration
          </Link>
          <Link to="/auth/login" className={s["login-btn"]}>
            Log In
          </Link>
        </div>
      </Container>
    </AuthLayout>
  );
}
