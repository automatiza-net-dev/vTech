import { useState } from "react";

import moment from "moment";
import { Icon, FormHandler, Input, Textarea, useToast } from "infinity-forge";

import { container, patientTypes } from "@/container";
import { RemoteChangeStatus, RemoteSchedule } from "@/data";
import { PermissionItem, useLoadAllScheduleStatuses } from "@/presentation";

import { ActionSchedule } from "../../interface";

import * as S from "./styles";
import { useModalAuthorization } from "../modal-authorization";

export function ConfirmSchedule({ event, onExecuteAction }: ActionSchedule) {
  const [showForm, setShowForm] = useState(false);

  const { createToast } = useToast();
  const scheduleStatuses = useLoadAllScheduleStatuses();

  const { ModalAuthorization, executeVerification } = useModalAuthorization({ event })

  async function handleSucess(data) {
    const statusNotConfirmedId = scheduleStatuses.data?.find(
      (status) => status.type === "AN"
    )?.id;
    const statusId =
      scheduleStatuses.data?.find((status) => status.type === "AC")?.id || "";

    const payload = {
      ...data,
      contactDate: moment(`${data.contactDate}`).format("YYYY-MM-DDTHH:mm:ssZ"),
      scheduleId: event.event.id,
      statusId: statusNotConfirmedId || "",
    };
    try {
      await container
        .get<RemoteSchedule>(patientTypes.RemoteSchedule)
        .confirm(payload);
      await container
        .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
        .change({
          scheduleId: event.event.id,
          statusId,
        });
      onExecuteAction && onExecuteAction();
      createToast({ message: "Agendamento confirmado!", status: "success" });
      setShowForm(false);
    } catch (e: any) {
      if (e?.error?.message) {
        createToast({ message: e.error.message, status: "success" });
      }
    }
  }

  return (
    <PermissionItem hash="AGE05">
      <S.ConfirmSchedule>
        {ModalAuthorization}

        <button
          className="reset-button"
          type="button"
          onClick={() => setShowForm((state) => !state)}
        >
          <Icon name="IconCalendar" />

          <span>Confirmar agendamento</span>
        </button>

        {showForm && (
          <FormHandler
            button={{ text: "Confirmar" }}
            onSucess={async (formData) => executeVerification({ formData, handleSucess })}
            initialData={{ contactDate: moment().format("YYYY-MM-DDTHH:mm") }}
          >
            <Input type="datetime-local" name="contactDate" />

            <Textarea name="observation" placeholder="Observação" />
          </FormHandler>
        )}
      </S.ConfirmSchedule>
    </PermissionItem>
  );
}
