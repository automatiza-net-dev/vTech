// @ts-nocheck
// Core
import { memo, useCallback } from "react";

// Components
import { Popconfirm } from "antd";

// Services
import { variationGroupService } from "@/OLD/services/variation-group.service";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";

const DeleteSubgroup = memo(function DeleteSubgroup({ close, id }: any) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation((id) =>
    variationGroupService.deleteVariationGroup(id)
  );

  const removeExam = useCallback(() => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["variation-groups"]);
        close();
      },
    });
  }, [id]);

  return (
    <Popconfirm
      onConfirm={removeExam}
      title="Deseja remover este grupo de variação?"
      okText="Sim"
      cancelText="Cancelar"
      disabled={isLoading}
    >
      <DeleteTwoTone twoToneColor="red" />
    </Popconfirm>
  );
});

export default DeleteSubgroup;
