import { Select } from "infinity-forge";

import { useLoadAllHairs } from "@/presentation";

export function SelectHair() {
  const { data, isFetching } = useLoadAllHairs();

  return (
    <Select
      onlyOneValue
      name="hairId"
      loading={isFetching}
      label="Tipo de pelagem do paciente"
      options={
        data?.map((hair) => ({
          label: hair.description,
          value: hair.id,
        })) || []
      }
    />
  );
}
