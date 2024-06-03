// @ts-nocheck
// Core
import { memo, useCallback, useEffect, useState } from "react";

// Services
import { productService } from "@/OLD/services/product.service";
import { subgroupsService } from "@/OLD/services/subgroups.service";
import { taxationGroupsService } from "@/OLD/services/taxation-group.service";
import { unitsService } from "@/OLD/services/units.service";

// Hooks
import { useSingleProduct } from "@/OLD/hooks/useProducts";

import Masks from "@/OLD/utils/masks";

// Components
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  notification,
} from "antd";
import { useMutation, useQuery } from "react-query";

// Utils
import { sortItems } from "@/OLD/utils/sortItems";

const UpdateProduct = memo(function UpdateProduct({
  visible,
  selectedProduct,
  close,
}) {
  const [data, setData] = useState({
    description: selectedProduct?.description,
  });

  const { product: productInfo } = useSingleProduct(selectedProduct?.id, false);

  const { data: subgroupsData } = useQuery(
    ["subgroups"],
    () => subgroupsService.listSubgroups(),
    {
      enabled: visible,
    }
  );
  const { data: taxationGroups } = useQuery(
    ["taxation-groups"],
    async () => {
      return taxationGroupsService.listTaxationGroups();
    },
    {
      enabled: visible,
    }
  );

  const { data: unitsData } = useQuery(
    [
      "units",
      {
        type: "PRODUCT",
      },
    ],
    () => unitsService.listUnits("PRODUCT"),
    {
      enabled: visible,
    }
  );

  sortItems(unitsData?.data, "name");
  sortItems(subgroupsData, "description");
  sortItems(taxationGroups, "name");

  useEffect(() => {
    if (!productInfo) {
      return;
    }

    setData({
      description: productInfo.description,
      type: "product",
      referenceCode: productInfo.referenceCode,
      collectionYear: productInfo.collectionYear,
      ncm: productInfo.ncm,
      cest: productInfo.cest,
      features: productInfo.features,
      unitId: productInfo.unit?.id,
      active: productInfo.active,
      subgroupId: productInfo.subgroup?.id,
      icmsOrigin: productInfo.icms_origin,
      taxationGroupId: productInfo.taxationGroup?.id,
      purpose: productInfo?.purpose,
    });
  }, [productInfo]);

  const verifyFields = (fields) => {
    if (fields.includes("purpose")) {
      return notification.warning({
        message: "Informe o propósito do produto",
      });
    }

    if (fields.includes("icmsOrigin")) {
      return notification.warning({ message: "Informe a origem icms" });
    }
  };

  const { isLoading, mutate, error } = useMutation(
    (formData) => productService.updateProduct(productInfo.id, formData),
    {
      onSuccess: () => {
        notification.success({
          message: "Produto atualizado com sucesso!",
        });
        close();
      },
      onError: (err) => {
        verifyFields(err.response.data.errors.map((msg) => msg.field));
      },
    }
  );

  const submit = useCallback(() => {
    mutate({
      description: data.description,
      type: data.type,
      referenceCode: data.referenceCode,
      collectionYear: data.collectionYear,
      active: data.active,
      ncm: data.ncm,
      cest: data.cest,
      features: data.features,
      unitId: data.unitId,
      subgroupId: data.subgroupId,
      icmsOrigin: data.icmsOrigin,
      taxationGroupId: data.taxationGroupId,
      purpose: data?.purpose,
    });
  }, [data]);

  return (
    <Modal
      title="Atualizar informações do produto"
      visible={visible}
      onCancel={close}
      width={800}
      footer={null}
    >
      {error && <p>{error.message}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div
          className="uk-flex uk-flex-middle uk-flex-between"
          style={{ gap: "2rem" }}
        >
          <div className="uk-width-3-4">
            <Form.Item
              required
              labelAlign="left"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label>* Descrição</label>
              <Input
                value={data?.description}
                required
                onChange={(e) =>
                  setData((old) => ({ ...old, description: e.target.value }))
                }
              />
            </Form.Item>
          </div>

          <div className="uk-width-1-5">
            <div className="uk-flex uk-flex-column uk-flex-middle">
              <Form.Item
                label="Ativo"
                required
                labelAlign="left"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Switch
                  checked={data?.active}
                  onChange={(e) => setData({ ...data, active: e })}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div
          className="uk-flex uk-flex-middle uk-flex-between"
          style={{ gap: "2rem" }}
        >
          <div className=" uk-width-1-1">
            <Form.Item
              label="Código de Referência"
              labelAlign="left"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Input
                value={data?.referenceCode}
                onChange={(e) =>
                  setData((old) => ({ ...old, referenceCode: e.target.value }))
                }
              />
            </Form.Item>
          </div>

          <div className=" uk-flex uk-flex-column uk-width-1-1">
            <Form.Item
              label="Ano de referência"
              labelAlign="left"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <InputNumber
                style={{ width: "100%" }}
                max={new Date().getFullYear()}
                value={data?.collectionYear}
                onChange={(value) =>
                  setData({ ...data, collectionYear: value })
                }
              />
            </Form.Item>
          </div>
        </div>

        <div
          className="uk-flex uk-flex-middle uk-flex-between"
          style={{ gap: "2rem" }}
        >
          <div className=" uk-width-1-1">
            <Form.Item
              label="Código NCM"
              labelAlign="left"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Input
                value={data?.ncm}
                onChange={(e) =>
                  setData((old) => ({ ...old, ncm: Masks.ncm(e.target.value) }))
                }
              />
            </Form.Item>
          </div>

          <div className=" uk-width-1-1">
            <Form.Item
              label="Código CEST"
              labelAlign="left"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Input
                value={data?.cest}
                onChange={(e) =>
                  setData((old) => ({ ...old, cest: e.target.value }))
                }
              />
            </Form.Item>
          </div>
        </div>

        <div
          className="uk-flex uk-flex-middle uk-flex-between"
          style={{ gap: "2rem" }}
        >
          <div className=" uk-width-1-1">
            <Form.Item
              required
              labelAlign="left"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label>* Subgrupo</label>
              <Select
                className="uk-width-1-1"
                required
                value={data?.subgroupId}
                onChange={(value) => setData({ ...data, subgroupId: value })}
              >
                {subgroupsData?.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="uk-width-1-1">
            <Form.Item
              required
              labelAlign="left"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label>* Proposito do Produto</label>
              <Select
                className="uk-width-1-1"
                required
                value={data?.purpose}
                onChange={(value) => setData({ ...data, purpose: value })}
              >
                <Select.Option value="internal">
                  Apenas consumo interno
                </Select.Option>
                <Select.Option value="sale">Apenas venda</Select.Option>
                <Select.Option value="both">
                  Venda e consumo interno
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        <div
          className="uk-flex uk-flex-middle uk-flex-between"
          style={{ gap: "2rem" }}
        >
          <div className=" uk-width-1-1">
            <Form.Item
              required
              labelAlign="left"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label>* Grupo de Imposto</label>
              <Select
                className="uk-width-1-1"
                required
                value={data?.taxationGroupId}
                onChange={(value) =>
                  setData({ ...data, taxationGroupId: value })
                }
              >
                {taxationGroups?.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className=" uk-width-1-1">
            <Form.Item
              labelAlign="left"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label>* Unidade</label>
              <Select
                className="uk-width-1-1"
                required
                value={data?.unitId}
                onChange={(value) => setData({ ...data, unitId: value })}
              >
                {unitsData?.data.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name} ({item.tag})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className=" uk-width-1-1">
          <Form.Item
            labelAlign="left"
            required
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label>* Origem ICMS</label>
            <Select
              className="uk-width-1-1"
              required
              value={data?.icmsOrigin}
              onChange={(value) => setData({ ...data, icmsOrigin: value })}
            >
              {[
                {
                  value: "0",
                  label:
                    "0 : Nacional - exceto as indicadas nos códigos 3 a 5 ",
                },
                {
                  value: "1",
                  label:
                    "1 : Estrangeira - Importação direta, exceto a indicada no código 6",
                },
                {
                  value: "2",
                  label:
                    "2 : Estrangeira - Importação Indireta / Adquirida no mercado interno, exceto a indicada no código 7 ",
                },
                {
                  value: "3",
                  label:
                    "3 : Nacional - mercadoria ou bem com Conteúdo de Importação superior a 40% (quarenta por cento) ",
                },
                {
                  value: "4",
                  label:
                    "4 : Nacional - cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam o Decreto-Lei nº 288/67, e as Leis nºs 8.248/91, 8.387/91, 10.176/01 e 11 . 4 8 4 / 0 7 ",
                },
                {
                  value: "5",
                  label:
                    "5 : Nacional - mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40% (quarenta por cento) ",
                },
                {
                  value: "6",
                  label:
                    "6 : Estrangeira - Importação direta, sem similar nacional, constante em lista de Resolução CAMEX ",
                },
                {
                  value: "7",
                  label:
                    "7 : Estrangeira - Adquirida no mercado interno, sem similar nacional, constante em lista de Resolução CAMEX”",
                },
                {
                  value: "8",
                  label:
                    "8 : Nacional - Mercadoria ou bem com Conteúdo de Importação superior a 70% (setenta por cento).",
                },
              ].map((item) => (
                <Select.Option
                  key={`icms-origin-${item?.value}`}
                  value={item?.value}
                >
                  {item?.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="uk-width-1-1">
          <Form.Item
            labelAlign="left"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label>Características</label>
            <Input.TextArea
              className="uk-width-1-1"
              value={data?.features}
              onChange={(e) => setData({ ...data, features: e.target.value })}
            />
          </Form.Item>
        </div>
        <hr />
        <footer className="uk-flex uk-flex-right">
          <div className="uk-width-1-2 uk-flex uk-flex-around">
            <Button htmlType="submit" type="primary" disabled={isLoading}>
              Salvar
            </Button>
            <Button onClick={close}> Cancelar </Button>
          </div>
        </footer>
      </form>
    </Modal>
  );
});

export default UpdateProduct;
