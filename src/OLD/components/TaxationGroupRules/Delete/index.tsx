// @ts-nocheck
// Core
import { memo, useCallback } from "react";

// Components
import { Popconfirm } from "antd";

// Services
import { taxationGroupRulesService } from "@/OLD/services/taxation-group-rules.service";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";

const DeleteTaxationGroupRule = memo(function DeleteTaxationGroupRule({
  close,
  id,
}) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (id) => taxationGroupRulesService.deleteTaxationGroupRule(id),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["taxation-group-rules"]);
        close();
      },
    }
  );

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
      <DeleteTwoTone twoToneColor="red" />
    </Popconfirm>
  );
});

export default DeleteTaxationGroupRule;
