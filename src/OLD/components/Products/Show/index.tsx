// @ts-nocheck
// Core
import { memo, useState, useEffect, useCallback } from "react";

// Services
import { productVariationsService } from "@/OLD/services/product-variations.service";
import { productService } from "@/OLD/services/product.service";

// Hooks
import { useSubgroups } from "@/OLD/hooks/useSubgroup";
import { useTaxationGroups } from "@/OLD/hooks/useTaxationGroups";
import { useUnits } from "@/OLD/hooks/useProducts";

// Utils
import moment from "moment";
import "moment/locale/pt-br";
import { sortItems } from "@/OLD/utils/sortItems";
import { normalizeStr } from "@/OLD/utils/normalizeString";

// Icons
import { FiEdit2 } from "react-icons/fi";

// Components
import { Col, Input, Row, Switch, Table, AutoComplete, Select } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { Button, useToast } from "infinity-forge";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@/presentation/use-query";
import { Container } from "../styles";
import CreateProductVariation from "./create-variation";
import UpdateBusinessUnitProduct from "./edit";
const { Option } = Select;

const icmsDescription = [
  {
    value: "0",
    label: "0 : Nacional - exceto as indicadas nos códigos 3 a 5 ",
  },
  {
    value: "1",
    label: "1 : Estrangeira - Importação direta, exceto a indicada no código 6",
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
      "7 : Estrangeira - Adquirida no mercado interno, sem similar nacional, constante em lista de Resolução CAMEX",
  },
  {
    value: "8",
    label:
      "8 : Nacional - Mercadoria ou bem com Conteúdo de Importação superior a 70% (setenta por cento).",
  },
];

const ShowProduct = memo(function ShowProduct({ id, setVisible, setReload }) {
  // const { query, isReady } = useRouter();

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [create, setCreate] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [loading, setLoading] = useState(false);

  const { subgroups } = useSubgroups();
  const { taxationGroups } = useTaxationGroups();
  const { units } = useUnits("PRODUCT");

  sortItems(subgroups, "description");
  sortItems(taxationGroups, "name");
  sortItems(units, "name");
  const { createToast } = useToast();

  const { data, error, refetch } = useQuery({
    queryKey: ["products", id],
    queryFn: () => productService.showProduct(id),
  });

  const { mutate, isLoading } = useMutation({
    queryKey: ["ShowProduct"],
    queryFn: ({ id, data }) => {
      return productVariationsService.updateProductVariation(id, data);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleChangeStatus = (data) => {
    mutate({
      id: data.id,
      data: {
        productId: data.product_id,
        active: !data.active,
        barcode: data.barcode,
      },
    });
  };

  useEffect(() => {
    setUpdateData({
      courtesy: data?.courtesy,
      description: data?.description,
      referenceCode: data?.reference_code,
      collectionYear: data?.collection_year,
      active: data?.active,
      subgroupId: data?.subgroup?.id,
      subgroupDescription: data?.subgroup?.description,
      unitId: data?.unit?.id,
      purpose: data?.purpose,
      ncm: data?.ncm,
      cest: data?.cest,
      taxationGroupId: data?.taxationGroup?.id,
      taxationGroupDescription: data?.taxationGroup?.name,
      icmsOrigin: data?.icms_origin,
      features: data?.features,
      fractioned: data?.fractioned,
      fractionUnitId: data?.fractionUnit?.id,
      fractionUnitDescription: data?.fractionUnit?.name,
      fractionValue: data?.fraction_value,
    });
  }, [data]);

  const verifyFields = (fields) => {
    if (fields.includes("purpose")) {
      return createToast({
        message: "Informe o propósito do produto",
        status: "warning",
      });
    }

    if (fields.includes("icmsOrigin")) {
      return createToast({
        message: "Informe a origem icms",
        status: "warning",
      });
    }
  };

  const submitUpdate = useCallback(() => {
    setLoading(true);

    productService
      .updateProduct(data?.id, {
        ...updateData,
        collectionYear: updateData?.collectionYear
          ? moment(updateData?.collectionYear).format("YYYY")
          : null,
      })
      ?.then((res) => {
        setLoading(false);
        setVisible(false);
        return createToast({
          message: "Produto atualizado com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        verifyFields(err.response.data.errors.map((msg) => msg.field));
      });

    setReload((prv) => !prv);
  }, [updateData, data]);

  return (
    <Container>
      <div className="uk-flex uk-flex-between">
        {!!data && (
          <h2 className="uk-margin-remove">Produto - {data.description}</h2>
        )}
        {!!error && (
          <div className="uk-alert-danger" uk-alert="true">
            <p>{error.message}</p>
          </div>
        )}
        {!!data && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <Button onClick={submitUpdate} text="Salvar" />

            <Button onClick={() => setVisible(false)} text="Voltar" />
          </div>
        )}
      </div>

      {!!data && (
        <div className="uk-margin-small-top">
          <Row gutter={{ xs: 3, sm: 7, md: 10, lg: 15 }}>
            <Col span={12}>
              <div className="uk-flex uk-flex-column">
                <span>Descrição</span>
                <Input
                  value={updateData.description}
                  onChange={(e) =>
                    setUpdateData((prv) => ({
                      ...prv,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </Col>
            {/*
            <Col span={4}>
              <div className="uk-flex uk-flex-column">
                <span>Tipo</span>
                <Input
                  value={data.type === "product" ? "Produto" : "Serviço"}
                  readOnly
                />
              </div>
            </Col>
              */}
            <Col span={4} />
            <Col span={4}>
              <div className="uk-flex uk-flex-column">
                <span>Data de Criação</span>
                <Input
                  value={moment(data?.created_at).format("DD/MM/YYYY - HH:mm")}
                  disabled
                />
              </div>
            </Col>
            <Col span={2}>
              <div className="uk-flex ">
                <div className="">
                  <span>Cortesia</span>&nbsp;
                  <br />
                  <Switch
                    checked={updateData?.courtesy}
                    onChange={(val) => {
                      setUpdateData((prv) => ({
                        ...prv,
                        courtesy: val,
                      }));
                    }}
                  />
                </div>
              </div>
            </Col>
            <Col span={2}>
              <div className="uk-flex uk-flex-column">
                <div className="">
                  <span>Ativo</span>&nbsp;
                  <br />
                  <Switch
                    checked={updateData?.active}
                    onChange={(val) => {
                      setUpdateData((prv) => ({
                        ...prv,
                        active: val,
                      }));
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <div className="uk-margin-small-top">
            <Row gutter={{ xs: 3, sm: 7, md: 10, lg: 15 }}>
              <Col span={8}>
                <div className="uk-flex uk-flex-column">
                  <span>Subgrupo</span>
                  <AutoComplete
                    className="uk-width-1-1"
                    options={subgroups?.map((sub) => ({
                      ...sub,
                      value: sub?.description,
                    }))}
                    value={updateData?.subgroupDescription}
                    onChange={(val) =>
                      setUpdateData((prv) => ({
                        ...prv,
                        subgroupDescription: val,
                      }))
                    }
                    onSelect={(_, opt) =>
                      setUpdateData((prv) => ({
                        ...prv,
                        subgroupId: opt?.id,
                        subgroupDescription: opt?.value,
                      }))
                    }
                    filterOption={(val, opt) =>
                      normalizeStr(opt?.value?.toUpperCase()).includes(
                        normalizeStr(val?.toUpperCase())
                      )
                    }
                  />
                </div>
              </Col>
              <Col span={9} className="">
                <span>Proposito</span>
                <Select
                  className="uk-width-1-1"
                  value={updateData?.purpose}
                  onChange={(val) =>
                    setUpdateData((prv) => ({ ...prv, purpose: val }))
                  }
                >
                  <Select.Option value="internal">
                    Apenas consumo interno
                  </Select.Option>
                  <Select.Option value="sale">Apenas venda</Select.Option>
                  <Select.Option value="both">
                    Venda e consumo interno
                  </Select.Option>
                </Select>
              </Col>
              <Col span={3}>
                <div className="uk-flex uk-flex-column">
                  <span>Cód. Referência</span>
                  <Input
                    value={updateData.referenceCode}
                    onChange={(e) =>
                      setUpdateData((prv) => ({
                        ...prv,
                        referenceCode: e.target.value,
                      }))
                    }
                  />
                </div>
              </Col>
              <Col span={3}>
                <div className="uk-flex uk-flex-column">
                  <span>Ano Referência</span>
                  <Input
                    type="number"
                    value={updateData?.collectionYear}
                    onChange={(e) =>
                      setUpdateData((prv) => ({
                        ...prv,
                        collectionYear: e.target.value,
                      }))
                    }
                  />
                </div>
              </Col>
            </Row>
            <Row
              gutter={{ xs: 3, sm: 7, md: 10, lg: 15 }}
              className="uk-margin-small-top"
            >
              <Col span={4}>
                <div className="uk-flex uk-flex-column">
                  <span>Tipo de Unidade</span>
                  <Select
                    value={updateData?.unitId}
                    onChange={(val) =>
                      setUpdateData((prv) => ({ ...prv, unitId: val }))
                    }
                  >
                    {units?.map((unit) => (
                      <Option value={unit?.id}>{unit?.name}</Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <div className="uk-width-1-3 uk-margin-small-right">
                <label>Produto fracionado</label>
                <Select
                  className="uk-width-1-1"
                  value={updateData?.fractioned}
                  onChange={(val) =>
                    setUpdateData({ ...updateData, fractioned: val })
                  }
                >
                  <Option value={true}>Sim</Option>
                  <Option value={false}>Não</Option>
                </Select>
              </div>
              {updateData?.fractioned && (
                <>
                  <div className="uk-width-1-3">
                    <label>Unidade fracionamento</label>
                    <AutoComplete
                      className="uk-width-1-1"
                      options={units?.map((unit) => ({
                        ...unit,
                        value: unit?.name,
                      }))}
                      value={updateData?.fractionUnitDescription}
                      onChange={(val) =>
                        setUpdateData({
                          ...updateData,
                          fractionUnitDescription: val,
                        })
                      }
                      onSelect={(_, opt) =>
                        setUpdateData({
                          ...updateData,
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
                  <Col span={3}>
                    <label>Qtd Embalagem</label>
                    <Input
                      value={updateData?.fractionValue}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          fractionValue: e.target.value,
                        })
                      }
                    />
                  </Col>
                </>
              )}
            </Row>
            <Row
              gutter={{ xs: 3, sm: 7, md: 10, lg: 15 }}
              className="uk-margin-small-top"
            >
              <Col span={8}>
                <div className="uk-flex uk-flex-column">
                  <span>Grupo de Tributação</span>
                  <AutoComplete
                    value={updateData?.taxationGroupDescription}
                    options={taxationGroups?.map((group) => ({
                      ...group,
                      value: group?.name,
                    }))}
                    onChange={(val) =>
                      setUpdateData((prv) => ({
                        ...prv,
                        taxationGroupDescription: val,
                      }))
                    }
                    onSelect={(_, opt) =>
                      setUpdateData((prv) => ({
                        ...prv,
                        taxationGroupId: opt?.id,
                        taxationGroupDescription: opt?.value,
                      }))
                    }
                    filterOption={(val, opt) =>
                      normalizeStr(opt?.value?.toUpperCase()).includes(
                        normalizeStr(val.toUpperCase())
                      )
                    }
                  />
                </div>
              </Col>
              <Col span={3}>
                <div className="uk-flex uk-flex-column">
                  <span>NCM</span>
                  <Input
                    value={updateData?.ncm}
                    onChange={(e) =>
                      setUpdateData((prv) => ({ ...prv, ncm: e.target.value }))
                    }
                  />
                </div>
              </Col>
              <Col span={3}>
                <div className="uk-flex uk-flex-column">
                  <span>CEST</span>
                  <Input
                    value={updateData?.cest}
                    onChange={(e) =>
                      setUpdateData((prv) => ({ ...prv, cest: e.target.value }))
                    }
                  />
                </div>
              </Col>
              <Col span={18}>
                <div className="uk-flex uk-flex-column uk-margin-small-top">
                  <span>Origem Icms Produto</span>
                  <Select
                    value={updateData?.icmsOrigin}
                    onChange={(val) =>
                      setUpdateData((prv) => ({ ...prv, icmsOrigin: val }))
                    }
                  >
                    {icmsDescription?.map((item) => (
                      <Option value={item?.value}>{item?.label}</Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>
            <div className="uk-width-1-1 uk-margin-small-top">
              <span>Características</span>
              <Input
                value={updateData?.features}
                onChange={(e) =>
                  setUpdateData((prv) => ({ ...prv, features: e.target.value }))
                }
              />
            </div>
          </div>

          <hr />

          <div className="uk-flex uk-flex-column uk-margin-small-top">
            <span>Grupo de Variação</span>
            <span>{data?.variationGroup?.description}</span>
            <Button
              onClick={() => setCreate(true)}
              text="Criar nova variação"
            />

            <div className={"uk-margin-small-top"}>
              {data.variations.map((variation) => (
                <>
                  <div className="uk-flex uk-flex-column uk-margin-small-top">
                    <span>Código de barras: {variation.barcode}</span>
                  </div>

                  <div className="uk-flex uk-flex-column uk-margin-small-top">
                    <span>
                      Status:{" "}
                      <Switch
                        checkedChildren={"Ativo"}
                        unCheckedChildren={"Desativado"}
                        checked={variation?.active}
                        onChange={() => handleChangeStatus(variation)}
                        disabled={isLoading}
                      />
                    </span>
                  </div>

                  <div className="uk-flex uk-flex-column uk-margin-small-top">
                    <span>
                      Variações:{" "}
                      {variation.variationOptions
                        .map((v) => v.description)
                        .join(" | ")}
                    </span>
                    <div className="uk-margin-small-top">
                      <Table
                        columns={columns}
                        dataSource={mapData(variation.businessUnitProducts).map(
                          (d) => ({
                            ...d,
                            actions: (
                              <div className="uk-flex uk-flex-around">
                                <FiEdit2
                                  onClick={() => {
                                    setSelectedPrice(d);
                                  }}
                                  style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                                />
                              </div>
                            ),
                          })
                        )}
                      />
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      )}

      <CreateProductVariation
        visible={create}
        initialData={{
          productId: id,
          variationGroupId: data?.variationGroup?.id,
        }}
        close={() => {
          setCreate(false);
          refetch();
        }}
      />

      <UpdateBusinessUnitProduct
        visible={!!selectedPrice}
        initialData={selectedPrice}
        id={selectedPrice?.id}
        close={() => {
          setSelectedPrice(null);
          refetch();
        }}
      />
    </Container>
  );
});

export default ShowProduct;

const columns = [
  {
    title: "Unidade",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Estoque",
    dataIndex: "stock",
    key: "stock",
  },
  {
    title: "Est. Min.",
    dataIndex: "minStock",
    key: "minStock",
  },
  {
    title: "Est. Max.",
    dataIndex: "maxStock",
    key: "maxStock",
  },

  {
    title: "Desc. Max. (%)",
    dataIndex: "maxPercentageDiscount",
    key: "maxPercentageDiscount",
  },
  {
    title: "Desc. Max. (R$)",
    dataIndex: "maxValueDiscount",
    key: "maxValueDiscount",
  },

  {
    title: "Preço Custo",
    dataIndex: "cost",
    key: "cost",
  },
  {
    title: "% Margem Lucro",
    dataIndex: "profitMargin",
    key: "profitMargin",
  },
  {
    title: "Preço Venda",
    dataIndex: "price",
    key: "price",
  },

  {
    title: "Tipo de Meta",
    dataIndex: "metaType",
    key: "metaType",
  },
  {
    title: "Comissão",
    dataIndex: "commission",
    key: "commission",
  },
  {
    title: "Meta",
    dataIndex: "meta",
    key: "meta",
  },
  {
    title: "Comissão Meta",
    dataIndex: "commissionMeta",
    key: "commissionMeta",
  },
  {
    title: "Ações",
    dataIndex: "actions",
    key: "actions",
  },
];

const mapData = (data) => {
  const result = [];

  for (const product of data) {
    result.push({
      id: product.id,
      name: product.businessUnit.fantasy_name,
      stock: product.stock,
      maxStock: product.maximum_stock,
      minStock: product.minimum_stock,
      maxPercentageDiscount: product.maximum_discount_percentage,
      maxValueDiscount: product.maximum_discount_value,
      price: product.price,
      cost: product.cost_price,
      profitMargin: product.profit_margin,
      commission: product.commission,
      metaType: product.meta_type === "q" ? "Quantidade" : "Valor",
      meta: product.meta,
      commissionMeta: product.commission_meta,
      productVariationId: product.product_variation_id,
      businessUnitId: product.businness_unit_id,
    });
  }

  sortItems(result, "name");

  return result;
};
