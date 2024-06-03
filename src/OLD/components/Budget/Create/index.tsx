// @ts-nocheck
import {
  Button,
  DatePicker,
  Input,
  AutoComplete,
  Modal,
  Select,
  Table,
  notification,
  Popconfirm,
} from "antd";
import moment from "moment";
import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { petsService } from "@/OLD/services/patient.service";
import { productService } from "@/OLD/services/product.service";
import { billService } from "@/OLD/services/bills.service";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import Masks from "@/OLD/utils/masks";
import { useBudgetProducts, useCreateBudget } from "@/OLD/hooks/useBudgets";
import { useDailyMovements } from "@/OLD/hooks/useDailyMovements";
import { useLoadPatient } from "@/presentation";

import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useProfile } from "@/OLD/hooks/useProfile";

import { sortItems } from "@/OLD/utils/sortItems";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { currencyFormatter } from "..";

import { DeleteTwoTone } from "@ant-design/icons";

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

function CreateBudget({
  modal,
  setReloadExtern = false,
  attendanceId = false,
  setModal,
}: any) {
  const [data, setData] = React.useState({
    budgetDate: moment(),
    expirationDate: moment().add(1, "days"),
    items: [],
  });
  const [productData, setProductData] = React.useState({});
  const [values, setValues] = React.useState({});
  const [patientOptions, setPatientOptions] = React.useState([]);
  const [selectedClient, setSelectedClient] = React.useState(false);
  const [multipleProducts, setMultipleProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [productType, setProductType] = React.useState("");
  const [confirmMissingClientId, setConfirmMissingClientId] =
    React.useState(false);

  const { colaborators } = useColaborators();
  const { user, clinic } = useProfile();
  const clientData = useLoadPatient();

  const close = () => setModal((prv) => !prv);

  const cleanUp = () => {
    setData({
      budgetDate: moment(),
      expirationDate: moment().add(1, "days"),
      items: [],
    });
    setValues({});
  };

  const { data: tutors } = useQuery(
    ["tutors"],
    async () => {
      const { data } = await petsService.getTutors();

      return data ?? [];
    },
    {
      enabled: modal,
    }
  );
  const { movements } = useDailyMovements();
  const { data: products } = useBudgetProducts(modal);
  const { mutate, isLoading } = useCreateBudget();

  const router = useRouter();

  const customInfo = () => {
    setValues({
      clientName: clientData.data.name,
      patientName: clientData?.data.name,
    });
    setData({
      ...data,
      clientId: clientData?.data.id,
      patientId: clientData?.data.id,
      sellerName: user?.name,
      sellerId: user?.id,
    });
  };

  const defaultInfo = () => {
    setSelectedClient(clientData?.data.tutor.id);
    setValues({
      clientName: clientData.data.tutor.name,
      patientName: clientData?.data.name,
    });
    if (clientData) {
      setData({
        ...data,
        clientId: clientData?.data.tutor.id,
        patientId: clientData?.data.id,
      });
    }
  };

  React.useEffect(() => {
    if (router.pathname.includes("dashboard/paciente")) {
      process.env.client !== "liftone" ? defaultInfo() : customInfo();
    }
  }, [clientData, modal]);

  React.useEffect(() => {
    if (data?.dailyMovementId) {
      return;
    }

    const openMovement = movements.find((f) => f.status === "Aberto");
    if (!openMovement) {
      return;
    }

    setData((prev) => ({ ...prev, dailyMovementId: openMovement.id }));
  }, [data, movements]);

  const catchErrors = (err) => {
    const fields = err?.response?.data?.errors?.map((error) => error?.field);

    /*if (fields.includes("clientId")) {
      return notification.error({ message: "Informe o cliente" });
    }*/

    if (fields.includes("dailyMovementId")) {
      return notification.error({
        message: "Abertura de movimentação diária necessária",
      });
    }

    return (
      fields.includes("dailyCashierId") &&
      notification.error({ message: "Abertura do caixa diário necessária" })
    );
  };

  const verifyDiscount = React.useCallback(() => {
    setLoading(true);
    return billService
      .verifyDiscount(data)
      .then((res) => {
        setLoading(false);
        return true;
      })
      .catch((err) => {
        setLoading(false);
        err?.response.data.map((item) =>
          notification.error({ message: item?.message })
        );
        return false;
      });
  }, [data]);

  const submit = React.useCallback(
    (missingClientId = false) => {
      if (!missingClientId && !data?.clientId) {
        return setConfirmMissingClientId(true);
      }

      setLoading(true);

      const newObj = {
        expirationDate: data.expirationDate,
        budgetDate: data.budgetDate,
        patientId: data.patientId,
        clientId: data.clientId,
        observation: data.observation,
        dailyMovementId: data.dailyMovementId,
        items: data.items,
        sellerId: data?.sellerId,
        reviewerId: data?.reviewerId,
        internalObservation: data?.internalObservation,
        clientName: values?.clientName,
        attendanceId,
      };

      if (!attendanceId) {
        delete newObj?.attendanceId;
      }

      if (verifyDiscount()) {
        mutate(newObj, {
          onSuccess: () => {
            setLoading(false);
            setConfirmMissingClientId(false);
            cleanUp();
            notification.success({ message: "Orçamento criado com sucesso!" });
            close((prv) => {
              if (prv?.budget) {
                return { ...prv, budget: false };
              }
              return false;
            });
            setReloadExtern((prv) => !prv);
          },
          onError: (err) => {
            catchErrors(err);
            setLoading(false);
          },
        });
      }
    },
    [data]
  );

  /*
  const submitProduct = React.useCallback(() => {
    const correctUnitValue = convertIntlCurrency(productData.unitaryValue);
    const correctDiscountValue = convertIntlCurrency(productData.discountValue);

    if (typeof productData?.quantity === "string") {
      productData.quantity = parseFloat(
        productData?.quantity.replaceAll(",", ".")
      );
    }

    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productVariationId: productData.productVariationId,
          quantity: productData.quantity,
          unitaryValue: correctUnitValue,
          discountValue: correctDiscountValue
        }
      ]
    }));

    setProductData({});
  }, [data, productData]);
  */

  const existingProducts = data?.items?.map((i) => i.productVariationId);
  const flattenProducts = products?.map((p) => p).flat() ?? [];
  const selectedProducts = existingProducts?.map((elem) =>
    flattenProducts.find((p) => p.variations[0]?.id === elem)
  );

  const clientOptions = tutors?.map((t) => {
    return {
      ...t,
      value: t.name,
      key: t?.id,
    };
  });

  const patientFilter = () => {
    const arr = [];
    const ids = [];
    selectedClient &&
      selectedClient.dependents?.map((p) => {
        if (!ids.includes(p?.id)) {
          arr.push({ ...p, value: p.name });
          ids.push(p.id);
        }
      });
    setPatientOptions(arr);
  };

  React.useEffect(() => {
    patientFilter();
  }, [selectedClient]);

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

  sortItems(clientOptions, "name");
  sortItems(patientOptions, "name");
  sortItems(colaborators, "name");
  sortItems(productOptions, "value");

  /*
  const productOptions = products
    ?.map((p) => p.variations)
    .flat()
    .sort((a, b) => {
      if (3
        a.product.description.toLowerCase() <
        b.product.description.toLowerCase()
      ) {
        return -1;
      }

      if (
        a.product.description.toLowerCase() >
        b.product.description.toLowerCase()
      ) {
        return 1;
      }

      return 0;
    });
*/

  const removeProduct = (index) => {
    const newArr = data?.items;
    newArr.splice(index, 1);
    setData((prv) => ({
      ...prv,
      items: newArr,
    }));
  };

  const productsData = React.useMemo(() => {
    if (selectedProducts) {
      return data.items.map((elem, index) => {
        const item = selectedProducts.find(
          (i) => elem.productVariationId === i.variations[0]?.id
        );

        if (typeof elem?.quantity === "string") {
          elem.quantity = parseFloat(elem?.quantity.replaceAll(",", "."));
        }

        return {
          key: item?.id,
          product: `${item?.description} - Cod.: ${item?.reference_code} - ${
            item?.variations && item?.variations[0]?.barcode
              ? item?.variations[0]?.barcode
              : ""
          }`,
          quantity: elem.quantity,
          discount: Masks.money((elem.discountValue * 100).toString()),
          value: Masks.money((elem.unitaryValue * 100).toString()),
          total: Masks.money(
            (
              elem.unitaryValue * elem.quantity * 100 -
              elem?.discountValue * 100
            ).toString()
          ),
          remove: (
            <Popconfirm
              title="Deseja remover este produto?"
              onConfirm={() => removeProduct(index)}
              okText="Sim"
              cancelText="Não"
              placement="left"
            >
              <DeleteTwoTone twoToneColor={"red"} />
            </Popconfirm>
          ),
        };
      });
    }

    return [];
  }, [selectedProducts]);

  const submitKit = React.useCallback(() => {
    multipleProducts.map((product) => {
      const correctUnitValue = convertIntlCurrency(product.unitaryValue);
      const correctDiscountValue = convertIntlCurrency(product.discountValue);

      setData((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            unitaryValue: correctUnitValue,
            discountValue: correctDiscountValue,
            productVariationId: product.productVariationId,
            quantity: product.quantity,
            saleValue: product?.saleValue,
          },
        ],
      }));

      setProductData({});
      setMultipleProducts([]);
      setValues((prv) => ({ ...prv, productDescription: "" }));
    });
  }, [multipleProducts]);

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
            saleValue: product?.original_price,
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <>
      <h4>Novo orçamento</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (multipleProducts?.length > 0) {
            return notification.warning({
              message: (
                <div>
                  Deseja adicionar {values?.productDescription} à venda?{" "}
                  <div>
                    <Button
                      type="primary"
                      className="uk-margin-small-right"
                      onClick={() => {
                        notification.destroy();
                        submitKit();
                        submit();
                      }}
                    >
                      Sim
                    </Button>
                    <Button
                      onClick={() => {
                        notification.destroy();
                        submit();
                      }}
                    >
                      Não
                    </Button>
                  </div>{" "}
                </div>
              ),
              placement: "bottomRight",
            });
          }
          submit();
        }}
      >
        <div
          className="uk-width-1-1 uk-flex uk-flex-column"
          style={{ gap: "1rem" }}
        >
          <div className="uk-width-1-1 uk-flex" style={{ gap: "1rem" }}>
            <div className="uk-width-1-2">
              <label>Data da Criação</label>

              <DatePicker
                showTime
                allowEmpty
                format="HH:mm DD/MM/YYYY"
                value={moment(data.budgetDate)}
                onChange={(_date) => {
                  setData((prev) => ({ ...prev, budgetDate: _date }));
                }}
                style={{ width: "100%" }}
              />
            </div>

            <div className="uk-width-1-2">
              <label>Data da Expiração</label>

              <DatePicker
                allowEmpty
                format="DD/MM/YYYY"
                value={moment(data.expirationDate)}
                onChange={(_date) => {
                  setData((prev) => ({ ...prev, expirationDate: _date }));
                }}
                style={{ width: "100%" }}
              />
            </div>
            <div className="uk-width-1-1">
              <label>Cliente</label>

              <AutoComplete
                style={{ width: "100%" }}
                value={values?.clientName}
                options={clientOptions}
                filterOption={(inputValue, option) =>
                  normalizeStr(option.value)
                    .toUpperCase()
                    .includes(normalizeStr(inputValue).toUpperCase())
                    ? option
                    : null
                }
                onChange={(val) => {
                  setSelectedClient(false);
                  setData({ ...data, patientId: null });
                  setValues({
                    clientName: normalizeStr(val),
                    patientName: "",
                  });
                }}
                onSelect={(_, c) => {
                  setValues((prv) => ({ ...prv, clientName: c.name }));
                  setSelectedClient(c);
                  setData((prev) => ({
                    ...prev,
                    clientId: c.id,
                    patientId: null,
                  }));
                }}
              />
            </div>
          </div>

          {process.env.client !== "liftone" && (
            <div className="uk-width-1-1 uk-flex" style={{ gap: "1rem" }}>
              <div className="uk-width-1-1">
                <label>Paciente</label>

                <Select
                  showSearch
                  style={{ width: "100%" }}
                  value={values?.patientName}
                  onSearch={(val) => setValues({ ...values, patientName: val })}
                  options={patientOptions}
                  onSelect={(_, option) => {
                    setData((prev) => ({
                      ...prev,
                      patientId: option?.id,
                    }));
                  }}
                  filterOption={(inputValue, option) =>
                    normalizeStr(option.value)
                      .toUpperCase()
                      .includes(normalizeStr(inputValue).toUpperCase())
                      ? option
                      : null
                  }
                  onChange={(value) => {
                    setValues((prv) => ({ ...prv, patientName: value }));
                  }}
                />
              </div>
            </div>
          )}
          {process.env.client === "liftone" && (
            <div className="uk-flex uk-width-1-1" style={{ gap: "1rem" }}>
              <div className="uk-width-1-2">
                <label>Vendedor</label>
                <AutoComplete
                  className="uk-width-1-1"
                  value={data?.sellerName}
                  options={colaborators?.map((collab) => ({
                    ...collab,
                    value: collab?.name,
                  }))}
                  onChange={(val) =>
                    setData((prv) => ({ ...prv, sellerName: val }))
                  }
                  onSelect={(_, opt) =>
                    setData((prv) => ({
                      ...prv,
                      sellerId: opt?.id,
                      sellerName: opt?.value,
                    }))
                  }
                  filterOption={(val, opt) =>
                    normalizeStr(opt?.value.toUpperCase()).includes(
                      normalizeStr(val?.toUpperCase())
                    )
                  }
                />
              </div>
              <div className="uk-width-1-2">
                <label>Avaliador</label>
                <AutoComplete
                  className="uk-width-1-1"
                  value={data?.reviewerName}
                  options={colaborators?.map((collab) => ({
                    ...collab,
                    value: collab?.name,
                  }))}
                  onChange={(val) =>
                    setData((prv) => ({ ...prv, reviewerName: val }))
                  }
                  onSelect={(_, opt) =>
                    setData((prv) => ({
                      ...prv,
                      reviewerId: opt?.id,
                      reviewerName: opt?.value,
                    }))
                  }
                  filterOption={(val, opt) =>
                    normalizeStr(opt?.value.toUpperCase()).includes(
                      normalizeStr(val?.toUpperCase())
                    )
                  }
                />
              </div>
            </div>
          )}
          <div className="uk-flex" style={{ gap: "5px" }}>
            <div className="uk-width-1-2">
              <label>Observação</label>
              <Input
                value={data?.observation}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    observation: e.target.value,
                  }))
                }
              />
            </div>
            <div className="uk-width-1-2">
              <label>Observação interna</label>
              <Input
                value={data?.internalObservation}
                onChange={(e) =>
                  setData({ ...data, internalObservation: e.target.value })
                }
              />
            </div>
          </div>
          <hr className="uk-margin-remove" />
          <div className="uk-width-1-1">
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "1rem",
              }}
            >
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
              <div className="uk-width-1-1 uk-margin-small-top uk-flex uk-flex-middle">
                <>
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
                </>
              </div>
            ))}

            <div className="uk-flex uk-flex-right">
              <Button
                size={"small"}
                onClick={() => submitKit()}
                className="uk-margin-top"
              >
                Adicionar
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={productsData}
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
              {productsData
                .reduce((acc, current) => acc + current.quantity, 0)
                .toFixed(1)}
            </div>
            <div>
              {currencyFormatter(
                productsData.reduce(
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
                productsData.reduce(
                  (acc, current) => acc + convertIntlCurrency(current.discount),
                  0
                )
              )}
            </div>
            <div>
              {currencyFormatter(
                productsData.reduce(
                  (acc, current) => acc + convertIntlCurrency(current.total),
                  0
                )
              )}
            </div>
          </div>
          <hr />

          <div
            className="uk-width-1-1 uk-flex uk-flex-right"
            title="Criar orçamento"
            visible={modal}
            onClose={() =>
              close((prv) => {
                if (prv?.budget) {
                  return { ...prv, budget: false };
                }
                return false;
              })
            }
            width={800}
            footer={null}
            style={{ gap: "1rem" }}
          >
            <Button
              onClick={() => {
                cleanUp();
                close((prv) => {
                  if (prv?.budget) {
                    return { ...prv, budget: false };
                  }
                  return false;
                });
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" disabled={isLoading}>
              Salvar
            </Button>
          </div>
        </div>
      </form>
      <Modal
        visible={confirmMissingClientId}
        footer={null}
        onCancel={() => setConfirmMissingClientId(false)}
      >
        <div>
          Cliente informado não encontrado na base de dados, deseja continuar?
        </div>
        <hr />
        <footer className="uk-flex uk-flex-right">
          <Button
            loading={loading}
            type="primary"
            htmlType="button"
            className="uk-margin-small-right"
            onClick={() => {
              submit(true);
            }}
          >
            Sim
          </Button>
          <Button
            htmlType="button"
            onClick={() => setConfirmMissingClientId(false)}
          >
            Não
          </Button>
        </footer>
      </Modal>
    </>
  );
}

export default CreateBudget;
