// @ts-nocheck
import React, { memo, useCallback, useState } from "react";

import { servicesService } from "@/OLD/services/services.service";

import { useSubgroups } from "@/OLD/hooks/useSubgroup";

import { Container } from "./styles";
import { Input, Select, Button, notification, Form } from "antd";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import DataForm from "./Data";
import PriceForm from "./Price";

import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

const Create = memo(function ({ setVisible }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [price, setPrice] = useState({});
  const [type, setType] = useState("data");

  const { subgroups } = useSubgroups();

  const verifyFields = (fields) => {
    if (fields?.includes("subgroupId")) {
      return notification.warning({ message: "Informe o subgrupo" });
    }

    if (fields?.includes("taxationGroupId")) {
      return notification.warning({ message: "Informe o grupo de imposto" });
    }

    if (fields?.includes("price.price")) {
      return notification.warning({ message: "Informe o Valor" });
    }
  };

  const submitService = useCallback(() => {
    setLoading(true);
    let error = false;
    servicesService
      .createService({
        ...data,
        price: {
          ...price,
          price: price.price ? convertIntlCurrency(price.price) : null,
          maximumDiscountValue: price?.maximumDiscountValue
            ? convertIntlCurrency(price?.maximumDiscountValue)
            : null,
          costPrice: price?.costPrice
            ? convertIntlCurrency(price?.costPrice)
            : null,
        },
      })
      .then((_res) =>
        notification.success({ message: "Serviço cadastrado com sucesso!" })
      )
      .catch((err) => {
        error = true;
        setLoading(false);
        return verifyFields(err.response.data.errors.map((msg) => msg?.field));
      })
      .finally(() => {
        !error && setVisible(false);
      });
  }, [data, price]);

  return (
    <Container className="uk-padding">
      <h3 className="uk-line uk-margin-remove">Cadastro de serviços</h3>
      <hr />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitService();
        }}
      >
        <section className="form-container uk-padding">
          <div className="uk-flex" style={{ gap: 20 }}>
            <div className="uk-width-1-1">
              <Form.Item>
                <label>* Descrição</label>
                <Input
                  required
                  value={data?.description}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                />
              </Form.Item>
            </div>

            <div className="uk-width-1-1">
              <Form.Item>
                <label>Código de referência</label>
                <Input
                  value={data?.referenceCode}
                  onChange={(e) =>
                    setData({ ...data, referenceCode: e.target.value })
                  }
                />
              </Form.Item>
            </div>

            <div className="uk-width-1-1">
              <Form.Item>
                <label>* Subgrupo</label>
                <Select
                  required
                  value={data.subgroupId}
                  className="uk-width-1-1"
                  placeholder="Selecione"
                  onChange={(val) => setData({ ...data, subgroupId: val })}
                >
                  {subgroups.length > 0 &&
                    subgroups.map((subgroup) => (
                      <Option value={subgroup?.id}>
                        {subgroup?.description}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </div>

            <div className="uk-width-1-1">
              <Form.Item>
                <label>* Tipo Serviço</label>
                <Select
                  className="uk-width-1-1"
                  placeholder="Selecione"
                  onChange={(val) => setData({ ...data, serviceType: val })}
                >
                  <Option value="service">Serviço</Option>
                  <Option value="exam">Exame</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="uk-flex uk-margin-top">
            <Button
              onClick={() => setType("data")}
              type={type === "data" && "primary"}
            >
              Dados cadastrais
            </Button>
            <Button
              onClick={() => setType("price")}
              type={type === "price" && "primary"}
            >
              Preço
            </Button>
          </div>
          <section className="uk-margin-top">
            {type === "data" && <DataForm data={data} setData={setData} />}
            {type === "price" && <PriceForm data={price} setData={setPrice} />}
          </section>
        </section>
        <hr />
        <footer className="uk-margin-top uk-flex uk-flex-right">
          <CustomButton
            classCallback="uk-margin-right"
            onClick={() => setVisible(false)}
          >
            Voltar
          </CustomButton>
          <CustomButton type="submit"> Salvar </CustomButton>
        </footer>
      </form>
    </Container>
  );
});

export default Create;
