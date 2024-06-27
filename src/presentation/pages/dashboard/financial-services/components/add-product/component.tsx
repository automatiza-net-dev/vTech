import { useFormikContext } from "formik";
import { Icon, Input, useAuthAdmin, InputCurrency } from "infinity-forge";

import { User } from "@/domain";
import { DiscountPercentage, SelectProduct, Total } from "./components";

import { Cart } from "./interfaces";

import * as S from "./styles";

export function AddProduct() {
  const { values, setFieldValue, setFieldError } = useFormikContext<{
    cart: Cart[];
    product_selected: string | undefined;
  }>();

  const { GetUser } = useAuthAdmin();

  const cart = values["cart"];
  const user = GetUser<User>();
  const isPossibleChangePricesProducs = user.unit.unitConfig?.alter_prices;

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
    value: string | number;
    indexVariation: number;
  }) {
    try {
      const product = cart[indexProduct];
      const variation = product.variations[indexVariation];

      setFieldValue(`${pathName}.${fieldName}`, value);

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
        Number(quantity || 1) * formattedUnitaryValue - formattedDiscountValue;

      setFieldValue(`${pathName}.total`, total.toFixed(2));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <S.AddProduct style={{ minHeight: !cart || cart.length < 4 ? 335 : "unset" }}>
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
                      onChangeInput={(value) => {
                        handleInputChange({
                          value: value as string,
                          pathName,
                          indexProduct,
                          indexVariation,
                          fieldName: "quantity",
                        });
                      }}
                    />

                    <InputCurrency
                      type="number"
                      name={pathName + `.unitaryValue`}
                      readOnly={!isPossibleChangePricesProducs}
                      onChangeInput={(value) => {
                        handleInputChange({
                          value: value as string,
                          pathName,
                          indexProduct,
                          indexVariation,
                          fieldName: "unitaryValue",
                        });
                      }}
                    />

                    <InputCurrency
                      type="number"
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
                            Number(value) > maxDiscount ? maxDiscount : value as string,
                        });

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
                          type="number"
                          name={pathName + `.total`}
                          readOnly
                        />

                        {!!variation.discountValue && (
                          <DiscountPercentage
                            percentageDiscount={Number(percentageDiscount.replaceAll(",", "."))}
                            maximum_discount_percentage={
                              variation.maximum_discount_percentage
                            }
                          />
                        )}
                      </div>

                      <button
                        type="button"
                        className="delete"
                        onClick={() =>
                          setFieldValue(
                            "cart",
                            cart.filter(
                              (_, cartIndex) => cartIndex !== indexProduct
                            )
                          )
                        }
                      >
                        <Icon name="IconDelete" />
                      </button>
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
