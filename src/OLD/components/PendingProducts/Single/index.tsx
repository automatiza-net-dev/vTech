// @ts-nocheck
import { useCallback, useEffect, useState } from "react";

import { receiptService } from "@/OLD/services/receipt.service";

import styled from "styled-components";

import { useRouter } from "next/router";

import { Button, useToast } from "infinity-forge";
import { Input, AutoComplete, Select, Checkbox } from "antd";

const { Option } = Select;

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { sortItems } from "@/OLD/utils/sortItems";
import { normalizeStr } from "@/OLD/utils/normalizeString";

export const Container = styled.div`
  .custom-container {
    background-color: #ffffff;
    border-radius: 5px;
    margin-top: 20px;
    padding: 20px;
  }
`;

const verifyFields = (arr) => {
  let verification = "";

  if (arr?.length === 0) {
    verification = "Lista de produtos para atualização vazia";
  } else {
    arr?.map((item) => {
      if (!item?.price) {
        verification = `Preço de venda obrigatório - Produto ${item?.productDescription}`;
      }

      if (!item?.purpose) {
        verification = ` Propósito do produto obrigatória - Produto ${item?.productDescription} `;
      }

      if (!item?.unitId) {
        verification = `Unidade obrigatória - Produto ${item?.productDescription}`;
      }

      if (!item?.subgroupId) {
        verification = `Subgrupo obrigatório - Produto ${item?.productDescription}`;
      }

      if (!item?.taxationGroupId) {
        verification = `Grupo de tributação obrigatório - Produto ${item?.productDescription}`;
      }

      if (!item?.icmsOrigin) {
        verification = `Origem de ICMS obrigatória - Produto ${item?.productDescription}`;
      }
    });
  }

  return verification;
};

export function SinglePendingProducts({
  receipt,
  taxationGroups,
  units,
  subgroups,
}) {
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [data, setData] = useState([]);

  const router = useRouter();

  sortItems(units, name);
  sortItems(subgroups, "description");

  const formatItems = () => {
    setData(
      receipt?.items?.map((item) => ({
        qtdEntrada: item?.quantity,
        productDescription: item?.productVariation?.product?.description,
        productId: item?.productVariation?.product?.id,
        productVariationId: item?.productVariation?.id,
        referenceCode: item?.productVariation?.product?.reference_code,
        taxationGroupId: item?.productVariation?.product?.taxationGroup?.id,
        subgroupId: item?.productVariation?.product?.subgroup?.id,
        unitId: item?.productVariation?.product?.unit?.id,
        purpose: item?.productVariation?.product?.purpose,
        minimumStock:
          item?.productVariation?.businessUnitProducts[0]?.minimum_stock || 0,
        maximumStock:
          item?.productVariation?.businessUnitProducts[0]?.maximum_stock || 0,
        originalPrice:
          item?.productVariation?.businessUnitProducts[0]?.cost_price || 0,
        costPrice: currencyFormatter(
          item?.productVariation?.businessUnitProducts[0]?.cost_price || 0,
        ),
        profitMargin:
          item?.productVariation?.businessUnitProducts[0]?.profit_margin || 0,
        price: currencyFormatter(
          item?.productVariation?.businessUnitProducts[0]?.price || 0,
        ),
        maximumDiscountPercentage:
          item?.productVariation?.businessUnitProducts[0]
            ?.maximum_discount_percentage || 100,
        metaType:
          item?.productVariation?.businessUnitProducts[0]?.meta_type || "v",
        commission:
          item?.productVariation?.businessUnitProducts[0]?.commission || 0,
        meta: item?.productVariation?.businessUnitProducts[0]?.meta || 0,
        commissionMeta:
          item?.productVariation?.businessUnitProducts[0]?.commission_meta || 0,
        ncm: item?.productVariation?.product?.ncm,
        fractionValue: item?.productVariation?.product?.fraction_value || 0,
      })),
    );
  };

  useEffect(() => {
    receipt && formatItems();
  }, [receipt]);

  const { createToast } = useToast();

  const submitUpdateProducts = useCallback(() => {
    try {
      const items = data?.filter((item) => item?.sendUpdate);
      const verify = verifyFields(items);

      !verify
        ? receiptService
            .updateXmlItems({
              receiptId: receipt?.id,
              items: items?.map((item) => ({
                ...item,
                costPrice: convertIntlCurrency(item.costPrice),
                price: convertIntlCurrency(item?.price),
                fractioned: undefined,
                fractionUnitId: undefined,
                fracionUnitDescription: undefined,
                fractionValue: undefined,
              })),
            })
            .then((res) => {
              router.back();
              setLoading(false);
              setReload((prv) => !prv);

              createToast({
                status: "success",
                message: "Produtos atualizados com sucesso",
              });
            })
            .catch((err) => {
              setLoading(false);

              createToast({
                status: "error",
                message: "Houve um erro ao atualizar os produtos",
              });
            })
        : createToast({ status: "error", message: verify });
    } catch (err) {
      console.log(err);
    }
  }, [data]);

  return (
    <Container className="uk-padding-small">
      <section className="custom-container uk-shadow-small">
        {data?.length > 0 &&
          data?.map((item, i) => (
            <div key={i}>
              <div
                className="uk-flex"
                style={{ border: "2px solid gray", padding: "16px" }}
              >
                <div>
                  <div className="uk-flex" style={{ gap: "5px" }}>
                    <div className="uk-width-1-2">
                      <label>Descrição do produto</label>
                      <Input
                        value={item?.productDescription}
                        className="uk-width-1-1"
                        onChange={(val) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            productDescription: val?.target.value,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      />
                    </div>
                    <div className="uk-width-1-6">
                      <label>Referência</label>
                      <Input
                        value={item?.referenceCode}
                        onChange={(e) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            referenceCode: e.target.value,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      />
                    </div>
                    <div className="uk-width-1-4">
                      <label>Propósito do produto*</label>
                      <Select
                        className="uk-width-1-1"
                        value={item?.purpose}
                        onChange={(val) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            purpose: val,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      >
                        <Option value="sale">Apenas venda</Option>
                        <Option value="internal">Apenas consumo interno</Option>
                        <Option value="both">Venda e consumo interno</Option>
                      </Select>
                    </div>
                    <div className="uk-width-1-5">
                      <label>Subgrupo*</label>
                      <AutoComplete
                        className="uk-width-1-1"
                        options={subgroups.map((subgroup) => ({
                          ...subgroup,
                          value: subgroup?.description,
                          key: subgroup?.id,
                        }))}
                        value={item?.subgroupDescription}
                        onChange={(val) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            subgroupDescription: val,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                        onSelect={(_, opt) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            subgroupDescription: opt?.value,
                            subgroupId: opt?.id,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                        filterOption={(val, opt) =>
                          normalizeStr(opt?.value.toUpperCase()).includes(
                            normalizeStr(val?.toUpperCase()),
                          )
                        }
                      />
                    </div>
                    <div className="uk-width-1-3">
                      <label>Unidade*</label>

                      <AutoComplete
                        className="uk-width-1-1"
                        options={units?.map((unit) => ({
                          ...unit,
                          value: unit?.name,
                          key: unit?.id,
                        }))}
                        value={item?.unitDescription}
                        onChange={(val, option) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            unitId: option.id,
                            unitDescription: option.description,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                        onSelect={(_, opt) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            unitId: opt?.id,
                            unitDescription: opt?.description,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                        filterOption={(val, opt) =>
                          normalizeStr(opt?.value.toUpperCase()).includes(
                            normalizeStr(val?.toUpperCase()),
                          )
                        }
                      />
                    </div>
                  </div>
                  <div
                    className="uk-flex uk-margin-small-top"
                    style={{ gap: "5px" }}
                  >
                    <div className="uk-width-1-4">
                      <label>Grupo tributação*</label>
                      <AutoComplete
                        className="uk-width-1-1"
                        options={taxationGroups?.map((group) => ({
                          ...group,
                          value: group?.name,
                        }))}
                        value={item?.taxationGroupDescription}
                        onChange={(val) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            taxationGroupDescription: val,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                        onSelect={(_, opt) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            taxationGroupDescription: opt?.value,
                            taxationGroupId: opt?.id,
                          });
                          setData(arr);
                        }}
                        filterOption={(value, option) =>
                          normalizeStr(option?.name?.toUpperCase()).includes(
                            normalizeStr(value?.toUpperCase()),
                          )
                        }
                      />
                    </div>

                    <div className="uk-width-1-5 uk-margin-small-right">
                      <label>Código NCM</label>
                      <Input
                        value={item?.ncm}
                        className="uk-width-1-1"
                        onChange={(val) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            ncm: val?.target.value,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      />
                    </div>
                    <div className="uk-width-1-5 uk-margin-small-right">
                      <label>Código CEST</label>
                      <Input
                        value={item?.cest}
                        className="uk-width-1-1"
                        onChange={(val) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            cest: val?.target.value,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      />
                    </div>

                    <div className="uk-width-1-3 uk-margin-small-right">
                      <label>Origem Icms*</label>
                      <Select
                        className="uk-width-1-1"
                        value={item?.icmsOrigin}
                        onChange={(val) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            icmsOrigin: val,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
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
                        ].map((opt) => (
                          <Option value={opt.value} key={`opt-${opt.value}`}>
                            {opt.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div
                    className="uk-flex uk-margin-small-top"
                    style={{ gap: "5px" }}
                  >
                    <div className="uk-width-1-6">
                      <label>Qtd Entrada</label>
                      <Input
                        value={item?.qtdEntrada}
                        type="number"
                        disabled
                        onChange={(e) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            qtdEntrada: e.target.value,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      />
                    </div>
                    <div className="uk-width-1-6">
                      <label>R$ Custo Embalagem</label>
                      <Input
                        value={item?.costPrice}
                        onChange={(e) => {
                          let arr = [...data];
                          const newCost = currencyFormatter(
                            convertIntlCurrency(e.target.value),
                          );

                          const cost = convertIntlCurrency(newCost) || 0;
                          const margin = parseFloat(item?.profitMargin) || 0;
                          const price = cost * (1 + margin / 100);
                          const profitMargin = cost
                            ? ((price - cost) / cost) * 100
                            : 0;

                          arr.splice(i, 1, {
                            ...item,
                            costPrice: newCost,
                            originalPrice: convertIntlCurrency(e.target.value),
                            price: currencyFormatter(price.toFixed(2)),
                            profitMargin: profitMargin.toFixed(2),
                            sendUpdate: true,
                          });

                          setData(arr);
                        }}
                      />
                    </div>

                    <div className="uk-width-1-6">
                      <label>Qtd Embalag.</label>
                      <Input value={item?.fractionValue ?? 0} readOnly />
                    </div>

                    <div className="uk-width-1-6">
                      <label>Custo Unit.</label>
                      <Input
                        value={currencyFormatter(
                          item?.fractionValue && item?.originalPrice
                            ? item.originalPrice / item.fractionValue
                            : 0,
                        )}
                        readOnly
                      />
                    </div>

                    <div className="uk-width-1-6">
                      <label>% Margem</label>
                      <Input
                        value={item?.profitMargin}
                        onChange={(e) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            profitMargin: e.target.value,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      />
                    </div>

                    <div className="uk-width-1-6">
                      <label>R$ Venda*</label>
                      <Input
                        value={item?.price}
                        onChange={(e) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            price: currencyFormatter(
                              convertIntlCurrency(e.target.value),
                            ),
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                        onBlur={() => {
                          let arr = [...data];
                          const cost =
                            convertIntlCurrency(item?.costPrice) || 0;
                          const price = convertIntlCurrency(item?.price) || 0;
                          const margin = cost
                            ? ((price - cost) / cost) * 100
                            : 0;

                          arr.splice(i, 1, {
                            ...item,
                            profitMargin: margin.toFixed(2),
                            sendUpdate: true,
                          });

                          setData(arr);
                        }}
                      />
                    </div>

                    <div className="uk-width-1-5">
                      <label>Desconto Max. (%)</label>
                      <Input
                        value={item?.maximumDiscountPercentage}
                        onChange={(e) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            maximumDiscountPercentage: e.target.value,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="uk-flex uk-margin-small-top"
                    style={{ gap: "5px" }}
                  >
                    <div className="uk-width-1-6">
                      <label>Estoque Min</label>
                      <Input
                        value={item?.minimumStock}
                        onChange={(e) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            minimumStock: e.target.value,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      />
                    </div>
                    <div className="uk-width-1-6">
                      <label>Estoque Máx</label>
                      <Input
                        value={item?.maximumStock}
                        onChange={(e) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            maximumStock: e.target.value,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      />
                    </div>

                    <div className="uk-width-1-4">
                      <label>Tipo meta</label>
                      <Select
                        className="uk-width-1-1"
                        value={item?.metaType}
                        onChange={(val) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            metaType: val,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      >
                        <Option value="q">Quantidade</Option>
                        <Option value="v">Valor</Option>
                      </Select>
                    </div>
                    <div className="uk-width-1-6">
                      <label>Comissão</label>
                      <Input
                        value={item?.commission}
                        onChange={(e) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            commission: e.target.value,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      />
                    </div>
                    <div className="uk-width-1-6">
                      <label>Meta</label>
                      <Input
                        value={item?.meta}
                        onChange={(e) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            meta: e.target.value,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      />
                    </div>
                    <div className="uk-width-1-4">
                      <label>Comissão meta</label>
                      <Input
                        value={item?.commissionMeta}
                        onChange={(e) => {
                          let arr = [...data];
                          arr.splice(i, 1, {
                            ...item,
                            commissionMeta: e.target.value,
                            sendUpdate: true,
                          });
                          setData(arr);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Checkbox
                    className="uk-margin-top uk-margin-left"
                    checked={item?.sendUpdate}
                    onChange={(e) => {
                      let arr = [...data];
                      arr.splice(i, 1, {
                        ...item,
                        sendUpdate: e.target.checked,
                      });
                      setData(arr);
                    }}
                  />
                </div>
              </div>
              <hr />
            </div>
          ))}
      </section>
      <footer
        style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
      >
        <Button text="Cancelar" onClick={() => router.back()} />

        <Button onClick={() => submitUpdateProducts()} text="Salvar" />
      </footer>
    </Container>
  );
}
