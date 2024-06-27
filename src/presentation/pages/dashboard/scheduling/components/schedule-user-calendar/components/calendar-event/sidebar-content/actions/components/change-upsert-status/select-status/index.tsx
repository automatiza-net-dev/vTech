import { Select } from "infinity-forge";
import { useLoadAllScheduleStatuses } from "@/presentation";

export function SelectStatus() {
  const { data, isFetching } = useLoadAllScheduleStatuses();

  const options = data?.map((status) => ({
    label: status.description,
    value: status.id,
  }));

  return (
    <Select
      name="statusId"
      placeholder="Selecione o novo status"
      options={options || []}
      isGroup={false}
      isMultiple={false}
      loading={isFetching}
      onlyOneValue
    />
  );
}
