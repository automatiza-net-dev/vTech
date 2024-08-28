import FileCopyIcon from "@mui/icons-material/FileCopy";
import { Tooltip } from "antd";

import { LoaderCircle } from "infinity-forge";

export function ButtonCopy(
  props: { isLoading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <Tooltip title="Duplicar">
      <button
        style={{ background: "transparent", border: 0 }}
        type="button"
        {...props}
      >
        {props.isLoading ? (
          <LoaderCircle size={20} color="#000" />
        ) : (
          <FileCopyIcon
            fontSize="inherit"
            style={{ fontSize: 19 }}
            color="info"
          />
        )}
      </button>
    </Tooltip>
  );
}
