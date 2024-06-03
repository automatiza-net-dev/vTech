// @ts-nocheck
import {
  AutoComplete,
  Button,
  DatePicker,
  Input,
  Modal,
  Popconfirm,
  Table,
  notification,
} from "antd";
import moment from "moment";
import * as React from "react";
import { memo } from "react";
import { useQuery } from "react-query";
import { useProfile } from "@/OLD/hooks/useProfile";

import { currencyFormatter } from "@/OLD/components/Budget";
import { petsService } from "@/OLD/services/patient.service";
import { productService } from "@/OLD/services/product.service";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";
import { useCreateBill, useGetBillProducts } from "../../../../OLD/hooks/useBills";
import { useDailyCasher } from "../../../../OLD/hooks/useDailyCashiers";
import { useDailyMovements } from "../../../../OLD/hooks/useDailyMovements";
import { convertIntlCurrency } from "../../../../OLD/utils/convertIntl";

import { DeleteTwoTone } from "@ant-design/icons";
import { billService } from "@/OLD/services/bills.service";

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

const catchErrors = (err) => {
  const errCode = err?.response?.data?.code;

  if (errCode && errCode?.includes("E_NOT_OPEN")) {
    return notification.error({ message: "Não existe caixa diário aberto" });
  }

  const fields = err?.response?.data?.errors?.map((error) => error?.field);

  if (fields.includes("clientId")) {
    return notification.error({ message: "Informe o cliente" });
  }

  return (
    fields.includes("dailyCashierId") &&
    notification.error({ message: "Abertura do caixa diário necessária" })
  );
};

const CreateBill = memo(function CreateBill({
  visible,
  close,
  clientData,
  setReloadExtern,
}) {
  const [data, setData] = React.useState({
    billDate: moment(),
    items: [],
  });
  const [productData, setProductData] = React.useState({});
  const [multipleProducts, setMultipleProducts] = React.useState([]);
  const [clientSearch, setClientSearch] = React.useState("");
  const [patientSearch, setPatientSearch] = React.useState("");
  const [patientOptions, setPatientOptions] = React.useState([]);
  const [selectedClient, setSelectedClient] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [values, setValues] = React.useState({});
  const [productType, setProductType] = React.useState("");

  const { data: tutors } = useQuery(
    ["tutors"],
    async () => {
      const { data } = await petsService.getTutors();

      return data ?? [];
    },
    {
      enabled: visible,
    }
  );
  const { movements } = useDailyMovements();
  const { cashiers } = useDailyCasher();
  const { data: products } = useGetBillProducts(visible);
  const { mutate, isLoading, error } = useCreateBill();
  const { clinic } = useProfile();


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

  const submit = React.useCallback(() => {
    setLoading(true);
    if (verifyDiscount()) {
      mutate(data, {
        onSuccess: () => {
          setLoading(false);
          cleanUp();
          close();
          setReloadExtern((value) => !value);
          return notification.success({ message: "Venda criada com sucesso!" });
        },
        onError: (err) => {
          catchErrors(err);
          setLoading(false);
        },
      });
    }
  }, [data]);

  React.useEffect(() => {
    if (!error) {
      return;
    }

    const data = error?.response?.data;

    if (!data) {
      notification.error({
        message: "Erro ao criar nota",
      });
      return;
    }

    if (Array.isArray(data)) {
      data.map((err) => {
        notification.error({
          message: err.message,
        });
      });
      return;
    }

    if ("message" in data) {
      notification.error({
        message: data.message,
      });
      return;
    }
  }, [JSON.stringify(error?.response)]);


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
          },
        ],
      }));

      setProductData({});
      setMultipleProducts([]);
      setValues({});
    });
  }, [multipleProducts]);

  const removeProduct = (index) => {
    const newArr = data?.items;
    newArr.splice(index, 1);
    setData((prv) => ({
      ...prv,
      items: newArr,
    }));
  };

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

  const defaultInfo = () => {
    setSelectedClient(
      tutors?.find(
        (t) =>
          t?.id === clientData?.tutors?.find((tutor) => !!tutor?.is_main)?.id
      )
    );
    setClientSearch(
      clientData?.tutors?.find((tutor) => !!tutor?.is_main)?.name
    );
    setPatientSearch(clientData?.name);
    if (clientData) {
      setData({
        ...data,
        clientId: clientData?.tutors?.find((tutor) => !!tutor?.is_main)?.id,
        patientId: clientData?.id,
      });
    }
  };

  const customInfo = () => {
    setSelectedClient(clientData?.id);
    setClientSearch(clientData?.name);
    setData({ ...data, clientId: clientData?.id, patientId: clientData?.id });
  };

  React.useEffect(() => {
    process.env.client !== "liftone" ? defaultInfo() : customInfo();
  }, [clientData, visible]);

  React.useEffect(() => {
    if (!data?.dailyMovementId) {
      const openMovement = movements.find((f) => f.status === "Aberto");
      if (openMovement) {
        setData((prev) => ({ ...prev, dailyMovementId: openMovement.id }));
      }
    }

    if (!data?.dailyCashierId) {
      const openCashier = cashiers.find((f) => f.status === "ABERTO");
      if (openCashier) {
        setData((prev) => ({ ...prev, dailyCashierId: openCashier.id }));
      }
    }
  }, [data, movements, cashiers]);

  const cleanUp = () => {
    setData({
      billDate: moment(),
      items: [],
    });
    setPatientSearch("");
    setClientSearch("");
    setValues({});
  };

  const existingProducts = data?.items?.map((i) => i.productVariationId);
  const flattenProducts = products?.map((p) => p).flat() ?? [];
  const selectedProducts = existingProducts?.map((elem) =>
    flattenProducts.find((p) => {
      if (p.type === "kit") {
        return false;
      }

      return p?.variations.at(0)?.id === elem;
    })
  );

  const clientOptions = tutors?.map((tutor) => {
    return {
      ...tutor,
      value: tutor?.name,
    };
  });

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

  const productsData = React.useMemo(() => {
    if (!selectedProducts) {
      return [];
    }

    return data.items.map((elem, index) => {
      const item = selectedProducts.find(
        (i) => elem.productVariationId === i.variations[0]?.id
      );

      if (typeof elem?.quantity === "string") {
        elem.quantity = parseFloat(elem?.quantity.replaceAll(",", ".")).toFixed(
          2
        );
      }

      return {
        key: item?.id,
        product: `${item?.description} - Cod.: ${item?.reference_code} - ${
          item?.variations && item?.variations[0]?.barcode
            ? item?.variations[0]?.barcode
            : ""
        }`,
        quantity: elem.quantity,
        discount: currencyFormatter(elem.discountValue.toString()),
        value: currencyFormatter(elem.unitaryValue.toString()),
        total: currencyFormatter(
          (elem.unitaryValue * elem.quantity - elem?.discountValue).toString()
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
  }, [data, selectedProducts]);

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

  return (
    <>
      <Modal
        title="Criar nota"
        visible={visible}
        onClose={() => {
          cleanUp();
          close();
        }}
        width={1000}
        footer={null}
        onCancel={() => {
          cleanUp();
          close();
        }}
      >
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
            <div className="uk-width-1-1">
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
            <div className="uk-width-1-1 uk-flex" style={{ gap: "1rem" }}>
              <div className="uk-width-1-1">
                <label>Cliente</label>
                <AutoComplete
                  className="uk-width-1-1"
                  options={clientOptions}
                  value={clientSearch}
                  onChange={(val) => {
                    setSelectedClient(false);
                    setData({ ...data, patientId: null });
                    setPatientSearch("");
                    setClientSearch(normalizeStr(val));
                  }}
                  onSelect={(_, c) => {
                    setClientSearch(c.name);
                    setSelectedClient(c);
                    setData((prev) => ({
                      ...prev,
                      clientId: c.id,
                      patientId: null,
                    }));
                  }}
                  filterOption={(inputValue, option) =>
                    normalizeStr(option.value)
                      .toUpperCase()
                      .includes(normalizeStr(inputValue).toUpperCase())
                      ? option
                      : null
                  }
                />
              </div>

              {process.env.client !== "liftone" && (
                <div className="uk-width-1-1">
                  <label>Paciente</label>
                  <AutoComplete
                    disabled={!selectedClient}
                    value={patientSearch}
                    className="uk-width-1-1"
                    options={patientOptions}
                    onChange={(value) => {
                      setPatientSearch(value);
                    }}
                    onSelect={(_, opt) => {
                      setPatientSearch(opt?.name);
                      setData((prev) => ({
                        ...prev,
                        patientId: opt?.id,
                      }));
                    }}
                    filterOption={(inputValue, option) =>
                      normalizeStr(option.value)
                        .toUpperCase()
                        .includes(normalizeStr(inputValue).toUpperCase())
                        ? option
                        : null
                    }
                  />
                </div>
              )}
            </div>
            <div className="uk-width-1-1">
              <label>Observação</label>
              <Input
                value={data?.additionalInformation}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    additionalInformation: e.target.value,
                  }))
                }
              />
            </div>

            <div className="uk-width-1-1">
              <div
                className="uk-width-1-1 uk-flex uk-flex-column uk-flex-between"
                style={{ gap: "1rem" }}
              >
                <section
                  style={{
                    display: "flex",
                    gap: "1rem",
                    paddingTop: "1rem",
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
                            unitaryValue: currencyFormatter(
                              opt?.variations[0]?.businessUnitProducts[0].price
                            ),
                            discountValue: currencyFormatter(0),
                          },
                        ]);
                      }}
                    />
                  </div>
                </section>

                {multipleProducts.map((product, i) => (
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
                          value={multipleProducts[i]?.quantity}
                          disabled={productType === "kit"}
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
                          placeholder="Valor Unitário"
                          value={product?.unitaryValue}
                          onChange={(e) => {
                            let productsArr = [...multipleProducts];
                            productsArr.splice(i, 1, {
                              ...multipleProducts[i],
                              unitaryValue: currencyFormatter(
                                convertIntlCurrency(e.target.value)
                              ),
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
                          value={product?.discountValue}
                          disabled={productType === "kit"}
                          onChange={(e) => {
                            let productsArr = [...multipleProducts];
                            productsArr.splice(i, 1, {
                              ...multipleProducts[i],
                              discountValue: currencyFormatter(
                                convertIntlCurrency(e.target.value)
                              ),
                            });
                            setMultipleProducts(productsArr);
                          }}
                        />
                      </div>
                    </section>
                  </>
                ))}
                <section
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    className="uk-margin-small-bottom"
                    size={"middle"}
                    onClick={() => submitKit()}
                  >
                    Adicionar
                  </Button>
                </section>
              </div>

              <Table
                columns={columns}
                dataSource={productsData}
                pagination={false}
                style={{ maxHeight: "300px", overflowY: "auto" }}
              />
            </div>
            <hr />

            <div
              className="uk-width-1-1 uk-flex uk-flex-right"
              style={{ gap: "1rem" }}
            >
              <Button
                onClick={() => {
                  cleanUp();
                  close();
                }}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isLoading}
                loading={loading}
              >
                Salvar
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
});

export default CreateBill;
