import { Select } from "infinity-forge";

import { useLoadAllBusinessUsers } from "@/presentation";

export function SelectSeller({ userIsReviewer }: { userIsReviewer?: boolean }) {
  const users = useLoadAllBusinessUsers();

  return (
    <>
      {process.env.client !== "sancla" && (
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
      )}
    </>
  );
}
