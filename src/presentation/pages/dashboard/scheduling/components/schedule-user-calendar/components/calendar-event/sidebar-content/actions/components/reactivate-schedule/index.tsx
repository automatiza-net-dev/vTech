import { useState } from "react";

import { FormHandler, Textarea, useToast } from "infinity-forge";

import { RemoteSchedule } from "@/data";
import { container, patientTypes } from "@/container";
import { PermissionItem, useLoadAllScheduleStatuses } from "@/presentation";

import { SelectReason } from "./select-reason";

import { ActionSchedule } from "../../interface";

import * as S from "./styles";

export function ReactivateSchedule({ event, onExecuteAction }: ActionSchedule) {
  const [showForm, setShowForm] = useState(false);

  const { createToast } = useToast();
  const scheduleStatuses = useLoadAllScheduleStatuses();

  async function handleSuccess(data) {
    const statusId =
      scheduleStatuses?.data?.find((status) => status.type === "AN")?.id || "";

    const payload = {
      ...data,
      statusId,
      id: event.event.id,
    };

    await container
      .get<RemoteSchedule>(patientTypes.RemoteSchedule)
      .reopen(payload);

    await onExecuteAction();

    createToast({ message: "Reativado com sucesso!", status: "success" });
  }

  return (
    <PermissionItem hash="AGE14">
      <S.ReactivateSchedule>
        <button
          type="button"
          className="reset-button"
          onClick={() => setShowForm(state => !state)}
        >
          <span>Reativar agendamento</span>
        </button>

        {showForm && (
          <FormHandler button={{ text: "Reativar" }} onSucess={handleSuccess}>
            <SelectReason />

            <Textarea name="observation" placeholder="Observação" />
          </FormHandler>
        )}
      </S.ReactivateSchedule>
    </PermissionItem>
  );
}
