import { useState } from "react";
import { BadRequestError, LoaderCircle, useToast } from "infinity-forge";

import { RemoteChangeStatus } from "@/data";
import { container, patientTypes } from "@/container";
import { PermissionItem, useLoadAllScheduleStatuses } from "@/presentation";

import { ActionSchedule } from "../../interface";

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

      onExecuteAction && (await onExecuteAction());

      createToast({ message: "Ação efetuada com sucesso!", status: "success" });
    } catch (err) {
      if (err instanceof BadRequestError) {
        createToast({
          message: err?.error?.message || "Um erro inesperado aconteceu",
          status: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PermissionItem hash="AGE16">
      <button className="reset-button" type="button" onClick={handleClick}>
        {loading ? (
          <LoaderCircle size={20} color="#000" />
        ) : (
          <span>Não compareceu</span>
        )}
      </button>
    </PermissionItem>
  );
}
