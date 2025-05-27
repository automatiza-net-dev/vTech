// @ts-nocheck
import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import { productService } from "@/OLD/services/product.service";

import { useGetBillProducts } from "@/OLD/hooks/useBills";

import { Table, AutoComplete, Input, Modal, Switch, Popconfirm } from "antd";
import { Button, useToast } from "infinity-forge";
import { Container } from "./styles";

import { FiTrash2, FiEdit2 } from "react-icons/fi";

import { actionsColumns } from "@/OLD/components/ProductsGroup/Columns";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

const AddOrRemoveItem = memo(function AddOrRemoveItem({
  kit,
  update,
  setReload,
  reload,
  action,
  loadingUpdate,
}) {
  const [formattedItems, setFormattedItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [data, setData] = useState({});
  const { createToast } = useToast();
  const { data: products } = useGetBillProducts(true);

  const router = useRouter();

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

  /*products
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
    })); */

  const formatItems = () => {
    setFormattedItems(
      kit?.items?.map((item) => ({
        code: item?.id,
        description: item?.product?.description,
        price: currencyFormatter(item?.product?.sale_price),
        originalPrice: currencyFormatter(item?.product?.original_price),
        quantity: item?.product?.quantity,
        discountValue: currencyFormatter(item?.product?.discount_price),
        actions: (
          <div className="uk-flex uk-flex-around">
            <FiEdit2
              onClick={() => {
                setData({
                  itemId: item?.id,
                  kitId: kit?.id,
                  quantity: item?.product?.quantity,
                  description: item?.product?.description,
                  productVariationId: item?.product?.variation_id,
                  active: item?.product?.active,
                  discountPercentage: item?.product?.discount_percentage,
                  discountPrice: currencyFormatter(
                    item?.product?.discount_price
                  ),
                });
                setUpdateVisible(true);
              }}
              style={{ cursor: 'pointer', fontSize: '1.2rem' }}
            />
            <Popconfirm
              title="Deseja realmete excluir esse item?"
              onConfirm={() => removeItem(item?.id)}
              okText="Sim"
              cancelText="Não"
              placement="left"
            >
              <FiTrash2
                className="uk-margin-small-left"
                style={{ cursor: 'pointer', fontSize: '1.2rem' }}
              />
            </Popconfirm>
          </div>
        ),
      }))
    );
  };

  const addItem = useCallback(() => {
    setLoading(true);
    productService
      .addItemProductGroup({
        kitId: kit?.id,
        productVariationId: selectedProduct?.variations[0]?.id,
        quantity: selectedProduct?.quantity,
        discountPrice: convertIntlCurrency(selectedProduct?.discountPrice),
        discountPercentage: selectedProduct?.discountPercentage,
      })
      .then((_res) => {
        setLoading(false);
        setSelectedProduct({});
        setReload((prv) => !prv);
      })
      .catch((_err) => {
        setLoading(false);
        createToast({
          message:
            "Houve um erro ao adicionar o produto, verifique os campos informados",
          status: "error",
        });
      });
  }, [kit, selectedProduct]);

  const removeItem = (id) => {
    setLoading(true);
    productService
      .removeKitItem(id)
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        return createToast({
          message: "item removido removido com sucesso!",
          status: "success",
        });
      })
      .catch((_err) => {
        setLoading(false);

        return createToast({
          message: "Houve um erro ao remover o item",
          status: "error",
        });
      });
  };

  const updateItem = useCallback(() => {
    setLoading(true);
    productService
      .updateKitItem(data?.itemId, {
        kitId: data?.kitId,
        productVariationId: data?.productVariationId,
        quantity: data?.quantity,
        discountPrice: convertIntlCurrency(data?.discountPrice),
        discountPercentage: data?.discountPercentage,
        active: data?.active,
      })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        setUpdateVisible(false);
        return createToast({
          message: "Item atualizado com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        setLoading(false);

        return createToast({
          message:
            "Houve um erro ao atualizar o item, verifique os campos informados",
          status: "error",
        });
      });
  }, [selectedProduct, data]);

  useEffect(() => {
    kit?.items?.length > 0 ? formatItems() : setFormattedItems([]);
  }, [kit, reload]);

  return (
    <Container className="uk-margin-top">
      <section>
        <div className="uk-flex uk-flex-around uk-margin-top uk-flex-middle">
          <div className="uk-width-2-3 uk-margin-small-right">
            <label>Adicionar produto</label>
            <AutoComplete
              options={productOptions}
              value={selectedProduct?.value}
              onChange={(val) => {
                setSelectedProduct({ value: val });
              }}
              onSelect={(_val, opt) => {
                setSelectedProduct({
                  ...opt,
                  discountPrice: currencyFormatter(0),
                  discountPercentage: 0,
                  quantity: 1,
                  unitPrice: currencyFormatter(
                    opt?.variations[0].businessUnitProducts[0]?.price
                  ),
                });
              }}
              filterOption={(val, opt) =>
                normalizeStr(opt?.value.toUpperCase()).includes(
                  normalizeStr(val.toUpperCase())
                )
              }
              className="uk-width-1-1"
            />
          </div>
          {selectedProduct?.id && (
            <>
              <div className="uk-margin-small-right">
                <label>Quantidade</label>
                <br />
                <Input
                  value={selectedProduct?.quantity}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>
              <div className="uk-margin-small-right">
                <label>Valor unitário</label>
                <br />
                <Input value={selectedProduct?.unitPrice} disabled />
              </div>
              <div className="uk-margin-small-right">
                <label>Desconto R$</label>
                <br />
                <Input
                  value={selectedProduct?.discountPrice}
                  onChange={(e) => {
                    setSelectedProduct({
                      ...selectedProduct,
                      discountPrice: currencyFormatter(
                        convertIntlCurrency(e.target.value)
                      ),
                      discountPercentage: parseFloat(
                        (convertIntlCurrency(e.target.value) /
                          (selectedProduct?.quantity *
                            convertIntlCurrency(selectedProduct?.unitPrice))) *
                          100
                      ).toFixed(2),
                    });
                  }}
                />
              </div>
              <div className="uk-margin-small-right">
                <label>Desconto (%)</label>
                <br />
                <Input
                  value={selectedProduct?.discountPercentage}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      discountPercentage: e.target.value,
                      discountPrice: currencyFormatter(
                        (e.target.value.replace(",", ".") / 100) *
                          selectedProduct?.quantity *
                          convertIntlCurrency(selectedProduct?.unitPrice)
                      ),
                    })
                  }
                />
              </div>
              <div className="uk-margin-small-right">
                <label>Valor Total</label>
                <br />
                <Input
                  disabled
                  value={currencyFormatter(
                    selectedProduct?.quantity *
                      convertIntlCurrency(selectedProduct?.unitPrice) -
                      convertIntlCurrency(selectedProduct?.discountPrice)
                  )}
                />
              </div>
              <div className="uk-margin-top">
                <Button onClick={() => addItem()} text="Adicionar" />
              </div>
            </>
          )}
        </div>
      </section>
      <section className="uk-margin-top">
        <Table
          columns={actionsColumns}
          dataSource={formattedItems}
          footer={() => (
            <section className="uk-flex uk-flex-right">
              <div className="sum-box">
                <div>
                  <strong>Total:</strong>
                </div>
                <div>
                  {currencyFormatter(
                    kit?.items?.reduce(
                      (acc, current) =>
                        acc +
                        current.product?.quantity *
                          current?.product?.original_price,
                      0
                    )
                  )}
                </div>
                <div>
                  {currencyFormatter(
                    kit?.items?.reduce(
                      (acc, current) => acc + current?.product?.discount_price,
                      0
                    )
                  )}
                </div>
                <div>
                  {currencyFormatter(
                    kit?.items?.reduce(
                      (acc, current) => acc + current?.product?.sale_price,
                      0
                    )
                  )}
                </div>
              </div>
            </section>
          )}
        />
      </section>
      <Modal
        title="atualizar item"
        visible={updateVisible}
        footer={null}
        onCancel={() => setUpdateVisible(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateItem();
          }}
        >
          <section>
            <h4 className="uk-margin-remove">{data?.description}</h4>
            <section className="uk-margin-small-top uk-flex uk-flex-right">
              <label>Ativo:</label>
              &nbsp;
              <Switch
                checked={data?.active}
                onChange={(val) => setData({ ...data, active: val })}
              />
            </section>
          </section>
          <div className="uk-margin-small-top">
            <label>Quantidade</label>
            <Input
              value={data?.quantity}
              onChange={(e) => setData({ ...data, quantity: e.target.value })}
            />
          </div>
          <div className="uk-margin-small-top">
            <label>Desconto (R$)</label>
            <Input
              value={data?.discountPrice}
              onChange={(e) =>
                setData({
                  ...data,
                  discountPrice: currencyFormatter(
                    convertIntlCurrency(e.target.value)
                  ),
                })
              }
            />
          </div>
          <div className="uk-margin-small-top">
            <label>Desconto (%)</label>
            <br />
            <Input
              type="number"
              value={data?.discountPercentage}
              onChange={(e) =>
                setData({
                  ...data,
                  discountPercentage: e.target.value,
                })
              }
            />
          </div>
          <hr />
          <footer className="uk-flex uk-flex-right">
            <div className="uk-flex uk-width-1-2 uk-flex-right uk-flex-around">
              <Button type="submit" text="Salvar" />

              <Button onClick={() => setUpdateVisible(false)} text="Fechar" />
            </div>
          </footer>
        </form>
      </Modal>
      <footer
        style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
      >
        <Button text="Voltar" onClick={() => router.back()} />

        {action === "update" && (
          <Button
            text={loadingUpdate ? "Carregando..." : "Salvar"}
            onClick={() => !loadingUpdate && update()}
          />
        )}
      </footer>
    </Container>
  );
});

export default AddOrRemoveItem;
