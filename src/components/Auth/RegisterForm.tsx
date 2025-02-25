import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import s from "./Form.module.scss";
import EyeIcon from "../Icons/EyeIcon";
import EyeCrossedIcon from "../Icons/EyeCrossedIcon";
import { type RegisterFormValues, registerSchema } from "../../schemas";
import { InputField } from "./InputField";

export function RegisterForm() {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  function onSubmit(formData: RegisterFormValues) {
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
            type="text"
            name="name"
            placeholder="Enter you name"
            autoComplete="name"
            error={errors.name}
            register={register}
          />
        </li>
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
        Register Now
      </button>
    </form>
  );
}
