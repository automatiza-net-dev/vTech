// @ts-nocheck
import { notification, Popconfirm } from "antd";
import React from "react";
import { userService } from "@/OLD/services/user.service";
import { DeleteTwoTone } from "@ant-design/icons";
import { clinicService } from "@/OLD/services/clinic.service";

export const Delete = React.memo(function Delete({ id, setRefreshList }) {
  const handleDelete = React.useCallback(() => {
    clinicService
      .deleteColaborator(id)
      .then((res) => {
        notification.success({
          message: "Sucesso",
          description: "Colaborador removido",
        });
        setRefreshList();
      })
      .catch(() => {
        notification.success({
          message: "Erro",
          description: "Erro ao remover colaborador",
        });
      });
  }, [id]);

  return (
    <div>
      <Popconfirm
        title="Deseja realmete remover esse colaborador?"
        onConfirm={handleDelete}
        okText="Sim"
        cancelText="Não"
        placement="left"
      >
          <DeleteTwoTone
            twoToneColor="red"
            className="uk-margin-small-bottom"
          />
      </Popconfirm>
    </div>
  );
});
