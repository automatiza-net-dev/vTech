import { useToast, Icon } from "infinity-forge";

import { container, patientTypes } from "@/container";
import { RemoteSchedule } from "@/data";
import { PermissionItem } from "@/presentation";

import { ActionSchedule } from "../../interface";

export function DeleteSchedule({ event, onExecuteAction }: ActionSchedule) {
  const { createToast } = useToast();

  async function handleClick() {
    const scheduleId = event.event.id;

    await container.get<RemoteSchedule>(patientTypes.RemoteSchedule).delete({
      id: scheduleId,
    });

    onExecuteAction();

    createToast({
      message: "Agendamento removido com sucesso!",
      status: "success",
    });
  }

  return (
    <PermissionItem hash="AGE13">
      <button className="reset-button red" type="button" onClick={handleClick}>
        <Icon name="CloseIcon" fill={"#fff"} />
        <span>Remover agendamento</span>
      </button>
    </PermissionItem>
  );
}
