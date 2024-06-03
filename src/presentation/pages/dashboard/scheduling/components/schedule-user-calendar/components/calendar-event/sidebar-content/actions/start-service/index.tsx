import { useRouter } from "next/router";

import { Icon } from "infinity-forge";

import { RemoteChangeStatus } from "@/data";
import { container, patientTypes } from "@/container";
import { PermissionItem, useLoadAllScheduleStatuses } from "@/presentation";

import { ActionSchedule } from "../interface";

export function StartService({ event }: ActionSchedule) {
  const { push } = useRouter();

  const scheduleStatuses = useLoadAllScheduleStatuses();

  async function handleClick() {
    const statusId = scheduleStatuses.data?.find(
      (status) => status.type === "ATEND"
    )?.id || "";

    const response = await container
      .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
      .change({
        scheduleId: event.event.id,
        statusId,
      });

    if (response.id) {
      push(
        `/dashboard/atendimento/${event.event.patient.id}/${event.event.id}`
      );
    }
  }

  return (
    <PermissionItem hash="AGE07">
      <button
        className="reset-button orange"
        type="button"
        onClick={handleClick}
      >
        <Icon name="PlayIcon" />
        <span>Dar ínicio ao atendimento</span>
      </button>
    </PermissionItem>
  );
}
