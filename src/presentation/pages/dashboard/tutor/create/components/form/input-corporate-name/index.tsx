import { useFormikContext } from "formik";
import { Input } from "infinity-forge";

export function InputCorporateName() {
  const { values, setFieldValue, initialValues } = useFormikContext<{ name: string }>();

  return (
    <Input
      onChangeInput={(value) => {
        if (!initialValues["name"]) {
          setFieldValue("name", value);
        }
      }}
      name="corporateName"
      label="Nome / Razão Social*"
    />
  );
}
