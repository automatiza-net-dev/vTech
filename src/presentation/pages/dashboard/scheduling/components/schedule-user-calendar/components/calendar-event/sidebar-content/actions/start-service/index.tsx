import { useRouter } from "next/router";

import { Icon } from "infinity-forge";

import { RemoteChangeStatus } from "@/data";
import { container, patientTypes } from "@/container";
import { DateToYYYYMMDD, PermissionItem, useLoadAllScheduleStatuses, useScheduling } from "@/presentation";

import { ActionSchedule } from "../interface";

export function StartService({ event }: ActionSchedule) {
  const { push } = useRouter();

  const scheduleStatuses = useLoadAllScheduleStatuses();

  const selectedDate = useScheduling(state => state.selectedDate)

  const dateFormatted = DateToYYYYMMDD(selectedDate || new Date());

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
        `/dashboard/paciente/${event.event.patient.id}?scheduleId=${event.event.id}&scheduleDate=${dateFormatted}`
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
