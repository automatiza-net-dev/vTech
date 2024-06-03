// @ts-nocheck
// Core
import React, { memo, useCallback } from "react";

// Components
import { Popconfirm, notification } from "antd";

// Services
import { examService } from "@/OLD/services/exams.service";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";

const DeleteExam = memo(function DeleteExam({ reload, setReload, id }) {
  const removeExam = useCallback(() => {
    examService
      .removeExam(id)
      .then((res) => {
        return notification.success({
          message: "Exame removido com sucesso!",
        });
      })
      .catch((err) => {
        return notification.error({
          message: err.response.data.errors[0].message,
        });
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
      <DeleteTwoTone twoToneColor="red" />
    </Popconfirm>
  );
});

export default DeleteExam;
