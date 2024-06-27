import { Select } from "infinity-forge";
import { useLoadAllReasons } from "@/presentation";

export function SelectReason() {
  const { data, isFetching } = useLoadAllReasons("REATIVAR");

  const options = data?.map((reason) => ({
    label: reason.reason,
    value: reason.id,
  }));

  return (
    <Select
      name="reasonId"
      placeholder="Selecione o motivo"
      options={options || []}
      onlyOneValue
      loading={isFetching}
    />
  );
}
