// @ts-nocheck
// Core
import React, { memo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

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
  const [loading, setLoading] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);

  const canEditBanking = useUserHasPermission("BAN02");
  const { createToast } = useToast();

  const handleDelete = useCallback(() => {
    if (!canEditBanking) {
      return createToast({ message: "Ação não permitida", status: "error" });
    }

    setLoading(true);
    bankingService
      .deleteBanking(banking.id)
      .then((_res) => {
        createToast({
          message: "Conta bancária removida com sucesso!",
          status: "success",
        });
      })
      .catch((_err) => {
        createToast({
          message: "Houve um erro ao remover a conta bancária...",
          status: "error",
        });
      })
      .finally(() => {
        setLoading(false);
        setReload(!reload);
      });
  }, [banking?.id]);

  return (
    <Container>
      {canEditBanking && (
        <FiEdit2 
          style={{ cursor: 'pointer', fontSize: '1.2rem' }} 
          onClick={() => setUpdateVisible(true)} 
        />
      )}
      <Popconfirm
        title="Deseja remover esta conta bancária?"
        onConfirm={handleDelete}
        okText="Sim"
        cancelText="Não"
        placement="left"
      >
        {canEditBanking && (
          <FiTrash2 
            style={{ color: 'red', fontSize: '1.2rem', cursor: 'pointer' }} 
          />
        )}
      </Popconfirm>
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
