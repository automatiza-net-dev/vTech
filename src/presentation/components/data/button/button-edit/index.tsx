import BorderColorIcon from "@mui/icons-material/BorderColor";
import { ButtonHTMLAttributes } from "react";
import { Popover } from "../../popover";

export function ButtonEdit(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Popover title="Editar" placement="topStart">
      <button
        style={{ background: "transparent", border: 0 }}
        type="button"
        {...props}
      >
        <BorderColorIcon
          fontSize="inherit"
          style={{ fontSize: 19 }}
          color="action"
        />
      </button>
    </Popover>
  );
}
