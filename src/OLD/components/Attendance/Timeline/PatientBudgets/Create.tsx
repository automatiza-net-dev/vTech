// @ts-nocheck
import {
  Button,
  DatePicker,
  Drawer,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
} from "antd";
import moment from "moment";
import * as React from "react";
import {
  useBudgetProducts,
  useCreateBudget,
} from "@/OLD/hooks/useBudgets";
import { useProfile } from "@/OLD/hooks/useProfile";
import { useDailyMovements } from "@/OLD/hooks/useDailyMovements";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import Masks from "@/OLD/utils/masks";
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
    title: "Total",
    dataIndex: "total",
    key: "total",
  },
];

const CreateBudgetDrawer = React.memo(function CreateBudgetDrawer({
  visible,
  close,
  patient,
}) {
  const [data, setData] = React.useState({
    budgetDate: moment(),
    expirationDate: moment().add(1, "days"),
    items: [],
  });
  const [productData, setProductData] = React.useState({});
  const [addingProduct, setAddingProduct] = React.useState(false);

  const [productSearch, setProductSearch] = React.useState("");

  const { movements } = useDailyMovements();
  const { data: products } = useBudgetProducts(visible);

  const { mutate, isLoading } = useCreateBudget();
  const { clinic } = useProfile();

  const submit = React.useCallback(() => {
    mutate(
      {
        expirationDate: data.expirationDate,
        budgetDate: data.budgetDate,
        patientId: patient.id,
        clientId: patient.tutor.id,
        observation: data.observation,
        dailyMovementId: data.dailyMovementId,
        items: data.items,
      },
      {
        onSuccess: () => {
          setData({
            budgetDate: moment(),
            expirationDate: moment().add(1, "days"),
            items: [],
          });
          close();
        },
      }
    );
  }, [data]);

  const submitProduct = React.useCallback(() => {
    const correctUnitValue = convertIntlCurrency(productData.unitaryValue);
    const correctDiscountValue = convertIntlCurrency(productData.discountValue);

    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productVariationId: productData.productVariationId,
          quantity: productData.quantity,
          unitaryValue: correctUnitValue,
          discountValue: correctDiscountValue,
        },
      ],
    }));

    setProductData({});
  }, [data, productData]);

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

  const existingProducts = data?.items?.map((i) => i.productVariationId);
  const selectedProducts = products
    ?.map((p) => p.variations)
    .flat()
    .filter((v) => existingProducts?.includes(v.id));

  const productOptions = products
    ?.filter((p) =>
      p.description.toUpperCase().includes(productSearch.toUpperCase())
    )
    .map((p) => p.variations)
    .flat();

  const productsData = React.useMemo(() => {
    if (selectedProducts) {
      return selectedProducts.map((elem) => {
        const item = data.items.find((i) => i.productVariationId === elem.id);

        return {
          key: elem.id,
          product: [elem.product.description, elem.product.reference_code].join(
            " - "
          ),
          quantity: item.quantity,
          value: Masks.money((item.unitaryValue * 100).toString()),
          total: Masks.money(
            (item.unitaryValue * item.quantity * 100).toString()
          ),
        };
      });
    }

    return [];
  }, [selectedProducts]);

  const { getWord } = useDictionary()

  return (
    <>
      <Drawer
        title={`Criar ${words["orcamento"]}`}
        visible={visible}
        onOk={() => {
          close();
        }}
        onClose={() => {
          close();
        }}
        width="40%"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
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

            <div className="uk-width-1-1">
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
              <label>Observação</label>
              <Input
                value={data?.observation}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, observation: e.target.value }))
                }
              />
            </div>

            <hr />

            <div className="uk-width-1-1">
              <div className="uk-width-1-1 uk-flex uk-flex-between">
                <span>Produtos</span>
                <Button size={"small"} onClick={() => setAddingProduct(true)}>
                  Adicionar
                </Button>
              </div>

              <Table
                columns={columns}
                dataSource={productsData}
                pagination={false}
              />
            </div>
            <hr />

            <Button htmlType="submit" type="primary" disabled={isLoading}>
              Criar {getWord("Orçamento")}
            </Button>
          </div>
        </form>
      </Drawer>

      <Modal
        title="Adicionar produto"
        visible={addingProduct}
        onClose={() => {
          setProductData({});
          setAddingProduct(false);
        }}
        onCancel={() => {
          setProductData({});
          setAddingProduct(false);
        }}
        width={650}
        footer={null}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitProduct();
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingTop: "1rem",
          }}
        >
          <div className="uk-width-1-1">
            <label>Produto</label>

            <Select
              placeholder="Produto"
              showSearch
              onSearch={(val) => setProductSearch(val)}
              optionFilterProp="children"
              value={productData?.productVariationId}
              onChange={(value) => {
                const numVal = products
                  .find(
                    (product) =>
                      product.variations?.find(
                        (variation) => variation.id === value
                      )?.id === value
                  )
                  .variations?.find((variation) => variation.id === value)
                  ?.businessUnitProducts[0]?.price;

                setProductData((prevState) => ({
                  ...prevState,
                  productVariationId: value,
                  unitaryValue: numVal
                    ? Masks.money((numVal * 100).toString())
                    : null,
                  quantity: 1,
                  discountValue: Masks.money("0"),
                }));
                setProductSearch("");
              }}
              style={{ width: "100%" }}
            >
              {productOptions?.map((variation) => (
                <Select.Option
                  key={variation.id}
                  value={variation.id}
                  disabled={selectedProducts?.find(
                    (item) => item.productVariationId === variation.id
                  )}
                >
                  {[
                    variation.product.description,
                    `Cod.: (${variation.product.reference_code})`,
                  ].join(" - ")}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="uk-width-1-1">
            <label>Quantidade</label>
            <InputNumber
              placeholder="Quantidade"
              value={productData?.quantity}
              onChange={(value) =>
                setProductData((prevState) => ({
                  ...prevState,
                  quantity: value,
                }))
              }
              min={1}
              style={{ width: "100%" }}
            />
          </div>

          <div className="uk-width-1-1">
            <label>Valor Unitário</label>

            <Input
              disabled={!clinic?.unitConfig?.alter_prices}
              placeholder="Valor Unitário"
              value={productData?.unitaryValue}
              onChange={(e) =>
                setProductData((prevState) => ({
                  ...prevState,
                  unitaryValue: Masks.money(e.target.value),
                }))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div className="uk-width-1-1">
            <label>Valor de Desconto</label>

            <Input
              placeholder="Valor de Desconto"
              value={productData?.discountValue}
              onChange={(e) =>
                setProductData((prevState) => ({
                  ...prevState,
                  discountValue: Masks.money(e.target.value),
                }))
              }
              style={{ width: "100%" }}
            />
          </div>

          <hr />
          <footer className="uk-flex uk-flex-right">
            <div className="uk-width-1-2 uk-flex uk-flex-around">
              <Button htmlType="submit" type="primary" disabled={isLoading}>
                Salvar
              </Button>
              <Button
                onClick={() => {
                  setProductData({});
                  setAddingProduct(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          </footer>
        </form>
      </Modal>
    </>
  );
});

export default CreateBudgetDrawer;
