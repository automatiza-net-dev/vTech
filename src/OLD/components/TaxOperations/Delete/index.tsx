// @ts-nocheck
// Core
import { memo, useCallback } from "react";

// Components
import { Popconfirm, notification } from "antd";

// Services
import { taxOperationService } from "@/OLD/services/tax-operation.service";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";

// Utils
import { permissionControl } from "@/OLD/utils/permissionsControlFake";

const DeleteTaxOperation = memo(function DeleteTaxOperation({ close, id }) {
  const queryClient = useQueryClient();

  const permissions = permissionControl("operacoesFiscais");

  const { mutate, isLoading } = useMutation((id) =>
    taxOperationService.deleteTaxOperations(id)
  );

  const remove = useCallback(() => {
    if (!permissions?.OPF3) {
      return notification.error({ message: "ação não permitida" });
    }

    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["tax-operations"]);
        close();
      },
    });
  }, [id]);

  return (
    <Popconfirm
      onConfirm={remove}
      title="Deseja remover essa Operação Fiscal?"
      okText="Sim"
      cancelText="Cancelar"
      disabled={isLoading}
    >
      <DeleteTwoTone twoToneColor="red" />
    </Popconfirm>
  );
});

export default DeleteTaxOperation;
