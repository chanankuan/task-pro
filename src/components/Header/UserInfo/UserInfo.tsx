import s from "./UserInfo.module.scss";

// TODO: replace with current user avatar
const avatarUrl =
  "https://res.cloudinary.com/devidwxqr/image/upload/v1736855612/task_pro/avatars/ijizjq6pmb5fx0uaj7l1.webp";

export function UserInfo() {
  return (
    <div className={s["user-info"]}>
      <span className={s["user-name"]}>Meow</span>
      <button>
        <img
          width={32}
          height={32}
          src={avatarUrl}
          alt="Ivetta"
          className={s["user-avatar"]}
        />
      </button>
    </div>
  );
}
