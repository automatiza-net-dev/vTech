import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress as MuiCircularProgress } from "@mui/material";

import { Popover } from "../../popover";

export function ButtonDelete(
  props: { isLoading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <Popover title="Excluir" placement="topEnd">
      <button
        style={{ background: "transparent", border: 0 }}
        type="button"
        {...props}
      >
        {props.isLoading ? (
          <MuiCircularProgress size={12} color="info" />
        ) : (
          <DeleteIcon
            fontSize="inherit"
            style={{ fontSize: 19 }}
            color="error"
          />
        )}
      </button>
    </Popover>
  );
}
