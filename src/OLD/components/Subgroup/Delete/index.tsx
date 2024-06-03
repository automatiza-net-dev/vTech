// @ts-nocheck
// Core
import { memo, useCallback } from "react";

// Components
import { Popconfirm, notification } from "antd";

// Services
import { subgroupsService } from "@/OLD/services/subgroups.service";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";

// Utils
import { permissionControl } from "@/OLD/utils/permissionsControlFake";

const DeleteSubgroup = memo(function DeleteSubgroup({ close, id }) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation((id) =>
    subgroupsService.deleteSubgroup(id)
  );

  const removeExam = useCallback(() => {
    if (!permissions?.SBG3) {
      return notification.error({ message: "Ação não permitida!" });
    }

    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["subgroups"]);
        close();
      },
    });
  }, [id]);

  const permissions = permissionControl("subgrupos");

  return (
    <Popconfirm
      onConfirm={removeExam}
      title="Deseja remover este subgrupo?"
      okText="Sim"
      cancelText="Cancelar"
      disabled={isLoading}
    >
      <DeleteTwoTone twoToneColor="red" />
    </Popconfirm>
  );
});

export default DeleteSubgroup;
