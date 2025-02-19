import { useFormikContext } from "formik";
import { Icon, Input, useAuthAdmin, InputCurrency } from "infinity-forge";

import { DiscountPercentage, SelectProduct, Total } from "./components";
import { AuthorizationStatusProduct } from "@/presentation";

import { Cart } from "./interfaces";

import * as S from "./styles";

export function AddProduct() {
  const { values, setFieldValue, setFieldError } = useFormikContext<{
    cart: Cart[];
    product_selected: string | undefined;
    clientId?: string;
  }>();

  const { user } = useAuthAdmin();

  const cart = values["cart"];
  const isPossibleChangePricesProducs = user?.unit?.unitConfig?.alter_prices;

  console.log(values["cart"]);

  function handleInputChange({
    value,
    pathName,
    fieldName,
    indexProduct,
    indexVariation,
  }: {
    pathName: string;
    fieldName: string;
    indexProduct: number;
    value: string | number | boolean;
    indexVariation: number;
  }) {
    try {
      const product = cart[indexProduct];
      const variation = product.variations[indexVariation];

      setFieldValue(`${pathName}.${fieldName}`, value);

      if (typeof value !== "boolean") {
        const quantity = fieldName === "quantity" ? value : variation.quantity;
        const unitaryValue =
          fieldName === "unitaryValue" ? value : variation.unitaryValue;
        const discountValue =
          fieldName === "discountValue" ? value : variation.discountValue;

        const formattedUnitaryValue =
          typeof unitaryValue === "number"
            ? unitaryValue
            : Number(unitaryValue?.replaceAll(",", ".") || 0);

        const formattedDiscountValue =
          typeof discountValue === "number"
            ? discountValue
            : Number(discountValue?.replaceAll(",", ".") || 0);

        const total =
          Number(quantity || 1) * formattedUnitaryValue -
          formattedDiscountValue;

        setFieldValue(`${pathName}.total`, total.toFixed(2));
      }
      setFieldValue(`${pathName}.${fieldName}`, value);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <S.AddProduct
      style={{ minHeight: !cart || cart.length < 4 ? 335 : "unset" }}
    >
      <SelectProduct />

      {cart && (
        <div className="head_cart">
          <div>
            <h3 className="font-12-bold">PRODUTO</h3>
          </div>

          <div>
            <h3 className="font-12-bold">QUANTIDADE</h3>
          </div>

          <div>
            <h3 className="font-12-bold">VALOR UNITÁRIO</h3>
          </div>

          <div>
            <h3 className="font-12-bold">DESCONTO</h3>
          </div>

          <div>
            <h3 className="font-12-bold">TOTAL</h3>
          </div>
          <div>
            <h3 className="font-12-bold">CORTESIA</h3>
          </div>
          <div>
            <h3 className="font-12-bold">Dados Autorização</h3>
          </div>
        </div>
      )}

      {cart &&
        cart?.map((product, indexProduct) => {
          return (
            <div key={indexProduct}>
              {product?.variations?.map((variation, indexVariation) => {
                const pathName = `cart[${indexProduct}].variations[${indexVariation}]`;

                const maxDiscount =
                  Number(variation.quantity) * Number(variation.unitaryValue);

                const percentageDiscount = (
                  (Number(
                    (typeof variation.discountValue === "string"
                      ? (variation.discountValue as string).replaceAll(",", ".")
                      : variation.discountValue) || 0
                  ) /
                    (Number(variation.quantity || 1) *
                      Number(variation.unitaryValue || 0))) *
                  100
                ).toFixed(2);

                return (
                  <div key={variation.productVariationId} className="cart_item">
                    <div>
                      <h4 className="font-14-regular">
                        {variation.description}
                      </h4>
                    </div>

                    <Input
                      type="number"
                      name={pathName + `.quantity`}
                      readOnly={!!product.variations?.[0]?.billItemId}
                      onChangeInput={(value) => {
                        handleInputChange({
                          value: value as string,
                          pathName,
                          indexProduct,
                          indexVariation,
                          fieldName: "quantity",
                        });
                      }}
                      controlledInitialValue={{
                        value: String(variation?.quantity),
                      }}
                    />

                    <InputCurrency
                      name={pathName + `.unitaryValue`}
                      readOnly={!isPossibleChangePricesProducs || variation?.courtesy}
                      onChangeInput={(value) => {
                        handleInputChange({
                          value: value as string,
                          pathName,
                          indexProduct,
                          indexVariation,
                          fieldName: "unitaryValue",
                        });
                      }}
                      controlledInitialValue={{
                        value: String(variation?.unitaryValue),
                      }}
                    />

                    <InputCurrency
                      controlledInitialValue={{
                        value: String(variation?.discountValue),
                      }}
                      name={pathName + `.discountValue`}
                      max={maxDiscount}
                      errorMessageMax={() =>
                        `Desconto exedido R$${maxDiscount}`
                      }
                      readOnly={!!(Number(variation.unitaryValue) === 0)}
                      onChangeInput={(value) => {
                        handleInputChange({
                          indexVariation,
                          pathName,
                          indexProduct,
                          fieldName: "discountValue",
                          value:
                            Number(value) > maxDiscount
                              ? maxDiscount
                              : (value as string),
                        });

                        function transformarStringParaNumero(str) {
                          if(!str) {
                            return 0
                          }

                          return parseFloat(str.replace(',', '.'));
                        }

                        if (
                          !variation.courtesy &&
                          variation?.discountValue &&
                          transformarStringParaNumero(variation?.discountValue) > 0 &&
                          transformarStringParaNumero(value) >=
                            (variation.maximum_discount_percentage / 100) *
                              variation.saleValue
                        ) {
                          handleInputChange({
                            indexVariation,
                            pathName,
                            indexProduct,
                            fieldName: "exceedDiscount",
                            value: true,
                          });
                        } else {
                          handleInputChange({
                            indexVariation,
                            pathName,
                            indexProduct,
                            fieldName: "exceedDiscount",
                            value: false,
                          });
                        }

                        if (Number(value) > maxDiscount) {
                          setTimeout(() => {
                            setFieldError(
                              pathName + `.discountValue`,
                              "O valor do desconto, não pode ser maior que o valor total."
                            );
                          }, 500);
                        }
                      }}
                    />

                    <div className="total">
                      <div>
                        <InputCurrency
                          controlledInitialValue={{
                            value: String(variation?.total),
                          }}
                          name={pathName + `.total`}
                          readOnly
                        />

                        {!!variation.discountValue && (
                          <DiscountPercentage
                            percentageDiscount={Number(
                              percentageDiscount.replaceAll(",", ".")
                            )}
                            maximum_discount_percentage={
                              variation.maximum_discount_percentage
                            }
                          />
                        )}
                      </div>
                    </div>
                    <div className="cortesia">
                      <div>
                        <input
                          type="checkbox"
                          disabled={!product?.courtesy}
                          checked={product?.variations?.[0]?.courtesy}
                          onChange={(e) => {
                            handleInputChange({
                              value: !variation?.courtesy as boolean,
                              pathName,
                              indexProduct,
                              indexVariation,
                              fieldName: "courtesy",
                            });

                            if (e.target.checked) {
                              handleInputChange({
                                value: 0,
                                pathName,
                                indexProduct,
                                indexVariation,
                                fieldName: "unitaryValue",
                              });

                              handleInputChange({
                                value: 0,
                                pathName,
                                indexProduct,
                                indexVariation,
                                fieldName: "discountValue",
                              });
                              
                              handleInputChange({
                                value: 0,
                                pathName,
                                indexProduct,
                                indexVariation,
                                fieldName: "total",
                              });

                            } else {
                              handleInputChange({
                                value: variation?.saleValue,
                                pathName,
                                indexProduct,
                                indexVariation,
                                fieldName: "unitaryValue",
                              });
                            }
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        className="delete"
                        onClick={() => {
                          setFieldValue(
                            "cart",
                            cart.filter(
                              (_, cartIndex) => cartIndex !== indexProduct
                            )
                          );
                        }}
                      >
                        <Icon name="IconDelete" />
                      </button>
                    </div>

                    <div className="dados-autorizacao">
                      <AuthorizationStatusProduct item={product} />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

      <Total />
    </S.AddProduct>
  );
}
