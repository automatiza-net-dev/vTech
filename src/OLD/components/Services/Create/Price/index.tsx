// @ts-nocheck
import React, { memo } from "react";

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

import { Input, Select, Form } from "antd";
const { Option } = Select;

const PriceForm = memo(function PriceForm({ data, setData }) {
  return (
    <section>
      <div className="uk-flex">
        <div className="uk-margin-small-right">
          <Form.Item
            label="Preço de custo"
            labelAlign="left"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
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
          </Form.Item>
        </div>

        <div className="uk-margin-small-right">
          <Form.Item
            label="Margem de lucro"
            labelAlign="left"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Input
              value={data?.profitMargin}
              onChange={(e) =>
                setData({ ...data, profitMargin: e.target.value })
              }
            />
          </Form.Item>
        </div>

        <div className="uk-margin-small-right">
          <Form.Item
            label="Preço de venda"
            required
            labelAlign="left"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Input
              required
              value={data?.price}
              onChange={(e) =>
                setData({
                  ...data,
                  price: currencyFormatter(convertIntlCurrency(e.target.value)),
                })
              }
            />
          </Form.Item>
        </div>

        <div className="uk-margin-small-right">
          <Form.Item
            label="Desconto Máximo (%)"
            labelAlign="left"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Input
              value={data?.maximumDiscountPercentage}
              onChange={(e) =>
                setData({ ...data, maximumDiscountPercentage: e.target.value })
              }
            />
          </Form.Item>
        </div>

        <div>
          <Form.Item
            label="Desconto Máximo (R$)"
            labelAlign="left"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Input
              value={data?.maximumDiscountValue}
              onChange={(e) =>
                setData({
                  ...data,
                  maximumDiscountValue: currencyFormatter(
                    convertIntlCurrency(e.target.value)
                  ),
                })
              }
            />
          </Form.Item>
        </div>
      </div>

      <div className="uk-flex uk-margin-small-top">
        <div className="uk-margin-small-right uk-width-1-4">
          <Form.Item>
            <label>Tipo de meta</label>
            <Select
              value={data?.metaType}
              onChange={(val) => setData({ ...data, metaType: val })}
              className="uk-width-1-1"
            >
              <Option value="v">Valor</Option>
              <Option value="q"> Quantidade </Option>
            </Select>
          </Form.Item>
        </div>

        <div className="uk-margin-small-right">
          <Form.Item>
            <label>Comissão</label>
            <Input
              value={data?.commission}
              onChange={(e) => setData({ ...data, commission: e.target.value })}
            />
          </Form.Item>
        </div>

        <div className="uk-margin-small-right">
          <Form.Item>
            <label>Meta de Venda</label>
            <Input
              value={data?.meta}
              onChange={(e) => setData({ ...data, meta: e.target.value })}
            />
          </Form.Item>
        </div>

        <div>
          <Form.Item>
            <label>Comissão Meta</label>
            <Input
              value={data?.commissionMeta}
              onChange={(e) =>
                setData({ ...data, commissionMeta: e.target.value })
              }
            />
          </Form.Item>
        </div>
      </div>
    </section>
  );
});

export default PriceForm;
