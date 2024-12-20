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

  async function handleClick(ignoreConflict) {
    const scheduleId = event.event.id;

    try {
      await container.get<RemoteSchedule>(patientTypes.RemoteSchedule).delete({
        id: scheduleId,
        ignoreConflict,
      });

      onExecuteAction();

      setConfirmDelete(false);

      createToast({
        message: "Agendamento removido com sucesso!",
        status: "success",
      });
    } catch (err: any) {
      if (
        err?.error?.message
          .split(":")[1]
          .includes("Deseja excluir mesmo assim?")
      ) {
        if (window.confirm(err?.error?.message.split(":")[1])) {
          handleClick(true);
        }
      }

      if (
        err?.error?.message
          .split(":")[1]
          .includes("Este agendamento não pode ser excluído")
      ) {
        onExecuteAction();
        return createToast({
          message: err?.error?.message.split(":")[1],
          status: "error",
        });
      }
    }
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
            <Button text="REMOVER" onClick={() => handleClick(false)} />
            <Button text="CANCELAR" onClick={() => setConfirmDelete(false)} />
          </div>
        </S.ConfirmDelete>
      </Modal>
    </PermissionItem>
  );
}
