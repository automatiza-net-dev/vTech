// @ts-nocheck
import { Popconfirm } from "antd";
import React from "react";
import { userService } from "@/OLD/services/user.service";
import { DeleteTwoTone } from "@ant-design/icons";
import { clinicService } from "@/OLD/services/clinic.service";
import { useToast } from "infinity-forge";

export const Delete = React.memo(function Delete({ id, setRefreshList }) {

  const {createToast} = useToast()

  const handleDelete = React.useCallback(() => {
    clinicService
      .deleteColaborator(id)
      .then((res) => {
        createToast({ status: "success", message: "Colaborador removido" })
       
        setRefreshList();
      })
      .catch(() => {
        createToast({ status: "success", message: "Erro ao remover colaborador"})
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
