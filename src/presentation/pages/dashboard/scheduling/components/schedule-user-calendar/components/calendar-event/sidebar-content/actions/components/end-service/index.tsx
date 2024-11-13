import { useToast, Icon } from "infinity-forge";

import { container, patientTypes } from "@/container";
import { RemoteChangeStatus, RemoteSchedule } from "@/data";
import { PermissionItem, useLoadAllScheduleStatuses } from "@/presentation";

import { ActionSchedule } from "../../interface";

export function EndService({ event, onExecuteAction }: ActionSchedule) {
  const { createToast } = useToast();
  const scheduleStatuses = useLoadAllScheduleStatuses();

  const attendances = event.event.attendances;

  async function handleClick() {
    const scheduleId = event.event.id;

    const statusId =
      scheduleStatuses.data?.find((status) => status.type === "FIN")?.id || "";

    await container
      .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
      .change({
        scheduleId,
        statusId,
      });

    if (attendances && attendances.length > 0) {
      const promises = attendances.map((attendance) =>
        container
          .get<RemoteSchedule>(patientTypes.RemoteSchedule)
          .close({ idAtendimento: attendance.id })
      );

      await Promise.all(promises);
    }

    onExecuteAction();

    createToast({ message: "informado com sucesso!", status: "success" });
  }

  return (
    <PermissionItem hash="AGE08">
      <button className="reset-button red" type="button" onClick={handleClick}>
        <Icon name="IconClose" color={"#fff"} />
        <span>Encerrar atendimento</span>
      </button>
    </PermissionItem>
  );
}
