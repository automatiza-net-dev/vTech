import { Select } from "infinity-forge";

import { useLoadAllProfessions } from "@/presentation";

export function SelectProfession() {
  const { data, isFetching } = useLoadAllProfessions();

  return (
    <Select
      loading={isFetching}
      menuPlacement="bottom"
      name="professionId"
      label="Profissão*"
      options={
        data?.map((profession) => ({
          label: profession?.description,
          value: profession?.id,
        })) || []
      }
      onlyOneValue
    />
  );
}
