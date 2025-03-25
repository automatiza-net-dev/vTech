import { Select } from "infinity-forge";

import {
  useConfigurationsSystem,
  useLoadAllBusinessUsers,
} from "@/presentation";

export function SelectSeller({ userIsReviewer }: { userIsReviewer?: boolean }) {
  const users = useLoadAllBusinessUsers();

  const { type } = useConfigurationsSystem();

  return (
    <div className="row">
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

      {userIsReviewer && (
        <Select
          name="reviewerId"
          label="Avaliador"
          loading={users.isFetching}
          options={
            users.data?.map((user) => ({
              label: user.name,
              value: user.id,
            })) || []
          }
          onlyOneValue
        />
      )}
    </div>
  );
}
