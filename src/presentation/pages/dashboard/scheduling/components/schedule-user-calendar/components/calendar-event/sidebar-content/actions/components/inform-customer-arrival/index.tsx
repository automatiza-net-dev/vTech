import { Icon, useToast } from "infinity-forge";

import { RemoteChangeStatus } from "@/data";
import { container, patientTypes } from "@/container";
import {
  PermissionItem,
  useLoadAllScheduleStatuses,
} from "@/presentation";

import { ActionSchedule } from "../../interface";

import * as S from "./styles";
import { useModalAuthorization } from "../modal-authorization";

export function InformCustomerArrival({
  event,
  onExecuteAction,
}: ActionSchedule) {
  const { createToast} = useToast();
  const scheduleStatuses = useLoadAllScheduleStatuses();

    const { ModalAuthorization, executeVerification } = useModalAuthorization({ event })

  async function handleClick() {
    const statusId = scheduleStatuses.data?.find(
      (status) => status.type === "REC"
    )?.id || "";

    await container
      .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
      .change({
        scheduleId: event.event.id,
        statusId,
      });

      onExecuteAction && onExecuteAction();

    createToast({ message: "informado com sucesso!", status: "success" });
  }

  return (
    <PermissionItem hash="AGE06">
      <S.InformCustomerArrival>
        {ModalAuthorization}

        <button type="button" onClick={() => {
          executeVerification({ formData: {}, handleSucess: handleClick })
        }}>
          <Icon name="IconUser" />
          Informar chegada do cliente
        </button>
      </S.InformCustomerArrival>
    </PermissionItem>
  );
}
