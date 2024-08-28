import { Tooltip } from "antd";
import { LoaderCircle, Icon } from "infinity-forge";

export function ButtonDelete(
  props: { isLoading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <Tooltip title="Excluir">
      <button
        style={{ background: "transparent", border: 0 }}
        type="button"
        {...props}
      >
        {props.isLoading ? (
          <LoaderCircle size={12} color="#000" />
        ) : (
          <Icon name="IconDelete" fill="#f10" />
        )}
      </button>
    </Tooltip>
  );
}
