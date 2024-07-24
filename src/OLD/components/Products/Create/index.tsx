// @ts-nocheck
// Core
import { memo, useCallback, useState } from "react";

// Services
import { productService } from "@/OLD/services/product.service";
import { subgroupsService } from "@/OLD/services/subgroups.service";
import { taxationGroupsService } from "@/OLD/services/taxation-group.service";
import { unitsService } from "@/OLD/services/units.service";
import { variationGroupService } from "@/OLD/services/variation-group.service";
import Masks from "@/OLD/utils/masks";

// Components
import {
  Button,
  Input,
  InputNumber,
  Radio,
  Select,
  Form,
  notification,
  AutoComplete,
  Switch,
} from "antd";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { Container } from "../styles";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";

// Utils
import { sortItems } from "@/OLD/utils/sortItems";
import { normalizeStr } from "@/OLD/utils/normalizeString";

const listToTree = (arr = []) => {
  const map = {};
  let node;
  const result = [];

  for (let i = 0; i < arr.length; i += 1) {
    map[arr[i].id] = i;
    arr[i].children = [];
  }

  for (const element of arr) {
    node = element;
    if (arr[map[node.parent_id]]) {
      arr[map[node.parent_id]].children.push(node);
    } else {
      result.push(node);
    }
  }

  return result;
};

// const renderTree = (arr = []) => {
//   return arr.map((item) => {
//     if (item.children.length > 0) {
//       return (
//         <Select.OptGroup key={item.id} label={item.description}>
//           {renderTree(item.children)}
//         </Select.OptGroup>
//       )
//     }

//     return (
//       <Select.Option key={item.id} value={item.id}>
//         {item.description}
//       </Select.Option>
//     )
//   })
// }

const CreateProduct = memo(function CreateProduct({ setVisible }) {
  const { push, back } = useRouter();
  const [data, setData] = useState({
    type: "product",
    price: {},
    variations: [
      {
        barcode: "",
        variation_options: [],
      },
    ],
  });

  const [view, setView] = useState("1");
  const [parsedSubgroups, setParsedSubgroups] = useState([]);

  const { data: variationGroupsData } = useQuery(["variation-groups"], () =>
    variationGroupService.listVariationGroups()
  );

  useQuery(["subgroups"], () => subgroupsService.listSubgroups(), {
    onSuccess: (data) => {
      sortItems(data, "description");
      setParsedSubgroups(data);
    },
  });
  const { data: taxationGroups } = useQuery(["taxation-groups"], async () => {
    return taxationGroupsService.listTaxationGroups();
  });

  const { data: unitsData } = useQuery(
    [
      "units",
      {
        type: "PRODUCT",
      },
    ],
    () => unitsService.listUnits("PRODUCT")
  );

  sortItems(unitsData?.data, "name");

  const verifyFields = (fields) => {
    if (fields.includes("subgroupId")) {
      return notification.warning({ message: "Informe o subgrupo" });
    }

    if (fields.includes("purpose")) {
      return notification.warning({
        message: "Informe o propósito do produto",
      });
    }

    if (fields.includes("taxationGroupId")) {
      return notification.warning({ message: "Informe o grupo de imposto" });
    }

    if (fields.includes("icmsOrigin")) {
      return notification.warning({ message: "Informe a origem icms" });
    }
  };

  const { mutate, isLoading } = useMutation(
    (formData) => productService.createProduct(formData),
    {
      onSuccess: async () => {
        setVisible(false);
        return notification.success({
          message: "Produto cadastrado com sucesso!",
        });
      },
      onError: (err) => {
        verifyFields(err.response.data.errors.map((msg) => msg.field));
      },
    }
  );

  const submit = useCallback(() => {
    const correctDiscount = data.price.maximumDiscountValue
      ? convertIntlCurrency(data.price.maximumDiscountValue)
      : 0;
    const correctSalePrice = data.price.price
      ? convertIntlCurrency(data.price.price)
      : 0;
    const correctCostPrice = data.price.costPrice
      ? convertIntlCurrency(data.price.costPrice)
      : 0;

    const correctData = {
      ...data,
      price: {
        ...data.price,
        maximumDiscountValue: correctDiscount,
        price: correctSalePrice,
        costPrice: correctCostPrice,
      },
    };

    let valid = true;

    const parsedVariations = data.variations.map((variation) => {
      const options = variation.variation_options;
      const vGroup = variationGroupsData.find(
        (variationGroup) => variationGroup.id === data?.variationGroup
      );

      if (!vGroup || vGroup.variations.length !== options.length) {
        valid = false;
      }

      return {
        ...variation,
        price: correctData.price,
      };
    });

    if (!valid) {
      notification.warning({
        message: "Você precisa selecionar todas as opções de variação",
      });
      return;
    }

    mutate({
      ...correctData,
      variations: parsedVariations,
    });
  }, [data]);

  const addVariation = () => {
    setData({
      ...data,
      variations: [
        ...data.variations,
        {
          ref: Math.random().toString().substring(2, 8),
          barcode: "",
          variation_options: [],
        },
      ],
    });
  };

  const removeVariation = (ref) => {
    const len = data.variations.length;

    if (len === 1) return;

    const variations = data.variations.filter((val) => val.ref !== ref);

    setData({
      ...data,
      variations,
    });
  };

  return (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Criar produto</h3>

      <div className="uk-margin-top">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="w-100 uk-flex uk-flex-between">
            <Form.Item
              labelAlign="left"
              required={true}
              style={{
                width: "80%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label>* Descrição</label>
              <Input
                value={data?.description}
                required
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              labelAlign="left"
              required={true}
              style={{
                width: "10%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label>* Cortesia</label>
              <Switch
                value={data?.courtesy}
                required
                onChange={(e) => setData({ ...data, courtesy: e })}
              />
            </Form.Item>
          </div>
          <div
            className="uk-margin-top uk-flex uk-flex-between"
            style={{ gap: "5px" }}
          >
            <div className="uk-width-2-3">
              <Form.Item labelAlign="left" required>
                <label>* Subgrupo</label>
                <Select
                  className="uk-width-1-1"
                  required
                  value={data?.subgroupId}
                  onChange={(value) => setData({ ...data, subgroupId: value })}
                >
                  {parsedSubgroups.map((item) => (
                    <>
                      <Select.Option value={item.id}>
                        {item.description}
                      </Select.Option>
                    </>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="uk-width-2-3">
              <Form.Item required>
                <label>* Propósito do produto</label>
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
            <div className="uk-width-1-3">
              <Form.Item labelAlign="left">
                <label>Cód. referência</label>
                <Input
                  value={data?.referenceCode}
                  onChange={(e) =>
                    setData({ ...data, referenceCode: e.target.value })
                  }
                />
              </Form.Item>
            </div>

            <div className="uk-width-1-3">
              <div className="uk-flex uk-flex-column">
                <Form.Item labelAlign="left">
                  <label>Ano de referência</label>
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
          </div>

          <Radio.Group
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="uk-margin-top"
          >
            <Radio.Button value="1">Dados Cadastrais</Radio.Button>
            <Radio.Button value="2">Variações</Radio.Button>
            <Radio.Button value="3">Preços</Radio.Button>
          </Radio.Group>

          {view === "1" && (
            <>
              <div className="uk-margin-top uk-flex" style={{ gap: "5px" }}>
                <div className="uk-width-1-4">
                  <Form.Item
                    labelAlign="left"
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label>* Tipo de unidade</label>
                    <Select
                      className="uk-width-1-1"
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

                <div className="uk-width-1-4">
                  <label>Produto fracionado</label>
                  <Select
                    className="uk-width-1-1"
                    value={data?.fractioned}
                    onChange={(val) => setData({ ...data, fractioned: val })}
                  >
                    <Option value={true}>Sim</Option>
                    <Option value={false}>Não</Option>
                  </Select>
                </div>
                {data?.fractioned && (
                  <>
                    <div className="uk-width-1-4">
                      <label>Unidade fracionamento</label>
                      <AutoComplete
                        className="uk-width-1-1"
                        options={unitsData?.data?.map((unit) => ({
                          ...unit,
                          value: unit?.name,
                        }))}
                        value={data?.fractionUnitDescription}
                        onChange={(val) =>
                          setData({ ...data, fractionUnitDescription: val })
                        }
                        onSelect={(_, opt) =>
                          setData({
                            ...data,
                            fractionUnitDescription: opt?.value,
                            fractionUnitId: opt?.id,
                          })
                        }
                        filterOption={(val, opt) =>
                          normalizeStr(opt?.value.toUpperCase()).includes(
                            normalizeStr(val?.toUpperCase())
                          )
                        }
                      />
                    </div>
                    <div className="uk-width-1-4">
                      <label>Qtd Embalagem</label>
                      <Input
                        value={data?.fractionValue}
                        onChange={(e) =>
                          setData({ ...data, fractionValue: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="uk-margin-top uk-flex uk-flex-between">
                <div className="uk-width-1-1">
                  <Form.Item
                    labelAlign="left"
                    required
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label>* Grupo de imposto</label>
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

                <div className="uk-width-1-1 uk-padding uk-padding-remove-vertical uk-padding-remove-left">
                  <Form.Item
                    labelAlign="left"
                    style={{
                      width: "80%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label>Código NCM</label>
                    <Input
                      value={data?.ncm}
                      onChange={(e) =>
                        setData({ ...data, ncm: Masks.ncm(e.target.value) })
                      }
                    />
                  </Form.Item>
                </div>

                <div className="uk-width-1-1 uk-padding uk-padding-remove-vertical uk-padding-remove-left">
                  <Form.Item
                    labelAlign="left"
                    style={{
                      width: "80%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label>Código CEST</label>
                    <Input
                      value={data?.cest}
                      onChange={(e) =>
                        setData({ ...data, cest: e.target.value })
                      }
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="uk-width-1-1 uk-padding uk-padding-remove-vertical uk-padding-remove-left">
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
                    onChange={(value) =>
                      setData({ ...data, icmsOrigin: value })
                    }
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
              <div className="uk-margin-top">
                <div className="uk-padding uk-padding-remove-vertical uk-padding-remove-left">
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
                      value={data?.features}
                      onChange={(e) =>
                        setData({ ...data, features: e.target.value })
                      }
                    />
                  </Form.Item>
                </div>
              </div>
            </>
          )}

          {view === "2" && (
            <>
              <div className="uk-margin-top">
                <Form.Item
                  labelAlign="left"
                  required
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label>*Grupo de Variação</label>
                  <Select
                    className="uk-width-1-1"
                    required
                    value={data?.variationGroup}
                    onChange={(value) =>
                      setData({ ...data, variationGroup: value })
                    }
                  >
                    {variationGroupsData?.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.description}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <hr />

              <div className="uk-flex">
                <Button onClick={addVariation}>Adicionar variação</Button>
              </div>

              {data?.variations.map((item, index) => (
                <div key={`variation-div-${index}`} className={"uk-margin-top"}>
                  <div className="uk-flex uk-flex-inline">
                    <h5 className="uk-padding-small uk-padding-remove-vertical uk-padding-remove-left">
                      Variação {index + 1}
                    </h5>
                    <Button
                      onClick={() => removeVariation(item.ref)}
                      disabled={data.variations.length === 1}
                      size={"small"}
                    >
                      Remover
                    </Button>
                  </div>

                  <div className="uk-margin-top">
                    <div className="uk-flex uk-flex-between">
                      <div className="uk-width-1-1">
                        <Form.Item
                          labelAlign="left"
                          style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <label>Código de Barras</label>
                          <Input
                            maxLength={15}
                            value={item.barcode}
                            onChange={(e) => {
                              const variations = data.variations;
                              variations[index].barcode = e.target.value;
                              setData({ ...data, variations });
                            }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  {data?.variationGroup && (
                    <div className="uk-margin-top">
                      <div className="uk-flex uk-flex-between">
                        {variationGroupsData
                          ?.find((g) => g.id === data.variationGroup)
                          .variations.map((variation, vIndex) => (
                            <div
                              key={`variation-${variation.id}`}
                              className="uk-width-1-1 uk-padding uk-padding-remove-vertical uk-padding-remove-left"
                            >
                              <Form.Item
                                label={variation.description}
                                required
                                labelAlign="left"
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Select
                                  className="uk-width-1-1"
                                  required
                                  onChange={(value) => {
                                    const variations = data.variations;

                                    variations[index]["variation_options"][
                                      vIndex
                                    ] = value;

                                    setData({ ...data, variations });
                                  }}
                                >
                                  {variation.options.map((option) => (
                                    <Select.Option
                                      key={`variation-option-${option.id}`}
                                      value={option.id}
                                    >
                                      {option.description}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  <hr />
                </div>
              ))}
            </>
          )}

          {view === "3" && (
            <>
              <div
                className="uk-margin-top uk-flex uk-flex-between"
                style={{ gap: "1rem" }}
              >
                <div className="uk-width-1-1">
                  <div className="uk-flex uk-flex-column">
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
                        style={{ width: "100%" }}
                        value={data["price"].costPrice}
                        onChange={(e) => {
                          data["price"].costPrice = Masks.money(e.target.value);
                          setData({ ...data });
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="uk-width-1-1">
                  <div className="uk-flex uk-flex-column">
                    <Form.Item
                      label="Margem de Luco"
                      labelAlign="left"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        onChange={(val) => {
                          data["price"].profitMargin = val;
                          setData({ ...data });
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="uk-width-1-1">
                  <div className="uk-flex uk-flex-column">
                    <Form.Item
                      label="Preço de venda"
                      labelAlign="left"
                      required
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Input
                        required
                        style={{ width: "100%" }}
                        value={data["price"].price}
                        onChange={(e) => {
                          data["price"].price = Masks.money(e.target.value);
                          setData({ ...data });
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="uk-width-1-1">
                  <div className="uk-flex uk-flex-column">
                    <Form.Item
                      label="Estoque mínimo"
                      labelAlign="left"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        onChange={(val) => {
                          data["price"].minimumStock = val;
                          setData({ ...data });
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="uk-width-1-1">
                  <div className="uk-flex uk-flex-column">
                    <Form.Item
                      label="Estoque máximo"
                      labelAlign="left"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        onChange={(val) => {
                          data["price"].maximumStock = val;
                          setData({ ...data });
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="uk-width-1-1">
                  <div className="uk-flex uk-flex-column">
                    <Form.Item
                      label="Desconto máximo (%)"
                      labelAlign="left"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        onChange={(val) => {
                          data["price"].maximumDiscountPercentage = val;
                          setData({ ...data });
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="uk-width-1-1">
                  <div className="uk-flex uk-flex-column">
                    <Form.Item
                      label="Desconto máximo (R$)"
                      labelAlign="left"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Input
                        style={{ width: "100%" }}
                        value={data["price"].maximumDiscountValue}
                        onChange={(e) => {
                          data["price"].maximumDiscountValue = Masks.money(
                            e.target.value
                          );
                          setData({ ...data });
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div
                className="uk-margin-top uk-flex uk-flex-between"
                style={{ gap: "1rem" }}
              >
                <div className="uk-width-1-1">
                  <div className="uk-flex uk-flex-column">
                    <Form.Item
                      labelAlign="left"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <label>Tipo de Meta</label>
                      <Select
                        className="uk-width-1-1"
                        required
                        onChange={(e) => {
                          data["price"].metaType = e;
                          setData({ ...data });
                        }}
                      >
                        <Select.Option value={"q"}>Quantidade</Select.Option>

                        <Select.Option value={"v"}>Valor</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <div className="uk-width-1-1">
                  <div className="uk-flex uk-flex-column">
                    <Form.Item
                      labelAlign="left"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <label>Comissão</label>
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        onChange={(val) => {
                          data["price"].commission = val;
                          setData({ ...data });
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="uk-width-1-1">
                  <div className="uk-flex uk-flex-column">
                    <Form.Item
                      labelAlign="left"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <label>Meta de venda</label>
                      <InputNumber
                        style={{ width: "100%" }}
                        onChange={(val) => {
                          data["price"].meta = val;
                          setData({ ...data });
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="uk-width-1-1">
                  <div className="uk-flex uk-flex-column">
                    <Form.Item
                      labelAlign="left"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <label>Comissão meta</label>
                      <InputNumber
                        style={{ width: "100%" }}
                        onChange={(val) => {
                          data["price"].commissionMeta = val;
                          setData({ ...data });
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </>
          )}
          <hr />
          <footer className="uk-flex uk-flex-right">
            <div className="uk-width-1-4 uk-flex uk-flex-around">
              <CustomButton
                htmlType="submit"
                type="primary"
                disabled={isLoading}
              >
                Salvar
              </CustomButton>
              <CustomButton onClick={() => setVisible(false)}>
                {" "}
                Voltar{" "}
              </CustomButton>
            </div>
          </footer>
        </form>
      </div>
    </Container>
  );
});

export default CreateProduct;
