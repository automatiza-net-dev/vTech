// @ts-nocheck
// Core
import React, { memo, useCallback } from "react";

// Components
import { Popconfirm } from "antd";

// Services
import { examService } from "@/OLD/services/exams.service";

// Icons
import { FiTrash2 } from "react-icons/fi";
import { useToast } from "infinity-forge";

const DeleteExam = memo(function DeleteExam({ reload, setReload, id }) {

  const {createToast} = useToast()

  const removeExam = useCallback(() => {
    examService
      .removeExam(id)
      .then((res) => {
        return  createToast({ status: "success", message:  "Exame removido com sucesso!" })
      })
      .catch((err) => {
        return createToast({ status: "error", message:  err.response.data.errors[0].message })
      })
      .finally(() => {
        setReload(!reload);
      });
  }, [id]);

  return (
    <Popconfirm
      onConfirm={removeExam}
      title="Deseja remover este exame?"
      okText="Sim"
      cancelText="Cancelar"
    >
      <FiTrash2 style={{ color: 'red', fontSize: 20, cursor: 'pointer' }} />
    </Popconfirm>
  );
});

export default DeleteExam;
