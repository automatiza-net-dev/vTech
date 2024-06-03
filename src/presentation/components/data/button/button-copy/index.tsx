import FileCopyIcon from '@mui/icons-material/FileCopy';
import { CircularProgress as MuiCircularProgress } from "@mui/material";

import { Popover } from "../../popover";

export function ButtonCopy(
  props: { isLoading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <Popover title="Duplicar" placement="topEnd">
      <button
        style={{ background: "transparent", border: 0 }}
        type="button"
        {...props}
      >
        {props.isLoading ? (
          <MuiCircularProgress size={12} color="info" />
        ) : (
          <FileCopyIcon
            fontSize="inherit"
            style={{ fontSize: 19 }}
            color="info"
          />
        )}
      </button>
    </Popover>
  );
}
