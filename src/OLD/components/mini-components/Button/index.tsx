// @ts-nocheck
import React from "react";

export const Button = React.memo(function Button({
  theme = "primary",
  size,
  width,
  children,
  classCallback = "colorButton",
  type = "button",
  disabled = false,
  ...rest
}: any) {
  return (
    <button
      disabled={disabled}
      style={{
        background: process.env.client !== "liftone" ? "var(--orange)" : "var(--lo-blue)",
      }}
      type={type}
      {...rest}
      className={`
      custom-button
      uk-button uk-button-${theme} uk-border-pill
      ${size ? `uk-button-${size}` : ""}
      ${width ? `uk-width-${width}` : ""}
      ${classCallback}
    `}
    >
      {children}
    </button>
  );
});
