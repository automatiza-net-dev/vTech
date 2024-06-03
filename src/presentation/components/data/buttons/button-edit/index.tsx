import { ButtonHTMLAttributes } from "react";
import { Tooltip, Icon } from "infinity-forge";

export function ButtonEdit(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Tooltip
      content="Editar"
      trigger={
        <button
          style={{ background: "transparent", border: 0 }}
          type="button"
          {...props}
        >
          <Icon name="IconEdit" fill="#000" />
        </button>
      }
      position="top-left"
    />
  );
}
