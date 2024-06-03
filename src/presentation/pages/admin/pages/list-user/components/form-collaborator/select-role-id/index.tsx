import { useRolesControllers } from "@/presentation";
import { Select } from "infinity-forge";

export function SelectRole() {
  const { data, isFetching } = useRolesControllers();

  const formatOptions = data?.map((item) => ({
    label: item.name,
    value: String(item.id),
  }));

  return (
    <>
      <Select
        name="roleId"
        label="Role"
        onlyOneValue
        placeholder="Role"
        options={formatOptions || []}
        loading={isFetching}
      />
    </>
  );
}
