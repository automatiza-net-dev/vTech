import { useRouter } from "next/router";

import { Icon, FormHandler, Input, Textarea } from "infinity-forge";

import { Patient, Event } from "@/domain";
import { RemoteChangeStatus } from "@/data";
import { container, patientTypes } from "@/container";

import {
  DateToYYYYMMDD,
  PermissionItem,
  useLoadAllScheduleStatuses,
  useScheduling,
} from "@/presentation";
import { useState } from "react";
import moment from "moment";
import { useModalAuthorization } from "@/presentation/pages/dashboard/scheduling/components/schedule-user-calendar/components/calendar-event/sidebar-content/actions/components/modal-authorization";

export function StartService({
  patientId,
  event,
  onSuccess,
  buttonTitle,
}: {
  patientId: Patient["id"];
  event: any;
  onSuccess?: any;
  buttonTitle: string;
}) {
  const { push } = useRouter();

  const [showForm, setShowForm] = useState(false);
  const scheduleStatuses = useLoadAllScheduleStatuses();

  const selectedDate = useScheduling((state) => state.selectedDate);

  const dateFormatted = DateToYYYYMMDD(selectedDate || new Date());

  const { ModalAuthorization, executeVerification } = useModalAuthorization({
    event,
  });

  async function handleClick(data) {
    const statusId =
      scheduleStatuses.data?.find((status) => status.type === "ATEND")?.id ||
      "";

    const response = await container
      .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
      .change({
        scheduleId: event.event.id,
        statusId,
        userEmail: data.userEmail,
        userPwd: data.userPwd,
      });

    onSuccess && onSuccess();

    if (response.id) {
      push(
        `/dashboard/paciente/${patientId}?scheduleId=${event.event.id}&scheduleDate=${dateFormatted}`,
      );
    }
  }

  return (
    <PermissionItem hash="AGE07">
      {ModalAuthorization}

      <button
        className="reset-button orange start-attendance"
        type="button"
        onClick={() => setShowForm(true)}
      >
        <Icon name="PlayIcon" />
        <span>{buttonTitle}</span>
      </button>

      {showForm && (
        <FormHandler
          button={{ text: "Confirmar" }}
          onSucess={async (formData) =>
            executeVerification({ formData, handleSucess: handleClick })
          }
          initialData={{ contactDate: moment().format("YYYY-MM-DDTHH:mm") }}
        >
          <Input type="datetime-local" name="contactDate" />

          <Textarea name="observation" placeholder="Observação" />
        </FormHandler>
      )}
    </PermissionItem>
  );
}
