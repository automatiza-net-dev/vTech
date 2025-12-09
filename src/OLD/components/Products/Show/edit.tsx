// @ts-nocheck
// Core
import { useCallback, useEffect, useState } from "react";

// Services
import { productService } from "@/OLD/services/product.service";

// Components
import { Button, InputNumber, Modal, Select } from "antd";
import { useToast } from "infinity-forge";
import { useMutation } from "infinity-forge";

const UpdateBusinessUnitProduct = function UpdateBusinessUnitProduct({
  visible,
  initialData,
  close,
  id,
}) {
  const { createToast } = useToast();

  const [data, setData] = useState({});

  const handleClose = () => {
    setData({});
    close();
  };

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setData(() => ({
      businessUnitId: initialData.businessUnitId,
      stock: initialData.stock,
      price: initialData.price,
      maximumStock: initialData.maxStock,
      minimumStock: initialData.minStock,
      maximumDiscountPercentage: initialData.maxPercentageDiscount,
      maximumDiscountValue: initialData.maxValueDiscount,
      profitMargin: initialData.profitMargin,
      commission: initialData.commission ?? 0,
      metaType: initialData.metaType === "Quantidade" ? "q" : "v",
      meta: initialData.meta ?? 0,
      commissionMeta: initialData.commissionMeta ?? 0,
      costPrice: initialData.cost,
      productVariationId: initialData.productVariationId,
    }));
  }, [initialData]);

  const { isLoading, mutate } = useMutation({
    queryKey: ["UpdateBUsinessUnitProduct"],
    queryFn: (newData) => productService.updateBusinessUnitProduct(id, newData),
    onSuccess: () => {
      handleClose();
    },
  });

  const submit = useCallback(() => {
    mutate(data);
  }, [data]);

  return (
    <Modal
      title="Atualizar informações do produto"
      visible={visible}
      width={800}
      onCancel={handleClose}
      footer={null}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div
          className="uk-flex uk-flex-middle uk-flex-between"
          style={{ gap: "1rem" }}
        >
          <div className="uk-margin-top uk-flex uk-flex-column">
            <label>Estoque</label>
            <InputNumber
              style={{ width: "100%" }}
              required
              readOnly
              value={data?.stock}
              onInput={(value) =>
                setData({ ...data, stock: value.replace(",", ".") })
              }
            />
          </div>
          <div className="uk-margin-top uk-flex uk-flex-column">
            <label>Estoque Mínimo</label>
            <InputNumber
              style={{ width: "100%" }}
              required
              value={data?.minimumStock}
              onInput={(value) =>
                setData({ ...data, minimumStock: value.replace(",", ".") })
              }
            />
          </div>
          <div className="uk-margin-top uk-flex uk-flex-column">
            <label>Estoque Máximo</label>
            <InputNumber
              style={{ width: "100%" }}
              required
              value={data?.maximumStock}
              onInput={(value) =>
                setData({ ...data, maximumStock: value.replace(",", ".") })
              }
            />
          </div>
        </div>

        <div
          className="uk-flex uk-flex-middle uk-flex-between"
          style={{ gap: "1rem" }}
        >
          <div className="uk-margin-top uk-flex uk-flex-column">
            <label>Preço de Custo (R$)</label>
            <InputNumber
              style={{ width: "100%" }}
              required
              value={data?.costPrice}
              onInput={(value) =>
                setData({ ...data, costPrice: value.replace(",", ".") })
              }
            />
          </div>

          <div className="uk-margin-top uk-flex uk-flex-column">
            <label>Margem de Lucro(%)</label>
            <InputNumber
              style={{ width: "100%" }}
              required
              value={data?.profitMargin}
              onInput={(value) =>
                setData({ ...data, profitMargin: value.replace(",", ".") })
              }
            />
          </div>

          <div className="uk-margin-top uk-flex uk-flex-column">
            <label>Preço Venda (R$)</label>
            <InputNumber
              style={{ width: "100%" }}
              required
              value={data?.price}
              onInput={(value) => {
                setData({ ...data, price: value.replace(",", ".") });
              }}
            />
          </div>
        </div>

        <div
          className="uk-flex uk-flex-middle uk-flex-between"
          style={{ gap: "1rem" }}
        >
          <div className="uk-margin-top uk-flex uk-flex-column">
            <label>Desconto Máximo (%)</label>
            <InputNumber
              style={{ width: "100%" }}
              required
              value={data?.maximumDiscountPercentage}
              onInput={(val) => {
                if (Number.isNaN(Number.parseFloat(val))) {
                  setData({
                    ...data,
                    maximumDiscountPercentage: `0.${val.replace(",", ".")}`,
                  });
                  return;
                }

                if (Number.parseFloat(val) <= 100) {
                  setData({
                    ...data,
                    maximumDiscountPercentage: val.replace(",", "."),
                  });
                } else {
                  createToast({
                    message: "O valor máximo é 100%",
                    status: "warning",
                  });
                }
              }}
            />
          </div>

          <div className="uk-margin-top uk-flex uk-flex-column">
            <label>Desconto Máximo (R$)</label>
            <InputNumber
              style={{ width: "100%" }}
              required
              value={data?.maximumDiscountValue}
              onInput={(val) => {
                if (Number.parseFloat(val) <= Number.parseFloat(data?.price)) {
                  setData({
                    ...data,
                    maximumDiscountValue: val.replace(",", "."),
                  });
                } else {
                  createToast({
                    message:
                      "O valor de desconto não pode ser maior que o preço de venda",
                    status: "warning",
                  });
                }
              }}
            />
          </div>
        </div>

        <div className="uk-margin-top uk-flex uk-flex-column">
          <label>Tipo de Meta</label>
          <Select
            className="uk-width-1-1"
            required
            value={data?.metaType}
            onChange={(e) => {
              setData({ ...data, metaType: e });
            }}
          >
            <Select.Option value={"q"}>Quantidade</Select.Option>

            <Select.Option value={"v"}>Valor</Select.Option>
          </Select>
        </div>

        <div
          className="uk-flex uk-flex-middle uk-flex-between"
          style={{ gap: "1rem" }}
        >
          <div className="uk-margin-top uk-flex uk-flex-column">
            <label>Comissão</label>
            <InputNumber
              style={{ width: "100%" }}
              required
              value={data?.commission}
              onInput={(value) =>
                setData({ ...data, commission: value.replace(",", ".") })
              }
            />
          </div>

          <div className="uk-margin-top uk-flex uk-flex-column">
            <label>Meta</label>
            <InputNumber
              style={{ width: "100%" }}
              required
              value={data?.meta}
              onChange={(value) =>
                setData({ ...data, meta: value.replace(",", ".") })
              }
            />
          </div>

          <div className="uk-margin-top uk-flex uk-flex-column">
            <label>Comissão Meta</label>
            <InputNumber
              style={{ width: "100%" }}
              required
              value={data?.commissionMeta}
              onChange={(value) =>
                setData({ ...data, commissionMeta: value.replace(",", ".") })
              }
            />
          </div>
        </div>

        <hr />
        <footer className="uk-flex uk-flex-right">
          <div className="uk-width-1-2 uk-flex uk-flex-around">
            <Button htmlType="submit" type="primary" disabled={isLoading}>
              Salvar
            </Button>
            <Button onClick={handleClose}> Cancelar </Button>
          </div>
        </footer>
      </form>
    </Modal>
  );
};

export default UpdateBusinessUnitProduct;
