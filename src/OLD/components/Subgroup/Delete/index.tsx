// @ts-nocheck
// Core
import { memo, useCallback } from "react";

// Components
import { Popconfirm } from "antd";

// Services
import { subgroupsService } from "@/OLD/services/subgroups.service";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";
import { useMutation, useQueryClient } from "infinity-forge";

// Utils
import { permissionControl } from "@/OLD/utils/permissionsControlFake";
import { useToast } from "infinity-forge";

const DeleteSubgroup = memo(function DeleteSubgroup({ close, id }) {
  const queryClient = useQueryClient();
  const { createToast } = useToast();

  const { mutate, isLoading } = useMutation({
    queryKey: ["DeleteSoubegroupMutaiton"],
    queryFn: (id) => subgroupsService.deleteSubgroup(id),
  });

  const removeExam = useCallback(() => {
    if (!permissions?.SBG3) {
      return createToast({ message: "Ação não permitida!", status: "error" });
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
