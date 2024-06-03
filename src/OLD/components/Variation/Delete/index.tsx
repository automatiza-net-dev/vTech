// @ts-nocheck
// Core
import { memo, useCallback } from "react";

// Components
import { Popconfirm } from "antd";

// Services
import { variationService } from "@/OLD/services/variation.service";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";

const DeleteVariation = memo(function DeleteVariation({ close, id }) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation((id) =>
    variationService.deleteVariation(id)
  );

  const remove = useCallback(() => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["variations"]);
        close();
      },
    });
  }, [id]);

  return (
    <Popconfirm
      onConfirm={remove}
      title="Deseja remover esta variação?"
      okText="Sim"
      cancelText="Cancelar"
      disabled={isLoading}
    >
      <DeleteTwoTone twoToneColor="red" />
    </Popconfirm>
  );
});

export default DeleteVariation;
