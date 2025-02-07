import { useEffect } from "react";

import { useFormikContext } from "formik";
import { Select, useLoadCities } from "infinity-forge";

export function SelectCity() {
  const { values, setFieldValue } = useFormikContext<{ state: string }>();

  const uf = values?.state;

  const { data, isFetching } = useLoadCities({ uf });

  useEffect(() => {
    if (uf) {
      setFieldValue("city", "");
    }
  }, [uf]);

  return (
    <Select
      onlyOneValue
      name="city"
      label="Cidade"
      placeholder="Selecione a cidade"
      loading={isFetching}
      options={data?.options}
      disabled={!uf || !data}
    />
  );
}
