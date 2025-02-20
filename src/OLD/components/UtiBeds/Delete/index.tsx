// @ts-nocheck
// Core
import React, { memo, useCallback } from "react";

// Services
import { bedsService } from "@/OLD/services/beds.service";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";

// Components
import { Popconfirm } from "antd";
import { useToast } from "infinity-forge";

const RemoveBed = memo(function RemoveBed({ id, reload, setReload }) {
  const { createToast } = useToast();

  const removeBed = useCallback(() => {
    bedsService
      .removeBed(id)
      .then((res) => {
        return createToast({
          status: "success",
          message: "Leito removido com sucesso!",
        });
      })
      .catch((err) => {
        return createToast({
          status: "error",
          message: `${err.response.data.errors[0].message}`,
        });
      })
      .finally(() => {
        setReload(!reload);
      });
  }, [id]);

  return (
    <Popconfirm
      title="Deseja realmete excluir esse leito?"
      onConfirm={() => removeBed()}
      okText="Sim"
      cancelText="Não"
      placement="left"
    >
      <DeleteTwoTone twoToneColor="red" />
    </Popconfirm>
  );
});

export default RemoveBed;
