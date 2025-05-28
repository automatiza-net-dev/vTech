// @ts-nocheck
import { Popconfirm } from "antd";
import React from "react";
import { userService } from "@/OLD/services/user.service";
import { FiTrash2 } from "react-icons/fi";
import { clinicService } from "@/OLD/services/clinic.service";
import { useToast } from "infinity-forge";

export function Delete({ id, setRefreshList }) {

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
          <FiTrash2
            style={{ color: 'red', fontSize: '1.2rem', cursor: 'pointer' }}
            className="uk-margin-small-bottom"
          />
      </Popconfirm>
    </div>
  );
}
