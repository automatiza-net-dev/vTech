import { Select } from "infinity-forge";

import { useLoadAllBusinessUsers } from "@/presentation";

export function SelectSeller() {
  const users = useLoadAllBusinessUsers();

  return (
    <Select
      name="sellerId"
      label="Vendedor"
      loading={users.isFetching}
      options={
        users.data?.map((user) => ({
          label: user.name,
          value: user.id,
        })) || []
      }
      onlyOneValue
    />
  );
}
