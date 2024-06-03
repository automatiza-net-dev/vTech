import { useState } from "react";
import { BadRequestError, useToast } from "infinity-forge";

import { RemoteChangeStatus } from "@/data";
import { container, patientTypes } from "@/container";
import { PermissionItem, useLoadAllScheduleStatuses } from "@/presentation";

import { ActionSchedule } from "../interface";

export function MissedSchedule({ event, onExecuteAction }: ActionSchedule) {
  const [loading, setLoading] = useState(false)

  const { toast } = useToast();
  const scheduleStatuses = useLoadAllScheduleStatuses();

  async function handleClick() {
    try {
      setLoading(true)

      const statusId =
        scheduleStatuses.data?.find((status) => status.type === "FAL")?.id || "";

      await container
        .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
        .change({
          scheduleId: event.event.id,
          statusId,
        });

      await onExecuteAction()

      toast.success("Ação efetuada com sucesso!", {
        autoClose: 4000,
        position: "top-right",
      });
    } catch(err) {
      if(err instanceof BadRequestError) {
        toast.error(err.error.message, {
          autoClose: 4000,
          position: "top-right",
        });
      }
    } finally {
      setLoading(false)
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
