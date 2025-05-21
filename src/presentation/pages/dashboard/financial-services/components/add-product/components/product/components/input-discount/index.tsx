import { InputCurrency } from "infinity-forge";
import { getIn, useFormikContext } from "formik";

import { transformStringToNumber } from "@/presentation/utils";

import { Cart } from "../../../../interfaces";
import { handleInputChangeCart } from "../../component";
import { useEffect, useMemo } from "react";

export function InputDiscount({
  pathName,
  variation,
  indexProduct,
  indexVariation,
}) {
  const { values, setFieldValue, setFieldError } = useFormikContext<{
    cart: Cart[];
  }>();

  const cart = values["cart"];

  const maxDiscount =
    Number(variation.quantity) * Number(variation.unitaryValue);

  const getValue = getIn(values, pathName + ".discountValue");

  const isExeded = useMemo(() => {
    return (
      !variation.courtesy &&
      variation?.discountValue &&
      transformStringToNumber(variation?.discountValue) > 0 &&
      transformStringToNumber(getValue as any) >=
        (variation.maximum_discount_percentage / 100) * variation.saleValue
    );
  }, [getValue]);

  useEffect(() => {
    if (isExeded) {
      handleInputChangeCart({
        cart,
        setFieldValue,
        indexVariation,
        pathName,
        indexProduct,
        fieldName: "exceedDiscount",
        value: true,
      });
    } else {
      handleInputChangeCart({
        cart,
        setFieldValue,
        indexVariation,
        pathName,
        indexProduct,
        fieldName: "exceedDiscount",
        value: false,
      });
    }
  }, [isExeded]);

  return (
    <InputCurrency
      // controlledInitialValue={{
      //   value: String(variation?.discountValue),
      // }}
      name={pathName + `.discountValue`}
      max={maxDiscount}
      errorMessageMax={() => `Desconto exedido R$${maxDiscount}`}
      readOnly={!!(Number(variation.unitaryValue) === 0)}
      onChangeMode="blur"
      onChangeBlur={(value) => {
        handleInputChangeCart({
          cart,
          setFieldValue,
          indexVariation,
          pathName,
          indexProduct,
          fieldName: "discountValue",
          value: Number(value) > maxDiscount ? maxDiscount : (value as string),
        });

        if (
          !variation.courtesy &&
          variation?.discountValue &&
          transformStringToNumber(variation?.discountValue) > 0 &&
          transformStringToNumber(value as any) >=
            (variation.maximum_discount_percentage / 100) * variation.saleValue
        ) {
          handleInputChangeCart({
            cart,
            setFieldValue,
            indexVariation,
            pathName,
            indexProduct,
            fieldName: "exceedDiscount",
            value: true,
          });
        } else {
          handleInputChangeCart({
            cart,
            setFieldValue,
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
  );
}
