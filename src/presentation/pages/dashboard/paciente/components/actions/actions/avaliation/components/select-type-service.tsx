import { Select } from "infinity-forge";
import { useLoadAllScheduleServicesGroups } from "@/presentation";

export function SelectTypeService() {
  const { data, isFetching } = useLoadAllScheduleServicesGroups();

  const options = data?.reduce((reducer: any, result: any) => {
    return [
      ...reducer,
      {
        label: result.description,
        options: result.types.map((type) => ({
          value: type.id,
          label: type.description,
        })),
      },
    ];
  }, []);

  return (
    <Select
      isGroup
      name="scheduleServiceId"
      loading={isFetching}
      placeholder="Selecione o tipo de atendimento"
      options={options as any || []}
    />
  );
}
