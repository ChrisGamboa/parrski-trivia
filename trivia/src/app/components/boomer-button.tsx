"use client";

type ButtonColor = "pink" | "lime" | "blue" | "yellow" | "orange" | "purple";

interface BoomerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
}

export function BoomerButton({
  color = "pink",
  className = "",
  children,
  ...props
}: BoomerButtonProps) {
  return (
    <button
      className={`boomer-btn boomer-btn--${color} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
