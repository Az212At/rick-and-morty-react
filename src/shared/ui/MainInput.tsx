import type { InputHTMLAttributes } from "react";

export default function MainInput({
  type = "text",
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={`main-input ${className}`.trim()}
      {...props}
    />
  );
}
