import { Icon } from "semantic-ui-react";

import { useToast } from "infinity-forge";

import { RemoteChangeStatus, RemoteSchedule } from "@/data";
import { container, patientTypes } from "@/container";
import {
  PermissionItem,
  useLoadAllScheduleStatuses,
} from "@/presentation";

import { ActionSchedule } from "../interface";

export function EndService({ event, onExecuteAction }: ActionSchedule) {
  const { toast } = useToast();
  const scheduleStatuses = useLoadAllScheduleStatuses();

  async function handleClick() {
    const scheduleId = event.event.id;

    const statusId = scheduleStatuses.data?.find(
      (status) => status.type === "FIN"
    )?.id || "";

    await container
      .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
      .change({
        scheduleId: scheduleId,
        statusId,
      });

    await container
      .get<RemoteSchedule>(patientTypes.RemoteSchedule)
      .close({ idAtendimento: scheduleId });

    onExecuteAction();

    toast.success("informado com sucesso!", {
      autoClose: 4000,
      position: "top-right",
    });
  }

  return (
    <PermissionItem hash="AGE08">
      <button className="reset-button red" type="button" onClick={handleClick}>
        <Icon name="cancel" />
        <span>Encerrar atendimento</span>
      </button>
    </PermissionItem>
  );
}
