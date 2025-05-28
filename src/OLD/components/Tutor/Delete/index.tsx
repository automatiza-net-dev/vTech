// @ts-nocheck
// Core
import React, { useState } from "react";

// Components
import { Popconfirm } from "antd";

// Services
import { petsService } from "@/OLD/services/patient.service";

// Icons
import { FiTrash2 } from "react-icons/fi";
import { useToast } from "infinity-forge";

export function Delete({ id, reload, setReload }) {
  const [loading, setLoading] = useState(false);

  const { createToast } = useToast();

  const mutate = (id) => {
    setLoading(true);
    petsService
      .deletePatient(id)
      .then((_res) =>
        createToast({
          status: "success",
          message: "Tutor removido com sucesso!",
        })
      )
      .catch((_err) => {
        createToast({
          status: "error",
          message:
            "Houve um erro ao remover o tutor, tente novamente mais tarde...",
        });

        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir esse tutor?"
        onConfirm={() =>
          createToast({ status: "error", message: "Verificar funcionalidade" })
        }
        okText="Sim"
        cancelText="Não"
        placement="left"
        loading={loading}
      >
        <FiTrash2
          className="uk-link"
          style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'red' }}
        />
      </Popconfirm>
    </div>
  );
}
