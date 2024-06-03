import FileCopyIcon from "@mui/icons-material/FileCopy";

import { Tooltip, LoaderCircle } from "infinity-forge";

export function ButtonCopy(
  props: { isLoading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <Tooltip
      content="Duplicar"
      position="top-left"
      trigger={
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
      }
    />
  );
}
