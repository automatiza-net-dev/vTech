import { useState } from "react";
import { BadRequestError, useToast } from "infinity-forge";

import { RemoteChangeStatus } from "@/data";
import { container, patientTypes } from "@/container";
import { PermissionItem, useLoadAllScheduleStatuses } from "@/presentation";

import { ActionSchedule } from "../interface";

export function MissedSchedule({ event, onExecuteAction }: ActionSchedule) {
  const [loading, setLoading] = useState(false);

  const { createToast } = useToast();
  const scheduleStatuses = useLoadAllScheduleStatuses();

  async function handleClick() {
    try {
      setLoading(true);

      const statusId =
        scheduleStatuses.data?.find((status) => status.type === "FAL")?.id ||
        "";

      await container
        .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
        .change({
          scheduleId: event.event.id,
          statusId,
        });

      await onExecuteAction();

      createToast({ message: "Ação efetuada com sucesso!", status: "success" });
    } catch (err) {
      if (err instanceof BadRequestError) {
        createToast({ message: err.error.message, status: "error" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PermissionItem hash="AGE07">
      <button className="reset-button" type="button" onClick={handleClick}>
        <span>Não compareceu</span>
      </button>
    </PermissionItem>
  );
}
