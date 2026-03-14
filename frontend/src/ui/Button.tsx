import React from "react";
import "../style/ui.css";
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}
const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  style,
  disabled = false,
  type,
  onClick,
}) => {
  return (
    <button
      className={`btn ${className}`}
      style={style}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
