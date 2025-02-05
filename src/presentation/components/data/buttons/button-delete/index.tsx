import { LoaderCircle, Icon } from "infinity-forge";

export function ButtonDelete(
  props: { isLoading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
      <button
        style={{ background: "transparent", border: 0 }}
        type="button"
        {...props}
      >
        {props.isLoading ? (
          <LoaderCircle size={12} color="#000" />
        ) : (
          <Icon name="IconDelete" color="#f10" />
        )}
      </button>
  );
}
