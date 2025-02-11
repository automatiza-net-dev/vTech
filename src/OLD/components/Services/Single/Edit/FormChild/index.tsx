// @ts-nocheck
import React, { memo } from "react";

import { Input, Select, Button } from "antd";
const { Option } = Select;

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { useToast } from "infinity-forge";

const FormChild = memo(function FormChild({
  data,
  setData,
  submit,
  setVisible,
}) {
  const { createToast } = useToast();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="uk-flex">
        <div className="uk-margin-small-right">
          <label>Preço de custo</label>
          <Input
            value={data?.costPrice}
            onChange={(e) =>
              setData({
                ...data,
                costPrice: currencyFormatter(
                  convertIntlCurrency(e.target.value)
                ),
              })
            }
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Margem de lucro</label>
          <Input
            value={data?.profitMargin}
            onChange={(e) => setData({ ...data, profitMargin: e.target.value })}
          />
        </div>
        <div>
          <label> Preço venda </label>
          <Input
            value={data?.price}
            onChange={(e) =>
              setData({
                ...data,
                price: currencyFormatter(convertIntlCurrency(e.target.value)),
              })
            }
          />
        </div>
      </div>
      <div className="uk-margin-top uk-flex">
        <div className="uk-margin-small-right">
          <label>Desconto Máximo (%)</label>
          <Input
            value={data?.maximumDiscountPercentage}
            type="number"
            onChange={(e) => {
              if (e.target.value <= 100) {
                setData({ ...data, maximumDiscountPercentage: e.target.value });
              } else {
                createToast({
                  message: "O valor máximo é 100%",
                  status: "warning",
                });
              }
            }}
          />
        </div>
        <div>
          <label>Desconto Máximo (R$)</label>
          <Input
            value={data?.maximumDiscountValue}
            onChange={(e) => {
              if (
                convertIntlCurrency(e.target.value) <=
                convertIntlCurrency(data?.price)
              ) {
                setData({
                  ...data,
                  maximumDiscountValue: currencyFormatter(
                    convertIntlCurrency(e.target.value)
                  ),
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
      <div className="uk-margin-top">
        <label>Tipo Meta</label>
        <Select
          className="uk-width-1-1"
          value={data?.metaType}
          onChange={(val) => setData({ ...data, metaType: val })}
        >
          <Option value="q">Quantidade</Option>
          <Option value="v">Valor</Option>
        </Select>
      </div>
      <div className="uk-margin-top uk-flex">
        <div className="uk-margin-small-right">
          <label>Comissão</label>
          <Input
            type="number"
            value={data?.commission}
            onChange={(e) => setData({ ...data, commission: e.target.value })}
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Meta</label>
          <Input
            type="number"
            value={data?.meta}
            onChange={(e) => setData({ ...data, meta: e.target.value })}
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Comissão Meta</label>
          <Input
            type="number"
            value={data?.commissionMeta}
            onChange={(e) =>
              setData({ ...data, commissionMeta: e.target.value })
            }
          />
        </div>
      </div>
      <hr />
      <footer className="uk-flex uk-flex-right">
        <Button htmlType="submit" type="primary" className="uk-margin-right">
          Salvar
        </Button>
        <Button onClick={() => setVisible(false)}>Cancelar</Button>
      </footer>
    </form>
  );
});

export default FormChild;
