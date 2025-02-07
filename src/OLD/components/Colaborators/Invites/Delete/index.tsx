// @ts-nocheck
import { notification, Popconfirm } from "antd";
import React from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { clinicService } from "@/OLD/services/clinic.service";

export const Delete = React.memo(function Delete({ id, reload, setReload }) {
  const handleDelete = React.useCallback(() => {
    clinicService
      .deleteInvite(id)
      .then(() => {
        notification.success({
          message: "Sucesso",
          description: "Convite deletado",
        });
      })
      .catch((_err) => {
        notification.error({
          message: "Erro",
          description: "Falha ao excluir convite!",
        });
      })
      .finally(() => {
        setReload(!reload);
      });
  }, [id]);

  return (
    <Popconfirm
      title="Deseja realmete excluir esse convite?"
      onConfirm={handleDelete}
      okText="Sim"
      cancelText="Não"
      placement="left"
    >
        <DeleteTwoTone twoToneColor="red" />
    </Popconfirm>
  );
});
