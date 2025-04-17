import { memo, useState, useCallback, useMemo, useEffect } from "react";

import { useSuppliers } from "@/OLD/hooks/useSuppliers";
import { useReceiptProducts } from "@/OLD/hooks/useReceipts";
import { useUserHasPermission, useProfile } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import { AutoComplete, Button, Table, Input, Popconfirm } from "antd";
import { DatePicker } from "@mui/x-date-pickers";

import { sortItems } from "@/OLD/utils/sortItems";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import moment from "moment";

import { DeleteTwoTone } from "@ant-design/icons";
import { FormHandler, Select } from "infinity-forge";

const FormChild = memo(function FormChild({
  data,
  setData,
  submit,
  setVisible = false,
  type = "create",
  addItemSubmit = false,
  removeItemSubmit = false,
}: any) {
  const [items, setItems] = useState<any>([]);
  const [productType, setProductType] = useState("");

  const { suppliers } = useSuppliers({});
  const { products } = useReceiptProducts();

  suppliers && sortItems(suppliers, "corporateName");

  const addItemPermission = useUserHasPermission("ENT02");
  const removeItemPermission = useUserHasPermission("ENT03");

  const submitKit = useCallback(() => {
    items.map((product) => {
      const correctUnitValue = convertIntlCurrency(product.unitaryValue);
      const correctDiscountValue = convertIntlCurrency(product.discountValue);
      const correctCostValue = convertIntlCurrency(product?.costValue);

      setData((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            unitaryValue: correctUnitValue,
            discountValue: correctDiscountValue,
            productVariationId: product.productVariationId,
            quantity: product.quantity,
            costValue: correctCostValue,
          },
        ],
      }));

      setData((prv) => ({ ...prv, productDescription: null }));
    });
  }, [items]);

  const removeProduct = (index) => {
    const newArr = data?.items;
    newArr.splice(index, 1);
    setData((prv) => ({
      ...prv,
      items: newArr,
    }));
  };

  const existingProducts = data?.items?.map((i) => ({
    id: i.productVariationId,
    itemId: i?.itemId,
  }));
  const flattenProducts = products?.map((p) => p).flat() ?? [];
  const selectedProducts = existingProducts?.map((elem) =>
    flattenProducts.find((p) => p?.id === elem?.id)
  );

  const productOptions = products
    ?.filter((product) => product?.unit?.type !== "SERVICE")
    ?.map((product) => {
      return {
        label: `${product?.description} - Cod.: ${product?.referenceCode} - ${product?.barcode ? product?.barcode : ""
          }`,
        value: product?.id,
      };
    });

  const productsData = useMemo(() => {
    if (!selectedProducts) {
      return [];
    }

    return data.items.map((elem, index) => {
      const item = selectedProducts.find(
        (i) => elem.productVariationId === i?.id
      );

      if (typeof elem?.quantity === "string") {
        elem.quantity = parseFloat(elem?.quantity.replaceAll(",", ".")).toFixed(
          2
        );
      }

      return {
        key: item?.id,
        product: `${item?.description} - Cod.: ${item?.referenceCode} - ${item?.barcode ? item?.barcode : ""
          }`,
        quantity: elem.quantity,
        discount: currencyFormatter(elem.discountValue),
        value: currencyFormatter(elem.unitaryValue),
        costValue: currencyFormatter(elem?.costValue),
        total: currencyFormatter(
          elem.unitaryValue * elem.quantity - elem?.discountValue
        ),
        remove: removeItemPermission && (
          <Popconfirm
            title="Deseja remover este produto?"
            onConfirm={() =>
              type !== "update"
                ? removeProduct(index)
                : removeItemSubmit(elem?.itemId)
            }
            okText="Sim"
            cancelText="Não"
            placement="left"
          >
            <DeleteTwoTone twoToneColor={"red"} />
          </Popconfirm>
        ),
      };
    });
  }, [data, selectedProducts, removeItemPermission]);

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
      title: "Valor unit",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Preço custo",
      dataIndex: "costValue",
      key: "costValue",
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

  useEffect(() => {
    if (type === "update") {
      setData((prv) => ({ ...prv, supName: data?.supName }));
    }
  }, []);

  return (
    <Container>
      <section className="uk-flex">
        <div className="uk-width-2-3">
          <label>Fornecedor</label>
          <AutoComplete
            disabled={type === "update"}
            className="uk-width-1-1"
            value={data?.supName}
            options={
              suppliers &&
              suppliers?.map((sup) => ({
                ...sup,
                value: sup?.corporateName,
                key: sup?.id,
              }))
            }
            onChange={(val) => setData((prv) => ({ ...prv, supName: val }))}
            onSelect={(_, opt) => {
              setData({ ...data, supplierId: opt?.id, supName: opt?.value });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.name.toUpperCase()).includes(
                normalizeStr(val.toUpperCase())
              )
            }
          />
        </div>
        <div className="uk-width-1-3">
          <label>Data</label>
          <DatePicker
            disabled={type === "update"}
            slotProps={{ textField: { variant: "standard" } }}
            className="uk-width-1-1"
            value={data?.receiptDate}
            onChange={(val) => setData({ ...data, receiptDate: val })}
          />
        </div>
      </section>
      {addItemPermission && (
        <>
          <section>
            <div className="uk-width-1-1">
              <label>Produto</label>

              <FormHandler >
                <Select name="produto" options={productOptions} onlyOneValue onChangeInput={(value) => {

                  const opt = products?.find(item => item.id === value);

                  setItems((prv) => [
                    {
                      productVariationId: opt?.id,
                      quantity: 1,
                      unitaryValue: currencyFormatter(opt?.costPrice),
                      costValue: currencyFormatter(opt?.costValue),
                      discountValue: currencyFormatter(0),
                    },
                  ]);

                }} />
              </FormHandler>

            </div>
          </section>
          {items?.length > 0 &&
            items.map((product, i) => (
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
                      value={items[i]?.quantity}
                      disabled={productType === "kit"}
                      onChange={(e) => {
                        let productsArr = [...items];
                        productsArr.splice(i, 1, {
                          ...items[i],
                          quantity: e.target.value,
                        });
                        setItems(productsArr);
                      }}
                      min={1}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div className="uk-width-1-3">
                    <label>Valor Unitário</label>
                    <Input
                      // disabled={!clinic?.unitConfig?.alter_prices}
                      placeholder="Valor Unitário"
                      value={product?.unitaryValue}
                      onChange={(e) => {
                        let productsArr = [...items];
                        productsArr.splice(i, 1, {
                          ...items[i],
                          unitaryValue: currencyFormatter(
                            convertIntlCurrency(e.target.value)
                          ),
                        });
                        setItems(productsArr);
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
                        let productsArr = [...items];
                        productsArr.splice(i, 1, {
                          ...items[i],
                          discountValue: currencyFormatter(
                            convertIntlCurrency(e.target.value)
                          ),
                        });
                        setItems(productsArr);
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
              className="uk-margin-small-bottom uk-margin-small-top"
              size={"middle"}
              onClick={() =>
                type !== "update"
                  ? submitKit()
                  : addItemSubmit(
                    {
                      ...items[0],
                      costValue: convertIntlCurrency(items[0]?.costValue),
                      receiptId: data?.receiptId,
                      productVariationId: items[0]?.productVariationId,
                      unitaryValue: convertIntlCurrency(
                        items?.[0]?.unitaryValue
                      ),
                      discountValue: convertIntlCurrency(
                        items[0]?.discountValue
                      ),
                    },
                    setItems
                  )
              }
            >
              Adicionar
            </Button>
          </section>
        </>
      )}
      <Table
        columns={columns}
        dataSource={productsData}
        pagination={false}
        style={{ maxHeight: "300px", overflowY: "auto" }}
      />
      <hr />
      <footer className="uk-flex uk-flex-right">
        <Button
          onClick={() => {
            setData({ receiptDate: moment(), items: [] });
            setVisible && setVisible(false);
          }}
          className="uk-margin-small-right"
        >
          {type === "update" ? "Salvar" : "Cancelar"}
        </Button>
        {type !== "update" && (
          <Button type="primary" onClick={submit}>
            Salvar
          </Button>
        )}
      </footer>
    </Container>
  );
});

export default FormChild;
