// @ts-nocheck
// Core
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "infinity-forge";

// Services
import api from "@/OLD/services";
import { businessUnitsService } from "@/OLD/services/business-unit-product.service";

// Components
import { Button, InputNumber, Modal, Select } from "antd";

const CreateBusinessUnitProduct = function CreateBusinessUnitProduct({
  visible,
  initialData,
  close,
}) {
  const [data, setData] = useState({});

  const { data: businessUnits } = useQuery({
    queryKey: ["business-units"],
    queryFn: api.get(`/business-units/user`).then((res) => res.data),
    enabled: Object.keys(initialData).length > 0,
  });

  const handleClose = () => {
    setData(() => ({
      productVariationId: "",
    }));

    close();
  };

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setData(() => ({
      productVariationId: initialData.variationId,
    }));
  }, [initialData]);

  const { isLoading, mutate } = useMutation({
    queryKey: ["CreateBusinessUnitProduct"],
    queryFn: (newData) =>
      businessUnitsService.createBusinessUnitProduct(newData),
    onSuccess: () => {
      handleClose();
    },
  });

  const submit = useCallback(() => {
    mutate(data);
  }, [data]);

  return (
    <Modal
      title="Criar produto de uma unidade"
      visible={visible}
      onCancel={handleClose}
      footer={null}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Unidade</label>
            <Select
              placeholder="Selecione uma unidade"
              value={data.businessUnitId}
              onChange={(value) => {
                setData((prev) => ({
                  ...prev,
                  businessUnitId: value,
                }));
              }}
            >
              {businessUnits?.map((businessUnit) => (
                <Select.Option key={businessUnit.id} value={businessUnit.id}>
                  {businessUnit.fantasy_name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Preço de venda</label>
            <InputNumber
              required
              style={{ width: "100%" }}
              min={0}
              value={data.price}
              onChange={(val) => {
                data.price = val;
                setData({ ...data });
              }}
            />
          </div>
        </div>

        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Preço de custo</label>
            <InputNumber
              required
              style={{ width: "100%" }}
              min={0}
              value={data.cost}
              onChange={(val) => {
                data.costPrice = val;
                setData({ ...data });
              }}
            />
          </div>
        </div>

        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Estoque</label>
            <InputNumber
              required
              style={{ width: "100%" }}
              min={0}
              value={data.stock}
              onChange={(val) => {
                data.stock = val;
                setData({ ...data });
              }}
            />
          </div>
        </div>

        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Estoque máximo</label>
            <InputNumber
              required
              style={{ width: "100%" }}
              min={0}
              value={data.maximumStock}
              onChange={(val) => {
                data.maximumStock = val;
                setData({ ...data });
              }}
            />
          </div>
        </div>

        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Estoque mínimo</label>
            <InputNumber
              required
              style={{ width: "100%" }}
              min={0}
              value={data.minimumStock}
              onChange={(val) => {
                data.minimumStock = val;
                setData({ ...data });
              }}
            />
          </div>
        </div>

        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Desconto máximo (%)</label>
            <InputNumber
              required
              style={{ width: "100%" }}
              min={0}
              value={data.maximumDiscountPercentage}
              onChange={(val) => {
                data.maximumDiscountPercentage = val;
                setData({ ...data });
              }}
            />
          </div>
        </div>

        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Desconto máximo (R$)</label>
            <InputNumber
              required
              style={{ width: "100%" }}
              min={0}
              value={data.maximumDiscountValue}
              onChange={(val) => {
                data.maximumDiscountValue = val;
                setData({ ...data });
              }}
            />
          </div>
        </div>

        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Margem de Lucro</label>
            <InputNumber
              required
              style={{ width: "100%" }}
              min={0}
              value={data.profitMargin}
              onChange={(val) => {
                data.profitMargin = val;
                setData({ ...data });
              }}
            />
          </div>
        </div>

        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Comissão</label>
            <InputNumber
              required
              style={{ width: "100%" }}
              min={0}
              value={data.commission}
              onChange={(val) => {
                data.commission = val;
                setData({ ...data });
              }}
            />
          </div>
        </div>

        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Meta de venda</label>
            <InputNumber
              required
              style={{ width: "100%" }}
              min={0}
              value={data.meta}
              onChange={(val) => {
                data.meta = val;
                setData({ ...data });
              }}
            />
          </div>
        </div>

        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Meta de Comissão</label>
            <InputNumber
              required
              style={{ width: "100%" }}
              min={0}
              value={data.commissionMeta}
              onChange={(val) => {
                data.commissionMeta = val;
                setData({ ...data });
              }}
            />
          </div>
        </div>

        <div className="uk-width-1-1">
          <div className="uk-flex uk-flex-column">
            <label>Tipo de Meta</label>
            <Select
              className="uk-width-1-1"
              required
              value={data.metaType}
              onChange={(e) => {
                data.metaType = e;
                setData({ ...data });
              }}
            >
              <Select.Option value={"q"}>Quantidade</Select.Option>

              <Select.Option value={"v"}>Valor</Select.Option>
            </Select>
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

export default CreateBusinessUnitProduct;
