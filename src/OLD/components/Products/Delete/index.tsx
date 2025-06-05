// @ts-nocheck
// Core
import { memo, useCallback } from "react";

// Components
import { Popconfirm } from "antd";

// Services
import { productService } from "@/OLD/services/product.service";

// Icons
import { FiTrash2 } from "react-icons/fi";
import { useMutation } from "infinity-forge";

// Utils
import { permissionControl } from "@/OLD/utils/permissionsControlFake";
import { useToast } from "infinity-forge";

const DeleteProduct = memo(function DeleteProduct({ id, hide }) {
  const permissions = permissionControl("produtos");
  const { createToast } = useToast();

  const { mutate, isLoading } = useMutation({
    queryKey: ["DeleteProduct"],
    queryFn: () => productService.removeProduct(id),
    onSuccess: () => {
      createToast({
        message: "Produto removido com sucesso",
        status: "success",
      });

      hide();
    },
  });

  const remove = useCallback(() => {
    if (!permissions?.PRD3) {
      return createToast({ message: "Ação não permitida", status: "error" });
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
      <FiTrash2
        className="uk-margin-small-left"
        style={{ cursor: 'pointer', fontSize: '1.2rem' }}
      />
    </Popconfirm>
  );
});

export default DeleteProduct;
