import { useState } from "react";
import { useToast, Icon, Modal, Button } from "infinity-forge";

import { RemoteSchedule } from "@/data";
import { PermissionItem } from "@/presentation";
import { container, patientTypes } from "@/container";

import { ActionSchedule } from "../../interface";

import * as S from "./styles";

export function DeleteSchedule({ event, onExecuteAction }: ActionSchedule) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { createToast } = useToast();

  async function handleClick() {
    const scheduleId = event.event.id;

    await container.get<RemoteSchedule>(patientTypes.RemoteSchedule).delete({
      id: scheduleId,
      ignoreConflict: false
    });

    onExecuteAction();

    setConfirmDelete(false);

    createToast({
      message: "Agendamento removido com sucesso!",
      status: "success",
    });
  }

  return (
    <PermissionItem hash="AGE13">
      <button
        className="reset-button red"
        type="button"
        onClick={() => setConfirmDelete(true)}
      >
        <Icon name="IconClose" color={"#fff"} />
        <span>Remover agendamento</span>
      </button>

      <Modal
        styles={{ borderRadius: 6 }}
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
      >
        <S.ConfirmDelete>
          <p className="font-16-regular uppercase">
            Deseja excluir o agendamento ?
          </p>

          <div className="actions">
            <Button text="REMOVER" onClick={handleClick} />
            <Button text="CANCELAR" onClick={() => setConfirmDelete(false)} />
          </div>
        </S.ConfirmDelete>
      </Modal>
    </PermissionItem>
  );
}
