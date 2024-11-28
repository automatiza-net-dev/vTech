import { useState } from "react";

import { LoadAllSchedullingToMovement } from "@/domain";

import moment from "moment";
import { useFormikContext } from "formik";
import { Select, useQueryClient } from "infinity-forge";

import {
  useLoadSchedulesToMovement,
  useLoadSchedulesToMovementKEY,
  useMe,
} from "@/presentation";

export function SelectSchedule() {
  const user = useMe();
  const { values } = useFormikContext<any>();
  const [filters, setFilters] = useState<LoadAllSchedullingToMovement.Params>({
    type: "bill",
    patientId: "",
    businessUnitId: "",
  });
  const schedules = useLoadSchedulesToMovement(filters);

  return (
    <>
      <div
        className="row"
        onClick={() =>
          setFilters({
            type: "bill",
            patientId:
              process.env.client === "sancla"
                ? values?.patientId
                : values?.clientId,
            businessUnitId: user.data.unit.id,
          })
        }
      >
        <Select
          name="scheduleId"
          label="Agendas disponíveis para vincular com a venda"
          onlyOneValue
          options={
            schedules?.data?.map((item) => ({
              label: `${item?.description} - ${moment(item?.start_hour).format(
                "DD/MM/YYYY - HH:mm"
              )})}`,
              value: item?.id,
            })) || [{ label: "", value: "" }]
          }
        />
      </div>
    </>
  );
}
