import { useLoadTutorOrigins } from "@/presentation/hooks";
import { useFormikContext } from "formik";
import { Input, Select } from "infinity-forge";
import { useEffect, useState } from "react";

export function SelectOrigin() {
  const [showMidia, setShowMidia] = useState(false);
  const { data, isFetching } = useLoadTutorOrigins();

  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values && values["clientOriginId"]) {
      setShowMidia(true);
    }
  }, []);

  return (
    <div style={{ display: "flex", gap: 15 }}>
      <Select
        onlyOneValue
        menuPlacement="bottom"
        name="clientOriginId"
        label="Como conheceu a clínica?*"
        loading={isFetching}
        options={
          data?.map((origin) => ({
            label: origin.description,
            value: origin.id,
          })) || []
        }
        onChangeInput={(value) => {
          const originSelected = data?.find((origin) => origin.id === value);

          if (!originSelected?.default) {
            setFieldValue("default", "");
          }

          setShowMidia(originSelected?.default || false);
        }}
      />

      {showMidia && (
        <Input name="clientOriginItemDescription" label="Campanha/Midia" />
      )}
    </div>
  );
}
