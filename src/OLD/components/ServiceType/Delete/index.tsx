// @ts-nocheck
import React from "react";

import { FiTrash2 } from "react-icons/fi";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Popconfirm } from "antd";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { useToast } from "infinity-forge";

export const Delete = React.memo(function Delete({
  id,
  _setRefreshList,
  reload,
  setReload,
}) {
  const canDeleteTypeScheduleService = useUserHasPermission("ATS03");
  const { createToast } = useToast();

  const handleDelete = React.useCallback(() => {
    if (!canDeleteTypeScheduleService) {
      return createToast({ message: "Ação não permitida", status: "error" });
    }

    scheduleTypeServices
      .deleteSingleScheduleServiceGroup(id)
      .then((res) => {
        return createToast({
          message: "tipo de serviço deletado!",
          status: "success",
        });
      })
      .catch((err) => {
        return createToast({
          message: "Erro ao deletar o tipo de serviço!",
          status: "error",
        });
      })
      .finally(() => {
        setReload(!reload);
      });
  }, [id]);

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir esse tipo de serviço?"
        onConfirm={handleDelete}
        okText="Sim"
        cancelText="Não"
        placement="left"
      >
        {canDeleteTypeScheduleService && (
          <FiTrash2
            className="uk-link"
            style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'red' }}
          />
        )}
      </Popconfirm>
    </div>
  );
});
