import type { ButtonHTMLAttributes } from "react";

export default function MainButton({
  type = "button",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`main-button ${className}`.trim()}
      {...props}
    />
  );
}
