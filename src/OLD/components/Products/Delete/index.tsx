// @ts-nocheck
// Core
import { memo, useCallback } from "react";

// Components
import { notification, Popconfirm } from "antd";

// Services
import { productService } from "@/OLD/services/product.service";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";
import { useMutation } from "react-query";

// Utils
import { permissionControl } from "@/OLD/utils/permissionsControlFake";

const DeleteProduct = memo(function DeleteProduct({ id, hide }) {
  const permissions = permissionControl("produtos");

  const { mutate, isLoading } = useMutation(
    () => productService.removeProduct(id),
    {
      onSuccess: () => {
        notification.success({
          message: "Produto removido com sucesso",
        });
        hide();
      },
    }
  );

  const remove = useCallback(() => {
    if (!permissions?.PRD3) {
      return notification.error({ message: "Ação não permitida" });
    }
    mutate();
  }, [id]);

  return (
    <Popconfirm
      onConfirm={remove}
      title="Deseja remover este produto?"
      okText="Sim"
      cancelText="Cancelar"
      disabled={isLoading}
    >
      <DeleteTwoTone twoToneColor="red" />
    </Popconfirm>
  );
});

export default DeleteProduct;
