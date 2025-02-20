// @ts-nocheck
import React from "react";

import { DeleteTwoTone } from "@ant-design/icons";

import {  Popconfirm } from "antd";
import { petsService } from "@/OLD/services/patient.service";
import { useToast } from "infinity-forge";

export const Delete = React.memo(function Delete({ id, setRefreshList }) {

  const {createToast} = useToast()

  const handleDelete = React.useCallback(() => {
    petsService
      .deletePatient(id)
      .then((res) => {
        createToast({ status: "success", message: "Paciente deletado!" })
     
        setRefreshList();
      })
      .catch((err) => {
        createToast({ status: "error", message: "Erro ao deletar o paciente!" })
      });
  }, [id]);

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir esse paciente?"
        onConfirm={() =>   createToast({ status: "warning", message:"verificar funcionalidade" })
     
        }
        okText="Sim"
        cancelText="Não"
        placement="left"
      >
          <DeleteTwoTone twoToneColor="red" />
      </Popconfirm>
    </div>
  );
});
