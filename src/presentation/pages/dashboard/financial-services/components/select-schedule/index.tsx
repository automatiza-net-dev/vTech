import { useState } from "react";

import moment from "moment";
import { Select, useAuthAdmin } from "infinity-forge";
import { useFormikContext } from "formik";

import { LoadAllSchedullingToMovement } from "@/domain";

import { useConfigurationsSystem, useLoadSchedulesToMovement } from "@/presentation";

export function SelectSchedule() {
  const { user } = useAuthAdmin();
  const { values } = useFormikContext<any>();
  const [filters, setFilters] = useState<LoadAllSchedullingToMovement.Params>({
    type: "bill",
    patientId: "",
    businessUnitId: "",
  });
  const schedules = useLoadSchedulesToMovement(filters);

  const { type } = useConfigurationsSystem()

  return (
    <>
      <div
        className="row"
        onClick={() =>
          setFilters({
            type: "bill",
            patientId:
            type === "Vet"
                ? values?.patientId
                : values?.clientId,
            businessUnitId: user.unit.id,
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
