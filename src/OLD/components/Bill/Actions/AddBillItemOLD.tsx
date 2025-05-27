//@ts-nocheck
import { billService } from "@/OLD/services/bills.service";
import { productService } from "@/OLD/services/product.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useProfile } from "@/OLD/hooks/useProfile";

import { Modal as ModalInfinity } from "infinity-forge";

import {
  AutoComplete,
  Button,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Table,
} from "antd";
import { Modal as ModalInfinityForge, useToast } from "infinity-forge";
import {
  useCreateBillItem,
  useGetBillProducts,
  useShowBill,
} from "@/OLD/hooks/useBills";
import * as React from "react";
import { GrAddCircle } from "react-icons/gr";
import { useQueryClient } from "infinity-forge";

import { FiTrash2 } from "react-icons/fi";

import { convertIntlCurrency } from "../../../../OLD/utils/convertIntl";
import Masks from "../../../../OLD/utils/masks";
import { currencyFormatter } from "../../Budget";
const { Group } = Radio;

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

import { DiscountConfirmation } from "@/presentation";

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
    title: "Cortesia",
    dataIndex: "courtesy",
    key: "courtesy",
  },
  {
    title: "Remover",
    dataIndex: "delete",
    key: "delete",
  },
];

function AddBillItem({ bill }: any) {
  const queryClient = useQueryClient();
  const [visible, setVisible] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [itemData, setItemData] = React.useState([]);
  const [submitData, setSubmitData] = React.useState({});
  const [editDiscount, setEditDiscount] = React.useState(false);
  const [discountType, setDiscountType] = React.useState("value");
  const [reload, setReload] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [multipleProducts, setMultipleProducts] = React.useState([]);
  const [productType, setProductType] = React.useState("");
  const [discountConfirmVisible, setDiscountConfirmVisible] =
    React.useState(false);
  const [generalDiscount, setGeneralDiscount] = React.useState(
    currencyFormatter(0)
  );

  const { createToast } = useToast();

  const { data } = useShowBill(bill.id, visible);
  const { data: products } = useGetBillProducts(visible);
  const { mutate, isLoading } = useCreateBillItem();
  const { clinic } = useProfile();

  const addItemPermission = useUserHasPermission("VEN02");
  const removeItemPermission = useUserHasPermission("VEN03");

  sortItems(products, "description");

  const submitDiscount = React.useCallback(
    (maxDiscount = false) => {
      const items = itemData?.map((item) => {
        const verifyMaxDiscount =
          !!maxDiscount && !!item?.exceedDiscount ? true : false;

        return {
          ...item,
          discountValue: convertIntlCurrency(item?.discountValue),
          maxDiscount: verifyMaxDiscount,
        };
      });

      billService
        .updateBillItem({ items })
        .then((_res) => {
          setFormData({});
          setDiscountConfirmVisible(false);
          queryClient.invalidateQueries(["bills"]);
          setLoading(false);
          setReload(!reload);
          setTimeout(() => setVisible(false), 200);
        })
        .catch((errorList) => {
          setLoading(false);
          if (Array.isArray(errorList?.response?.data)) {
            errorList?.response?.data?.forEach((err) => {
              if (err?.rule === "DescontoMaximo") {
                return setDiscountConfirmVisible(true);
              }

              createToast({ status: "error", message: err.message });
            });
            return;
          }
        });
    },
    [itemData]
  );

  React.useEffect(() => {
    data &&
      setItemData(
        data.items.map((item) => {
          return {
            discountValue: currencyFormatter(item?.discount_value),
            billItemId: item?.id,
            quantity: item?.quantity,
            maximumDiscountPercentage:
              item?.productVariation?.businessUnitProducts?.[0]
                ?.maximum_discount_percentage,
            courtesy: item.courtesy,
            unitaryValue: item.unitary_value,
            shouldValidateDiscount: item?.courtesy_approved_at ? false : true,
            saleValue: item?.sale_value,
            exceedDiscount:
              item.discount_value >
              item?.productVariation?.businessUnitProducts?.[0]
                ?.maximum_discount_percentage,
          };
        })
      );
  }, [data, reload]);

  const productData = () => {
    if (!data?.items || !itemData?.length || itemData?.length === 0) {
      return [];
    }

    return data.items.map((item, i) => {
      return (
        item?.status !== "INATIVA" && {
          key: item.id,
          product: [
            item.productVariation.product.description,
            `(${item.productVariation.product.reference_code})`,
            ...item?.productVariation?.variationOptions?.map(
              (option) => option?.description
            ),
            item?.productVariation?.barcode,
          ].join(" - "),
          quantity: item.quantity,
          value: currencyFormatter(itemData[i]?.unitaryValue),
          total: currencyFormatter(item.quantity * itemData[i]?.unitaryValue),
          delete: removeItemPermission && (
            <Popconfirm
              title="Deseja remover este item?"
              onConfirm={() => removeBillItem(item?.id)}
            >
              <FiTrash2 
                style={{ color: 'red', fontSize: '1.2rem', cursor: 'pointer' }} 
                onClick={() => removeBillItem(item?.id)} 
              />
            </Popconfirm>
          ),
          courtesy: (
            <input
              type="checkbox"
              disabled={!item.productVariation.product.courtesy}
              checked={itemData[i]?.courtesy}
              onChange={(e) => {
                const arr = [...itemData];
                arr.splice(i, 1, {
                  ...itemData?.[i],
                  courtesy: e.target.checked,
                  unitaryValue: e.target.checked ? 0 : item.sale_value,
                });
                setItemData(arr);
              }}
            />
          ),
          discount: (
            <Input
              key={i}
              value={itemData[i]?.discountValue}
              onChange={(e) => {
                setEditDiscount(true);
                const arr = [...itemData];
                arr.splice(i, 1, {
                  ...itemData[i],
                  exceedDiscount:
                    convertIntlCurrency(e.target.value) >
                    item?.productVariation?.businessUnitProducts?.[0]
                      ?.maximum_discount_percentage,
                  discountValue: currencyFormatter(
                    convertIntlCurrency(e.target.value)
                  ),
                });
                setItemData(arr);
              }}
            />
          ),
        }
      );
    });
  };

  const setDiscountValue = (value) => {
    setEditDiscount(true);
    const arr = [...itemData];

    data?.items?.forEach((item, i) => {
      arr.splice(i, 1, {
        ...itemData[i],
        discountValue: currencyFormatter(
          (item?.total_value / data?.total_value) * convertIntlCurrency(value)
        ),
      });
    });
    setItemData(arr);
  };

  const removeBillItem = (id) => {
    billService
      .removeBillItem(id)
      .then((_res) =>
        createToast({ status: "success", message: "Item removido com sucesso" })
      )
      .finally(() => {
        queryClient.invalidateQueries(["bills"]);
        setReload((prv) => !prv);
      });
  };

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
  /*
    ?.map((p) => p.variations)
    .flat()
    .sort((a, b) => {
      if (
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
    })
    .map((variation) => ({
      ...variation,
      value: [
        variation.product.description,
        `Cod.: (${variation.product.reference_code})`,
        ...variation?.variationOptions?.map((option) => option?.description),
        variation?.barcode
      ].join(" - ")
    }));
    */

  const addKitItems = (kitId) => {
    setLoading(true);
    productService
      .showProductGroup(kitId)
      .then((res) => {
        setMultipleProducts(
          res.data.items.map(({ product }) => ({
            billId: bill?.id,
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

  const [modalItem, setModalItem] = React.useState(false);

  const submitKit = React.useCallback(
    (maxDiscount = false) => {
      setLoading(true);
      billService
        .createMultipleItems({
          items: multipleProducts.map((item) => ({
            ...item,
            billId: bill?.id,
            maxDiscount,
            quantity:
              typeof item?.quantity === "string"
                ? parseFloat(item?.quantity.replaceAll(",", "."))
                : item?.quantity,
            unitaryValue: convertIntlCurrency(item?.unitaryValue),
            discountValue: convertIntlCurrency(item?.discountValue),
          })),
        })
        .then((_res) => {
          setLoading(false);
          setDiscountConfirmVisible(false);
          setFormData({});
          queryClient.invalidateQueries(["bills"]);
          setReload((prv) => !prv);
          setMultipleProducts([]);
          return createToast({
            status: "success",
            message: "Produtos adicionados com sucesso!",
          });
        })
        .catch((errorList) => {
          setLoading(false);
          if (Array.isArray(errorList?.response?.data)) {
            errorList?.response?.data?.forEach((err) => {
              if (err?.rule === "DescontoMaximo") {
                return setDiscountConfirmVisible(true);
              }

              createToast({ status: "error", message: err.message });
            });
            return;
          }

          if (err?.response?.data?.message) {
            createToast({
              status: "error",
              message: err?.response?.data?.message,
            });
            return;
          }

          createToast({
            status: "error",
            message: "Houve um erro ao salvar os produtos selecionados",
          });

          return;
        });
    },
    [multipleProducts, bill]
  );

  return (
    <>
      {addItemPermission && (
        <GrAddCircle
          className="icon"
          size={20}
          onClick={() => setVisible((prevState) => !prevState)}
        />
      )}
      <Modal
        visible={visible}
        footer={null}
        title={
          <span>
            Adicionar Item - {bill?.tag}&nbsp;&nbsp;
            {data?.client && `Cliente: ${data?.client?.name}`}&nbsp;&nbsp;
            {data?.patient && `Paciente: ${data?.patient?.name}`}
          </span>
        }
        width={1000}
        onCancel={() => setVisible((prevState) => !prevState)}
      >
        <form
          onSubmit={(e) => {
            setSubmitData({ submitFunction: submitKit });
            e.preventDefault();
            submitKit();
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
                placeholder="Produto"
                options={productOptions}
                value={formData?.productDescription}
                onChange={(val) =>
                  setFormData({ ...formData, productDescription: val })
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
                filterOption={(val, opt) =>
                  normalizeStr(opt?.value.toUpperCase()).includes(
                    normalizeStr(val.toUpperCase())
                  )
                }
                style={{ width: "100%" }}
              />
            </div>
          </div>
          {multipleProducts.map((product, i) => (
            <>
              <strong>
                {
                  productOptions?.find(
                    (variation) => variation?.id === product.productVariationId
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
                        exceedDiscount:
                          Number(e.target.value) >
                          product.maximum_discount_percentage,
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
              htmlType="submit"
              loading={loading}
            >
              Adicionar
            </Button>
          </section>
        </form>

        <hr />
        <div className="uk-flex uk-flex-column">
          <div
            className="uk-margin-top uk-flex uk-margin-small-left uk-padding-small"
            style={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
          >
            <div className="uk-margin-right">
              <strong>Aplicar desconto:</strong>
            </div>
            <Group
              className="uk-flex uk-margin-right"
              value={discountType}
              onChange={(e) => {
                setDiscountType(e.target.value);
                e.target.value === "value"
                  ? setGeneralDiscount(currencyFormatter(0))
                  : setGeneralDiscount("0");
              }}
            >
              <Radio
                value="value"
                onClick={() => setGeneralDiscount(currencyFormatter("0"))}
              >
                Valor bruto
              </Radio>
              <Radio
                value="percent"
                onClick={() => setGeneralDiscount(convertIntlCurrency("0"))}
              >
                Porcentagem
              </Radio>
            </Group>
            <div className="uk-flex uk-flex-between">
              <Input
                className="uk-width-1-1 uk-margin-right"
                value={generalDiscount}
                onChange={(e) => {
                  if (discountType === "percent" && e.target.value > 100) {
                    return createToast({
                      status: "error",
                      message: "O valor máximo é 100",
                    });
                  }

                  const value =
                    discountType === "value"
                      ? e.target.value
                      : JSON.stringify(
                          parseInt(
                            (e.target.value / 100) * data?.total_value * 100
                          )
                        );

                  setDiscountValue(value);

                  discountType === "value"
                    ? setGeneralDiscount(
                        currencyFormatter(convertIntlCurrency(value))
                      )
                    : setGeneralDiscount(e.target.value);
                }}
              />
            </div>
            {editDiscount && (
              <div className="">
                <Button
                  onClick={() => {
                    setSubmitData({ submitFunction: submitDiscount });
                    submitDiscount();
                    setEditDiscount(false);
                  }}
                  type="primary"
                >
                  Aplicar desconto
                </Button>
              </div>
            )}
          </div>
          <div className="uk-margin-small-top">
            <Table
              columns={columns}
              dataSource={productData()}
              pagination={false}
              style={{ maxHeight: "300px", overflowY: "auto" }}
            />
          </div>
          <div
            className="uk-margin-top uk-flex uk-margin-small-left uk-padding-small uk-flex-around"
            style={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
          >
            {!loading ? (
              <>
                <strong>Totais:</strong>
                <div>
                  {currencyFormatter(data?.total_value + data?.discount_value)}
                </div>
                <div>{currencyFormatter(data?.discount_value)}</div>
                <div>{currencyFormatter(data?.total_value)}</div>
              </>
            ) : (
              <section>
                <strong>Calculando...</strong>
              </section>
            )}
          </div>
        </div>
        <hr />
        <div className="uk-flex uk-flex-right">
          <ModalInfinity open={openItem} onClose={() => setOpenItem(false)}>
            <div>
              Deseja adicionar o produto {formData?.productDescription}?
              <div>
                <Button
                  type="primary"
                  className="uk-margin-small-right"
                  onClick={() => {
                    submitDiscount();
                    setFormData({});
                    setOpenItem(false);
                    setVisible((prevState) => !prevState);
                    return submitKit();
                  }}
                >
                  Sim
                </Button>
                <Button
                  onClick={() => {
                    submitDiscount();
                    setFormData({});
                    setVisible((prevState) => !prevState);
                    setOpenItem(false);
                  }}
                >
                  Não
                </Button>
              </div>
            </div>
          </ModalInfinity>
          <Button
            type="primary"
            onClick={() => {
              setSubmitData({ submitFunction: submitDiscount });
              if (multipleProducts?.length > 0) {
                setModalItem(true);
                return;
              }
              submitDiscount();
            }}
          >
            Salvar
          </Button>
        </div>
        {discountConfirmVisible && (
          <ModalInfinityForge
            open={discountConfirmVisible}
            onClose={() => setDiscountConfirmVisible(false)}
            children={
              <DiscountConfirmation
                onCancel={() => setDiscountConfirmVisible(false)}
                onConfirm={() => submitData.submitFunction(true)}
                origin="Venda"
              />
            }
          />
        )}
      </Modal>
    </>
  );
}

export default AddBillItem;
