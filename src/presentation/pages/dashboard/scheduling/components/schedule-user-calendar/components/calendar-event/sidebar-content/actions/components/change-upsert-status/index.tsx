import { useState } from "react";

import { FormHandler, Textarea, useToast } from "infinity-forge";

import { RemoteSchedule } from "@/data";
import {
  PermissionItem,
  useLoadAllReasons,
  useLoadAllScheduleStatuses,
} from "@/presentation";
import { container, patientTypes } from "@/container";

import { SelectReason } from "./select-reason";
import { SelectStatus } from "./select-status";

import { ActionSchedule } from "../../interface";

import * as S from "./styles";
import { useModalAuthorization } from "../modal-authorization";

export function ChangeUpsertStatusAction({
  event,
  onExecuteAction,
}: ActionSchedule) {
  const [showForm, setShowForm] = useState(false);

  const { createToast } = useToast();

  const { ModalAuthorization, executeVerification } = useModalAuthorization({
    event,
  });

  async function handleSucess(data) {
    const payload = {
      ...data,
      scheduleId: event.event.id,
    };

    await container
      .get<RemoteSchedule>(patientTypes.RemoteSchedule)
      .changeUpsert(payload);

    onExecuteAction && (await onExecuteAction(payload));

    createToast({ message: "Status alterado com sucesso!", status: "success" });
  }

  const { data } = useLoadAllScheduleStatuses();

  return (
    <PermissionItem hash="AGE15">
      <S.ChangeUpsertStatusAction>
        {ModalAuthorization}

        <button
          type="button"
          className="reset-button"
          onClick={() => setShowForm((state) => !state)}
        >
          <span>Alterar status</span>
        </button>

        {showForm && (
          <FormHandler
            cleanFieldsOnSubmit={false}
            disableEnterKeySubmitForm
            button={{ text: "Alterar Status" }}
            onSucess={async (formData) => {
              const reason = data?.find(
                (item) => item.id === formData?.statusId
              )?.type;

              if (reason === "AC" || reason === "REC") {
                await executeVerification({ formData, handleSucess });
              } else {
                handleSucess(formData);
              }
            }}
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
