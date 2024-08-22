// @ts-nocheck
import { memo, useState, useEffect, useCallback } from "react";

import { receiptService } from "@/OLD/services/receipt.service";

import { useFiscalData } from "@/OLD/hooks/useBills";
import { useRouter } from "next/router";
import { useReceipt, useReceiptProducts } from "@/OLD/hooks/useReceipts";
import { useColaborators } from "@/OLD/hooks/useColaborators";
import { usePlans } from "@/OLD/hooks/usePlans";

import PaymentsPanel from "../PaymentsPanel";
import { Container } from "./styles";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import { DatePicker } from "@mui/x-date-pickers";
import {
  AutoComplete,
  Select,
  Input,
  Checkbox,
  notification,
  Tabs,
} from "antd";
const { TabPane } = Tabs;

import moment from "moment";
import { sortItems } from "@/OLD/utils/sortItems";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { currencyFormatter } from "@/OLD/components/Budget";

function Single() {
  const [data, setData] = useState({});
  const [reload, setReload] = useState(false);
  const [ids, setIds] = useState({});
  const [values, setValues] = useState({});
  const [fiscalDataFilters, setFiscalDataFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [backConfirm, setBackConfirm] = useState({});

  const router = useRouter();

  const { receipt } = useReceipt(ids, reload);
  const { colaborators } = useColaborators();
  const { plans } = usePlans();
  const { products } = useReceiptProducts();
  const { fiscalData } = useFiscalData(fiscalDataFilters);

  sortItems(colaborators, "name");
  sortItems(plans, "description");
  sortItems(products, "description");

  useEffect(() => {
    setIds({ ids: [router.query.id], status: "PendenteXml" });
  }, [JSON.stringify(router.query.id)]);

  useEffect(() => {
    receipt?.length > 0 &&
      setFiscalDataFilters({ bill: receipt[0]?.id, type: "ENTRADA" });
  }, [receipt]);

  useEffect(() => {
    receipt?.length > 0 &&
      setData({ ...receipt[0], createdAt: moment(receipt[0]?.created_at) });
  }, [receipt]);

  useEffect(() => {
    if (backConfirm?.createReceiptProduct && backConfirm?.supplierProduct) {
      router.push("/dashboard/notas-entrada");
    }
  }, [backConfirm]);

  const createReceiptProduct = useCallback(() => {
    setLoading(true);

    receiptService
      .createReceiptProduct({
        receiptId: data?.id,
        receiptItemIds: data?.items
          ?.filter((product) => product?.newProduct)
          ?.map((product) => product?.id),
      })
      .then((_res) => {
        setBackConfirm((prv) => ({ ...prv, createReceiptProduct: true }));
        setLoading(false);
        setReload((prv) => !prv);
        return notification.success({
          message: "Produtos inseridos com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao salvar as informações da importação",
        });
      });
  }, [JSON.stringify(data)]);

  const createReceiptSupplierProduct = useCallback(() => {
    setLoading(true);

    receiptService
      .createSupplierProduct({
        receiptId: receipt[0]?.id,
        items: data?.items
          ?.filter((product) => product?.existingProduct)
          ?.map((product) => ({
            supplierId: data?.supplier?.id,
            productVariationId: product?.newProductId,
            productSupplier: product?.product_supplier_xml,
          })),
      })
      .then((_res) => {
        setBackConfirm((prv) => ({ ...prv, supplierProduct: true }));
        setLoading(false);
        setReload((prv) => !prv);
        return notification.success({
          message: "Produtos criados e vinculados com sucesso",
        });
      })
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao inserir os novos produtos",
        });
      });
  }, [JSON.stringify(data)]);

  const submitFinishReceipt = useCallback(() => {
    setLoading(true);

    receiptService
      ?.finishReceipt({ receiptId: receipt[0]?.id })
      .then((res) => {
        setReload((prv) => !prv);
        return notification.success({
          message: "Nota de entrada finalizada com sucesso",
        });
      })
      .catch((err) => {
        if (err?.response?.data?.code === "E_NO_VARIATION") {
          return notification.error({
            message:
              "Existem produtos da nota que ainda não foram relacionados",
          });
        }

        if (err?.response?.data?.message) {
          return notification.error({
            message: err?.response?.data?.message?.split(":")[1],
          });
        }
      });
  }, [receipt[0]?.id]);

  return (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Nota de entrada - Entrada via Xml</h3>
      <div className="uk-flex uk-margin-small-top" style={{ gap: "10px" }}>
        <div className="uk-width-1-5">
          <label>Código da entrada</label>
          <Input value={data?.tag} disabled />
        </div>
        <div className="uk-width-1-3">
          <label>Funcionário</label>
          <Input disabled value={receipt[0]?.seller?.name} />
        </div>
        <div>
          <label>Fornecedor</label>
          <Input disabled value={receipt[0]?.supplier?.name} />
        </div>
      </div>
      <section className="custom-header uk-margin-small-top">
        <div className="uk-flex" style={{ gap: "10px" }}>
          <div className="uk-width-1-2">
            <label>Chave Acesso Nfe</label>
            <Input value={fiscalData[0]?.access_key} disabled />
          </div>
          <div className="uk-width-1-5">
            <label>Nota fiscal</label>
            <Input value={fiscalData[0]?.sequence} disabled />
          </div>
          <div className="uk-width-1-5">
            <label>Modelo</label>
            <Input disabled value={fiscalData[0]?.model} />
          </div>
          <div className="uk-width-1-5">
            <label>Serie</label>
            <Input disabled value={fiscalData[0]?.series} />
          </div>
          <div>
            <label>Data Emissão</label>
            <br />
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              value={data?.createdAt}
              disabled
            />
          </div>
        </div>
      </section>
      <Tabs defaultActiveKey="1">
        <TabPane key="1" tab="Produtos" className="custom-tab uk-padding-small">
          <h4 className="uk-heading-line uk-margin-small-top">
            <span>Produtos</span>
          </h4>
          {data?.items?.map((item, i) => (
            <div>
              <div
                className={`${
                  item?.productVariation?.product?.description &&
                  "custom-background"
                } uk-padding-small uk-margin-small-top`}
              >
                <section className="uk-flex" style={{ gap: "10px" }}>
                  <div className="uk-width-1-2">
                    <label>Descrição Produto - XML</label>
                    <Input disabled value={item?.description_xml} />
                  </div>
                  <div className="uk-width-1-2">
                    <label>Código de barras - XML</label>
                    <Input disabled value={item?.barcode_xml} />
                  </div>
                  <div className="uk-width-1-5">
                    <label>R$ Unit</label>
                    <Input
                      disabled
                      value={currencyFormatter(item?.unitary_value)}
                    />
                  </div>
                  <div className="uk-width-1-5">
                    <label>Qtd</label>
                    <Input disabled value={item?.quantity} />
                  </div>
                  <div className="uk-width-1-5">
                    <label>R$ Desconto</label>
                    <Input
                      disabled
                      value={currencyFormatter(item?.discount_value)}
                    />
                  </div>
                  <div className="uk-width-1-5">
                    <label>R$ Total</label>
                    <Input
                      disabled
                      value={currencyFormatter(item?.total_value)}
                    />
                  </div>
                </section>

                <section
                  className="uk-margin-small-top uk-flex"
                  style={{ gap: "10px" }}
                >
                  <div className="uk-width-1-2">
                    <label>Produto encontrado:</label>
                    <Input
                      className="uk-width-1-1"
                      disabled
                      value={item?.productVariation?.product?.description}
                    />
                  </div>
                  {!item?.productVariation && (
                    <>
                      <div className="uk-width-1-2">
                        <label>Relacionar Produto</label>
                        <AutoComplete
                          className="uk-width-1-1"
                          disabled={item?.newProduct}
                          onChange={() => {
                            let newArr = [...data?.items];
                            newArr.splice(i, 1, {
                              ...data?.items[i],
                              existingProduct: true,
                            });
                            setData({ ...data, items: newArr });
                          }}
                          onSelect={(_, opt) => {
                            let newArr = [...data?.items];
                            newArr.splice(i, 1, {
                              ...data?.items[i],
                              existingProduct: true,
                              newProductId: opt?.id,
                            });
                            setData({ ...data, items: newArr });
                          }}
                          options={products?.map((product) => ({
                            ...product,
                            value: product?.description,
                          }))}
                          filterOption={(val, opt) =>
                            normalizeStr(opt?.value.toUpperCase()).includes(
                              normalizeStr(val?.toUpperCase())
                            )
                          }
                        />
                      </div>
                      <div>
                        <label>Inserir produto no cadastro</label>&nbsp;
                        <Checkbox
                          disabled={item?.existingProduct}
                          onChange={(e) => {
                            let newArr = [...data?.items];
                            newArr.splice(i, 1, {
                              ...data?.items[i],
                              newProduct: e.target.checked,
                            });
                            setData({ ...data, items: newArr });
                          }}
                          checked={item?.newProduct}
                        />
                      </div>
                    </>
                  )}
                </section>
              </div>
              <hr />
            </div>
          ))}
          <footer className="uk-flex uk-flex-right">
            <CustomButton
              classCallback="uk-margin-small-right"
              onClick={() => router.back()}
            >
              Voltar
            </CustomButton>
            <CustomButton
              classCallback="uk-margin-small-right"
              onClick={() => submitFinishReceipt()}
            >
              Finalizar Entrada
            </CustomButton>
            <CustomButton
              onClick={() => {
                data?.items?.filter((product) => product?.existingProduct)
                  ?.length > 0
                  ? createReceiptSupplierProduct()
                  : setBackConfirm((prv) => ({
                      ...prv,
                      supplierProduct: true,
                    }));

                data?.items?.filter((product) => product?.newProduct)?.length >
                0
                  ? createReceiptProduct()
                  : setBackConfirm((prv) => ({
                      ...prv,
                      createReceiptProduct: true,
                    }));
              }}
            >
              Salvar
            </CustomButton>
          </footer>
        </TabPane>
        <TabPane
          key="2"
          tab="Pagamentos"
          className="custom-tab uk-padding-small"
        >
          <h4 className="uk-heading-line uk-margin-small-top">
            <span>Pagamentos</span>
          </h4>
          <PaymentsPanel
            receipt={receipt[0]}
            payments={data?.payments}
            reload={reload}
            setReload={setReload}
          />
        </TabPane>
      </Tabs>
    </Container>
  );
}

export default Single;
