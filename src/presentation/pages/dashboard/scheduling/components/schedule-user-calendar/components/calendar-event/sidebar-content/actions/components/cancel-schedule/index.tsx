import { useState } from "react";

import { FormHandler, Textarea, useToast } from "infinity-forge";

import { RemoteChangeStatus } from "@/data";
import { container, patientTypes } from "@/container";
import { PermissionItem, useLoadAllScheduleStatuses } from "@/presentation";

import { SelectReason } from "./select-reason";
import { ActionSchedule } from "../../interface";

import * as S from "./styles";

export function CancelSchedule({ event, onExecuteAction }: ActionSchedule) {
  const [showForm, setShowForm] = useState(false);
  const [disableObservation, setDisableObservation] = useState(false);

  const { createToast } = useToast();
  const scheduleStatuses = useLoadAllScheduleStatuses();

  async function handleSuccess(data, handlers) {
    if (!data.reasonId) {
      handlers.setFieldError("reasonId", "Por favor selecione o motivo");
      return;
    }

    const statusId =
      scheduleStatuses?.data?.find((status) => status.type === "CANC")?.id ||
      "";

    const payload = {
      statusId,
      scheduleId: event.event.id,
      reasonId: data.reasonId,
      observation: data.observation,
    };

    await container
      .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
      .change(payload);

    createToast({ message: "Cancelado com sucesso!", status: "success" });

    onExecuteAction();
  }

  return (
    <PermissionItem hash="AGE03">
      <S.CancelSchedule>
        <button
          type="button"
          className="reset-button"
          onClick={() => setShowForm(state => !state)}
        >
          <span>Cancelar agendamento</span>
        </button>

        {showForm && (
          <FormHandler button={{ text: "Cancelar" }} onSucess={handleSuccess}>
            <SelectReason setDisableObservation={setDisableObservation} />

            <Textarea name="observation" placeholder="Observação" />
          </FormHandler>
        )}
      </S.CancelSchedule>
    </PermissionItem>
  );
}
