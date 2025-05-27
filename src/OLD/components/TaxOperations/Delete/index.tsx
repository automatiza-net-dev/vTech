// @ts-nocheck
// Core
import { memo, useCallback } from "react";

// Components
import { Popconfirm } from "antd";

// Services
import { taxOperationService } from "@/OLD/services/tax-operation.service";

// Icons
import { FiTrash2 } from "react-icons/fi";
import { useMutation, useQueryClient } from "infinity-forge";

// Utils
import { permissionControl } from "@/OLD/utils/permissionsControlFake";
import { useToast } from "infinity-forge";

const DeleteTaxOperation = memo(function DeleteTaxOperation({ close, id }) {
  const queryClient = useQueryClient();

  const permissions = permissionControl("operacoesFiscais");
  const { createToast } = useToast();

  const { mutate, isLoading } = useMutation({
    queryKey: ["DeleteTaxOperationMuration"],
    queryFn: (id) => taxOperationService.deleteTaxOperations(id),
  });

  const remove = useCallback(() => {
    if (!permissions?.OPF3) {
      return createToast({ message: "ação não permitida", status: "error" });
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
      <FiTrash2
        className="uk-link"
        style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'red' }}
      />
    </Popconfirm>
  );
});

export default DeleteTaxOperation;
