// @ts-nocheck
import { budgetService } from "@/OLD/services/budgets.service";
import { productService } from "@/OLD/services/product.service";

import {
  Button,
  Input,
  notification,
  Modal,
  AutoComplete,
  Table,
  Tooltip,
  Popconfirm,
  Tabs,
} from "antd";
const { TextArea } = Input;
import * as React from "react";
import { GrAddCircle } from "react-icons/gr";
import { DeleteTwoTone } from "@ant-design/icons";
import { useQueryClient } from "react-query";
import { currencyFormatter } from "..";
import Negotiation from "@/OLD/components/Budget/Negotiation";
const { TabPane } = Tabs;

import {
  useBudgetProducts,
  useCompleteBudget,
  useCreateBudgetItem,
} from "@/OLD/hooks/useBudgets";
import { useUserHasPermission, useProfile } from "@/OLD/hooks/useProfile";

import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import Masks from "@/OLD/utils/masks";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";
import { useDictionary } from "@/presentation";

const columns = [
  {
    title: "Produto",
    dataIndex: "product",
    key: "product",
  },
  {
    title: "Quantidade",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Valor",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Desconto",
    dataIndex: "discount",
    key: "discount",
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
  },
  {
    title: "Remover",
    dataIndex: "remove",
    key: "remove",
  },
];

export default function AddBudgetItem({
  budget,
  setReload,
  tableRender,
  externVisible,
  setExternVisible,
}) {
  const queryClient = useQueryClient();
  const [visible, setVisible] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [observation, setObservation] = React.useState("Sem observações");
  const [internalObservation, setInternalObservation] =
    React.useState("Sem observações");
  const [multipleProducts, setMultipleProducts] = React.useState([]);
  const [values, setValues] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [productType, setProductType] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("0");

  const { data, refetch } = useCompleteBudget(
    budget.id,
    tableRender ? visible : externVisible
  );
  const { data: products } = useBudgetProducts(
    tableRender ? visible : externVisible
  );
  const { isLoading } = useCreateBudgetItem();
  const { clinic } = useProfile();

  const addItemPermission = useUserHasPermission("ORC02");
  const removeItemPermission = useUserHasPermission("ORC07");

  React.useEffect(() => {
    data?.observation && setObservation(data?.observation);
    data?.internal_observation &&
      setInternalObservation(data?.internal_observation);
  }, [data]);

  const { getWord } = useDictionary()

  const validBudget =
    budget.status === "ABERTO" || budget.status === `${getWord("Orçamento")} em aberto`;

  const submitObservation = React.useCallback(() => {
    budgetService.updateObservation(data?.id, {
      observation,
      internalObservation,
    });
  }, [observation, internalObservation]);

  const submit = React.useCallback(() => {
    if (!validBudget) {
      return;
    }

    setLoading(true);

    budgetService
      .createMultipleBudgetItems({
        items: multipleProducts.map((item: any) => ({
          ...item,
          unitaryValue: convertIntlCurrency(item?.unitaryValue),
          discountValue: convertIntlCurrency(item?.discountValue),
          budgetId: budget?.id,
        })),
      })
      .then((_res) => {
        setLoading(false);
        setFormData({});
        setReload && setReload((prv) => !prv);
        queryClient.invalidateQueries(["budgets", "show", budget.id]);
        setMultipleProducts([]);
        setValues({});
        return notification.success({
          message: "Produtos adicionados com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao salvar os produtos selecionados",
        });
      });
  }, [validBudget, formData, multipleProducts, budget]);

  const removeItem = (id) => {
    budgetService
      .removeBudgetItem(id)
      .then((res) => {
        setReload && setReload((prv) => !prv);
        queryClient.invalidateQueries(["budgets", "show", id]);
        refetch();
        return notification.success({ message: "Item removido com sucesso!" });
      })
      .catch((err) => {
        return notification.error({ message: err?.response?.data?.message });
      });
  };

  const addKitItems = (kitId) => {
    setLoading(true);
    productService
      .showProductGroup(kitId)
      .then((res) => {
        setMultipleProducts(
          res.data.items.map(({ product }) => ({
            productVariationId: product?.variation_id,
            quantity: product?.quantity,
            unitaryValue: currencyFormatter(product?.original_price),
            discountValue: currencyFormatter(product?.discount_price),
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const productData = React.useMemo(() => {
    if (!data?.items) {
      return [];
    }

    return data.items.map((item) => ({
      key: item.id,
      product: [
        item?.productVariation?.product?.description,
        `(${item?.productVariation?.product?.reference_code})`,
        ...item?.productVariation?.variationOptions.map(
          (option) => option?.description
        ),
        item?.productVariation?.barcode,
      ].join(" - "),
      quantity: item.quantity,
      value: currencyFormatter(item.unitary_value.toString()),
      discount: currencyFormatter(item?.discount_value),
      total: currencyFormatter(item.total_value.toString()),
      remove: removeItemPermission ? (
        <Popconfirm
          title="Deseja remover este item?"
          onConfirm={() => {
            removeItem(item?.id);
          }}
        >
          <DeleteTwoTone twoToneColor="red" />
        </Popconfirm>
      ) : (
        "-"
      ),
    }));
  }, [data]);

  const productOptions = products?.map((product) => {
    return {
      ...product,
      variation_id: product?.variation?.id,
      value:
        product?.type !== "kit"
          ? `${product?.description} - Cod.: ${product?.reference_code} - ${
              product?.variations && product?.variations[0]?.barcode
                ? product?.variations[0]?.barcode
                : ""
            }`
          : product?.description,
      key: product?.id,
    };
  });

  sortItems(productOptions, "value");

  return (
    <>
      {addItemPermission && tableRender && (
        <Tooltip title="Adicionar Item">
          <GrAddCircle
            className="icon"
            size={20}
            onClick={() =>
              validBudget
                ? tableRender
                  ? setVisible((prevState) => !prevState)
                  : setExternVisible((prv) => !prv)
                : null
            }
            style={{ opacity: validBudget ? 1 : 0.5 }}
          />
        </Tooltip>
      )}

      <Modal
        visible={tableRender ? visible : externVisible}
        footer={null}
        title={`Adicionar Item ao ${getWord("Orçamento")} - ${budget?.tag}`}
        width={1300}
        onCancel={() => {
          tableRender && setVisible && setVisible(false);
          setExternVisible && setExternVisible(false);
        }}
      >
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
        >
          <TabPane tab={"Adicionar item"} key={0}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                paddingTop: "1rem",
              }}
            >
              <div className="uk-width-1-1 uk-flex" style={{ gap: "1rem" }}>
                <div className="uk-width-1-1">
                  <label>Produto</label>
                  <AutoComplete
                    className="uk-width-1-1"
                    options={productOptions}
                    filterOption={(val, opt) =>
                      normalizeStr(opt?.description.toUpperCase()).includes(
                        normalizeStr(val.toUpperCase())
                      )
                    }
                    value={values?.productDescription}
                    onChange={(val) =>
                      setValues({ ...values, productDescription: val })
                    }
                    onSelect={(_, opt) => {
                      setProductType(opt?.type);
                      if (opt?.type === "kit") {
                        return addKitItems(opt?.id);
                      }

                      setMultipleProducts((prv) => [
                        {
                          productVariationId: opt?.variations[0]?.id,
                          quantity: 1,
                          saleValue:
                            opt?.variations[0]?.businessUnitProducts[0].price,
                          unitaryValue: currencyFormatter(
                            opt?.variations[0]?.businessUnitProducts[0].price
                          ),
                          discountValue: currencyFormatter(0),
                        },
                      ]);
                    }}
                  />
                </div>
              </div>
              {multipleProducts.map((product, i) => (
                <>
                  <div className="uk-width-1-1 uk-margin-small-top uk-flex uk-flex-middle">
                    <strong>
                      {
                        productOptions?.find(
                          (variation) =>
                            variation?.id === product.productVariationId
                        )?.product?.description
                      }
                    </strong>
                    <section
                      className="uk-margin-bottom"
                      style={{
                        display: "flex",
                        gap: "1rem",
                      }}
                    >
                      <div className="uk-width-1-3">
                        <label>Quantidade</label>
                        <Input
                          placeholder="Quantidade"
                          disabled={productType === "kit"}
                          value={product?.quantity}
                          onChange={(e) => {
                            let productsArr = [...multipleProducts];
                            productsArr.splice(i, 1, {
                              ...multipleProducts[i],
                              quantity: e.target.value,
                            });
                            setMultipleProducts(productsArr);
                          }}
                          min={1}
                          style={{ width: "100%" }}
                        />
                      </div>

                      <div className="uk-width-1-3">
                        <label>Valor Unitário</label>

                        <Input
                          disabled={!clinic?.unitConfig?.alter_prices}
                          placeholder="Valor Unitário"
                          value={product?.unitaryValue}
                          onChange={(e) => {
                            let productsArr = [...multipleProducts];
                            productsArr.splice(i, 1, {
                              ...multipleProducts[i],
                              unitaryValue: Masks.money(e.target.value),
                            });
                            setMultipleProducts(productsArr);
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>

                      <div className="uk-width-1-3">
                        <label>Valor de Desconto</label>

                        <Input
                          placeholder="Valor"
                          disabled={productType === "kit"}
                          value={product?.discountValue}
                          onChange={(e) => {
                            let productsArr = [...multipleProducts];
                            productsArr.splice(i, 1, {
                              ...multipleProducts[i],
                              discountValue: Masks.money(e.target.value),
                            });
                            setMultipleProducts(productsArr);
                          }}
                        />
                      </div>
                    </section>
                  </div>
                </>
              ))}
              <div className="uk-flex uk-flex-right">
                <Button
                  className="uk-margin-top uk-margin-left"
                  htmlType="submit"
                  disabled={isLoading}
                >
                  adicionar
                </Button>
              </div>
            </form>
            <section
              className="uk-margin-small-top uk-flex"
              style={{ gap: "10px" }}
            >
              <div className="uk-width-1-2">
                <label>Observação</label>
                <TextArea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                />
              </div>
              <div className="uk-width-1-2">
                <label>Observação interna</label>
                <TextArea
                  value={internalObservation}
                  onChange={(e) => setInternalObservation(e.target.value)}
                />
              </div>
            </section>
            <hr />
            <div className="uk-flex uk-flex-column">
              <Table
                columns={columns}
                dataSource={productData}
                pagination={false}
                style={{ maxHeight: "300px", overflowY: "auto" }}
              />
              <div
                className="uk-margin-top uk-flex uk-margin-small-left uk-padding-small uk-flex-around"
                style={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              >
                <div className="uk-width-1-3">
                  <strong>Totais:</strong>
                </div>
                <div>
                  {productData
                    .reduce((acc, current) => acc + current.quantity, 0)
                    .toFixed(1)}
                </div>
                <div>
                  {currencyFormatter(
                    productData.reduce(
                      (acc, current) =>
                        acc +
                        (convertIntlCurrency(current.total) +
                          convertIntlCurrency(current?.discount)),
                      0
                    )
                  )}
                </div>
                <div>
                  {currencyFormatter(
                    productData.reduce(
                      (acc, current) =>
                        acc + convertIntlCurrency(current.discount),
                      0
                    )
                  )}
                </div>
                <div>
                  {currencyFormatter(
                    productData.reduce(
                      (acc, current) =>
                        acc + convertIntlCurrency(current.total),
                      0
                    )
                  )}
                </div>
              </div>
              <hr />
              <footer className="uk-flex uk-flex-right">
                <div
                  className="uk-width-1-2 uk-flex uk-flex-right"
                  style={{ gap: "1rem" }}
                >
                  <Button
                    type="primary"
                    onClick={() => {
                      if (multipleProducts?.length > 0) {
                        return notification.warning({
                          message: (
                            <div>
                              {" "}
                              Deseja adicionar o produto{" "}
                              {values?.productDescription}?
                              <div>
                                <Button
                                  type="primary"
                                  className="uk-margin-small-right"
                                  onClick={() => {
                                    setFormData({});
                                    submitObservation();
                                    tableRender
                                      ? setVisible((prevState) => !prevState)
                                      : setExternVisible((prv) => !prv);
                                    notification.destroy();
                                    return submit();
                                  }}
                                >
                                  Sim
                                </Button>
                                <Button
                                  onClick={() => {
                                    setFormData({});
                                    submitObservation();
                                    tableRender
                                      ? setVisible((prevState) => !prevState)
                                      : setExternVisible((prv) => !prv);
                                    notification.destroy();
                                  }}
                                >
                                  Não
                                </Button>
                              </div>
                            </div>
                          ),
                          placement: "bottomRight",
                        });
                      }
                      setFormData({});
                      submitObservation();
                      tableRender
                        ? setVisible((prevState) => !prevState)
                        : setExternVisible((prv) => !prv);
                    }}
                  >
                    Salvar
                  </Button>
                </div>
              </footer>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
}
