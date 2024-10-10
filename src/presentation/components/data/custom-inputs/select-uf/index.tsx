import { Select, useLoadStates } from "infinity-forge";

export function SelectUF() {
  const { data } = useLoadStates();

  return (
    <Select
      onlyOneValue
      name="state"
      label="UF"
      placeholder="UF"
      options={data || []}
    />
  );
}
