// @ts-nocheck
import { Popconfirm } from "antd";
import React from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { clinicService } from "@/OLD/services/clinic.service";
import { useToast } from "infinity-forge";

export const Delete = React.memo(function Delete({ id, reload, setReload }) {

  const {createToast} = useToast()

  const handleDelete = React.useCallback(() => {
    clinicService
      .deleteInvite(id)
      .then(() => {

        createToast({ status: "success", message: "Convite deletado" })

      })
      .catch((_err) => {
        createToast({ status: "error",  message:  "Falha ao excluir convite!"})
     
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
