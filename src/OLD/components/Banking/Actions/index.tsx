// @ts-nocheck
// Core
import React, { memo, useState, useCallback } from "react";

// Hooks
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

//Icons
import { FiEdit2, FiTrash2 } from "react-icons/fi";

// Components
import { Container } from "./styles";
import { Modal, Popconfirm } from "antd";
import Update from "../Update";
import { bankingService } from "@/OLD/services/banking.service";
import { useToast } from "infinity-forge";

const Actions = memo(function Actions({ banking, reload, setReload }) {
  const [updateVisible, setUpdateVisible] = useState(false);

  const canEditBanking = useUserHasPermission("BAN02");
  const canDeleteBanking = useUserHasPermission("BAN03");
  const { createToast } = useToast();

  const handleDelete = useCallback(() => {
    if (!canEditBanking) {
      return createToast({ message: "Ação não permitida", status: "error" });
    }

    bankingService
      .deleteBanking(banking.id)
      .then((_res) => {
        createToast({
          message: "Conta bancária removida com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        createToast({
          message:
            err.response.data?.message ??
            "Houve um erro ao remover a conta bancária...",
          status: "error",
        });
      })
      .finally(() => {
        setReload(!reload);
      });
  }, [banking?.id]);

  return (
    <Container>
      {canEditBanking && (
        <FiEdit2
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
          onClick={() => setUpdateVisible(true)}
        />
      )}
      {canDeleteBanking && (
        <Popconfirm
          title="Deseja remover este lançamento bancário?"
          onConfirm={handleDelete}
          okText="Sim"
          cancelText="Não"
          placement="left"
        >
          <FiTrash2
            style={{ color: "red", fontSize: "1.5rem", cursor: "pointer" }}
          />
        </Popconfirm>
      )}
      <Modal
        title="Atualizar informações de transação"
        visible={updateVisible}
        width={900}
        footer={null}
        onCancel={() => setUpdateVisible(false)}
      >
        <Update
          banking={banking}
          reload={reload}
          setReload={setReload}
          setVisible={setUpdateVisible}
        />
      </Modal>
    </Container>
  );
});

export default Actions;
