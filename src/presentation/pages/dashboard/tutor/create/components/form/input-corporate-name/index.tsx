import { useFormikContext } from "formik";
import { Input } from "infinity-forge";

export function InputCorporateName(props: { errorMessage?: string }) {
  const { setFieldValue, initialValues } = useFormikContext<{
    name: string;
  }>();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      <Input
        onChangeInput={(value) => {
          if (!initialValues["name"]) {
            setFieldValue("name", value);
          }
        }}
        name="corporateName"
        label="Nome / Razão Social*"
        required
      />
      {props.errorMessage && <p>{props.errorMessage}</p>}
    </div>
  );
}
