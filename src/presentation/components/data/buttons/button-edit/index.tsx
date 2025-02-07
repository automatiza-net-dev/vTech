import { ButtonHTMLAttributes } from "react";
import { Icon } from "infinity-forge";

export function ButtonEdit(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
    style={{ background: "transparent", border: 0 }}
    type="button"
    {...props}
  >
    <Icon name="IconEdit" color="#000" />
  </button>
  );
}
