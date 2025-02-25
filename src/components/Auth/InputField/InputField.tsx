import React from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import s from "./InputField.module.scss";

type InputFieldProps<T extends FieldValues> = {
  type: React.HTMLInputTypeAttribute;
  name: Path<T>;
  register: UseFormRegister<T>;
  placeholder?: string;
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
  error?: FieldError;
};

export function InputField<T extends FieldValues>({
  type,
  name,
  register,
  placeholder,
  autoComplete,
  error,
}: InputFieldProps<T>) {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        className={s["input-field"]}
        autoComplete={autoComplete}
        {...register(name)}
      />
      {error && <p className={s["error-message"]}>{error.message}</p>}
    </>
  );
}
