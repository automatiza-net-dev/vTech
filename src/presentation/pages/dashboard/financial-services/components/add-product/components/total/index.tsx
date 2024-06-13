import { useFormikContext } from "formik";
import { formatNumberToCurrency } from "infinity-forge";

import { Cart } from "../../interfaces";

import * as S from "./styles";

export function Total() {
  const { values } = useFormikContext<{
    cart: Cart[];
  }>();

  const cart = values["cart"];

  const totalCart = cart?.reduce((reducer, cartItem) => {
    return {
      description: "Total",
      quantity:
        (reducer.quantity || 0) +
        cartItem.variations.reduce(
          (reducer, variation) => reducer + Number(variation.quantity),
          0
        ),
      discountValue:
        (reducer.discountValue || 0) +
        cartItem.variations.reduce((reducer, variation) => {
          const discountVariation =
            typeof variation.discountValue === "string"
              ? Number((variation.discountValue as any).replaceAll(",", "."))
              : variation.discountValue;

          return reducer + discountVariation;
        }, 0),
        total:
        (reducer.total || 0) +
        cartItem.variations.reduce((reducer, variation) => {
          const discountVariation =
            typeof variation.total === "string"
              ? Number((variation.total as any).replaceAll(",", "."))
              : variation.total;

          return reducer + discountVariation;
        }, 0),
    };
  }, {} as { quantity: number; discountValue: number; total: number });

  if (!cart || cart.length === 0 || totalCart?.quantity === 0) {
    return <></>;
  }

  return (
    <S.Total>
      <div className="font-14">
        <strong className="-bold">Quantidade:</strong>{" "}
        <span className="-regular">{totalCart.quantity}</span>
      </div>

      <div className="font-14">
        <strong className="-bold">Desconto:</strong>{" "}
        <span className="-regular">
          {formatNumberToCurrency(totalCart.discountValue)}
        </span>
      </div>

      <div className="font-14">
        <strong className="-bold">Total:</strong>{" "}
        <span className="-regular">
          {formatNumberToCurrency(totalCart.total)}
        </span>
      </div>
    </S.Total>
  );
}
