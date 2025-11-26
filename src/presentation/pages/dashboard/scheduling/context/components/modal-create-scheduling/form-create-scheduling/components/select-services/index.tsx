import { Select } from "infinity-forge";
import { useFormikContext } from "formik";

import {
  useScheduling,
  useLoadAllScheduleServicesGroups,
} from "@/presentation";
import { ServiceStages } from "./components";
import { useSelectService } from "./use-select-service";

import * as S from "./styles";

export function SelectServices() {
  const { initialValues } = useFormikContext<any>();

  const createSchedulingArgs = useScheduling(
    (state) => state.createSchedulingArgs,
  );
  const scheduleServiceItems = useLoadAllScheduleServicesGroups({
    patient: initialValues?.patientId?.[0],
    tutor: initialValues?.holderId?.[0],
  });
  const { setTimingService, options, hasServicesStage } = useSelectService({
    scheduleServiceItems: scheduleServiceItems?.data,
  });

  if (!scheduleServiceItems?.data) {
    return <></>;
  }

  return (
    <S.SelectServices>
      <Select
        isGroup
        disabled={createSchedulingArgs?.type === "reschedule"}
        label="Serviço"
        name="scheduleServiceTypeId"
        placeholder="Serviço"
        options={options || []}
        onChangeInput={(value) => {
          setTimingService(value as string[]);
        }}
      />

      {hasServicesStage && <ServiceStages />}
    </S.SelectServices>
  );
}
