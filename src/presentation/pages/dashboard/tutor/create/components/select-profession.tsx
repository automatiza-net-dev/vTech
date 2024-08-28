import { Select } from "infinity-forge";

import { useLoadAllProfessions } from "@/presentation";

export function SelectProfession({ origin }) {
  const { data, isFetching } = useLoadAllProfessions();

  const isRegister = origin === "Cadastro";

  return (
    <Select
      loading={isFetching}
      menuPlacement="bottom"
      name="professionId"
      label={isRegister ? "Profissão*" : "Profissão"}
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
