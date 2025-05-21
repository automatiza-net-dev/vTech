import { useFormikContext } from "formik";
import { InputCurrency } from "infinity-forge";

import {
  Total,
  SelectProduct,
  InputCourtesy,
  InputQuantity,
  InputDiscount,
  InputUnitaryValue,
  DiscountPercentage,
  InputTotal,
} from "./components";
import { AuthorizationStatusProduct } from "../../../authorization-status-product";

import { Cart } from "../../interfaces";

import * as S from "./styles";

export function handleInputChangeCart({
  value,
  cart,
  setFieldValue,
  pathName,
  fieldName,
  indexProduct,
  indexVariation,
}: {
  cart;
  setFieldValue;
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
        Number(quantity || 1) * formattedUnitaryValue - formattedDiscountValue;

      setFieldValue(`${pathName}.total`, total.toFixed(2));
    }
    setFieldValue(`${pathName}.${fieldName}`, value);
  } catch (err) {
    console.log(err);
  }
}

export function AddProductDefault() {
  const { values } = useFormikContext<{
    cart: Cart[];
  }>();

  const cart = values["cart"];


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
            <h3 className="font-12-bold">Autorização cortesia/desconto</h3>
          </div>
        </div>
      )}

      {cart &&
        cart?.map((product, indexProduct) => {
          return (
            <div key={indexProduct}>
              {product?.variations?.map((variation, indexVariation) => {
                const pathName = `cart[${indexProduct}].variations[${indexVariation}]`;

                const propsInput = {
                  indexProduct: indexProduct,
                  indexVariation: indexVariation,
                  pathName: pathName,
                  product: product,
                  variation: variation,
                };

                return (
                  <div key={variation.productVariationId} className="cart_item">
                    <div>
                      <h4 className="font-14-regular">
                        {variation.description}
                      </h4>
                    </div>

                    <InputQuantity {...propsInput} />

                    <InputUnitaryValue {...propsInput} />

                    <InputDiscount {...propsInput} />

                    <InputTotal {...propsInput} />

                    <InputCourtesy {...propsInput} />

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
