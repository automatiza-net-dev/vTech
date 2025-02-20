// @ts-nocheck
import { Popconfirm } from "antd";
import React, { memo, useCallback } from "react";
import { userService } from "@/OLD/services/user.service";
import { DeleteTwoTone } from "@ant-design/icons";
import { useQueryClient } from "react-query";
import { useToast } from "infinity-forge";

export function Delete({ id, onDelete, reload, setReload }) {


  const {createToast}  = useToast()

  const handleDelete = useCallback(
    (selectedId) => {
      userService
        .deleteWorkingDay(selectedId)
        .then((res) => {
          createToast({ status: "success",  message:  "Escala deletada",})
          

          if (onDelete) onDelete();
        })
        .catch((err) => {

          createToast({ status: "error",  message:  "Erro ao deletar escala de trabalho",})
        })
        .finally(() => {
          setReload(!reload);
        });
    },
    [id]
  );

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir essa escala?"
        onConfirm={() => handleDelete(id)}
        okText="Sim"
        cancelText="Não"
        placement="left"
      >
          <DeleteTwoTone twoToneColor="red" />
      </Popconfirm>
    </div>
  );
}
