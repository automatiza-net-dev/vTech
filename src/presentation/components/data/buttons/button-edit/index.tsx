import { ButtonHTMLAttributes } from "react";
import { Icon } from "infinity-forge";
import { Tooltip } from "antd";

export function ButtonEdit(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Tooltip
      title="Editar"
      children={
        <button
          style={{ background: "transparent", border: 0 }}
          type="button"
          {...props}
        >
          <Icon name="IconEdit" fill="#000" />
        </button>
      }
    />
  );
}
