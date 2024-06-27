import { useState } from "react";

import { FormHandler, Textarea, useToast } from "infinity-forge";

import { RemoteSchedule } from "@/data";
import { PermissionItem } from "@/presentation";
import { container, patientTypes } from "@/container";

import { SelectReason } from "./select-reason";
import { SelectStatus } from "./select-status";

import { ActionSchedule } from "../../interface";

import * as S from "./styles";

export function ChangeUpsertStatusAction({
  event,
  onExecuteAction,
}: ActionSchedule) {
  const [showForm, setShowForm] = useState(false);

  const { createToast } = useToast();

  async function handleSuccess(data) {
    const payload = {
      ...data,
      scheduleId: event.event.id,
    }

    await container
      .get<RemoteSchedule>(patientTypes.RemoteSchedule)
      .changeUpsert(payload);

    await onExecuteAction(payload);

    createToast({ message: "Status alterado com sucesso!", status: "success" });
  }

  return (
    <PermissionItem hash="AGE15">
      <S.ChangeUpsertStatusAction>
        <button
          type="button"
          className="reset-button"
          onClick={() => setShowForm(state => !state)}
        >
          <span>Alterar status</span>
        </button>

        {showForm && (
          <FormHandler
            button={{ text: "Alterar Status" }}
            onSucess={handleSuccess}
          >
            <SelectReason />

            <SelectStatus />

            <Textarea name="observation" placeholder="Observação" />
          </FormHandler>
        )}
      </S.ChangeUpsertStatusAction>
    </PermissionItem>
  );
}
