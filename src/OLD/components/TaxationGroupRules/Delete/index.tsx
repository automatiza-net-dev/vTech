// @ts-nocheck
// Core
import { memo, useCallback } from "react";

// Components
import { Popconfirm } from "antd";

// Services
import { taxationGroupRulesService } from "@/OLD/services/taxation-group-rules.service";

// Icons
import { FiTrash2 } from "react-icons/fi";
import { useToast } from "infinity-forge";
import { useMutation } from "infinity-forge";
import { useQueryClient } from "infinity-forge";

const DeleteTaxationGroupRule = memo(function DeleteTaxationGroupRule({
  close,
  id,
}) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    queryKey: ["DeleteTaxationGroupRule"],
    queryFn: (id) => taxationGroupRulesService.deleteTaxationGroupRule(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["taxation-group-rules"]);
      close();
    },
  });

  const remove = useCallback(() => {
    mutate(id);
  }, [id]);

  return (
    <Popconfirm
      onConfirm={remove}
      title="Deseja remover essa regra?"
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

export default DeleteTaxationGroupRule;
