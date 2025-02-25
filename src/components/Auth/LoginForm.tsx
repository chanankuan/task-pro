import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import s from "./Form.module.scss";
import EyeIcon from "../Icons/EyeIcon";
import EyeCrossedIcon from "../Icons/EyeCrossedIcon";
import { type LoginFormValues, loginSchema } from "../../schemas";
import { InputField } from "./InputField";

export function LoginForm() {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  function onSubmit(formData: LoginFormValues) {
    // TODO: use dispatch
    console.log(formData);

    // Clear the inputs after submit
    reset();
  }

  function toggleIsPasswordShown() {
    setIsPasswordShown((prevIsPasswordShown) => !prevIsPasswordShown);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ul className={s.list}>
        <li>
          <InputField
            type="email"
            name="email"
            placeholder="Enter you email"
            autoComplete="email"
            error={errors.email}
            register={register}
          />
        </li>
        <li>
          <div className={s["input-wrapper"]}>
            <InputField
              type={isPasswordShown ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              autoComplete="new-password"
              error={errors.password}
              register={register}
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
