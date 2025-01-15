import { useRouter } from "next/router";

import { Icon } from "infinity-forge";

import { Patient, Event } from "@/domain";
import { RemoteChangeStatus } from "@/data";
import { container, patientTypes } from "@/container";

import {
  DateToYYYYMMDD,
  PermissionItem,
  useLoadAllScheduleStatuses,
  useScheduling,
} from "@/presentation";

export function StartService({
  patientId,
  eventId,
  onSuccess,
}: {
  patientId: Patient["id"];
  eventId: Event["event"]["id"];
  onSuccess?: any;
}) {
  const { push } = useRouter();

  const scheduleStatuses = useLoadAllScheduleStatuses();

  const selectedDate = useScheduling((state) => state.selectedDate);

  const dateFormatted = DateToYYYYMMDD(selectedDate || new Date());

  async function handleClick() {
    const statusId =
      scheduleStatuses.data?.find((status) => status.type === "ATEND")?.id ||
      "";

    const response = await container
      .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
      .change({
        scheduleId: eventId,
        statusId,
      });

    onSuccess && onSuccess();

    if (response.id) {
      push(
        `/dashboard/paciente/${patientId}?scheduleId=${eventId}&scheduleDate=${dateFormatted}`
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
