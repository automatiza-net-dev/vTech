import { useFormikContext } from "formik";
import { useMemo } from "react";
import { Cart } from "../../../interfaces";

function parseNumber(value: number | string | undefined): number {
  if (typeof value === "string") {
    return Number(value.replace(",", ".")) || 0;
  }
  return value || 0;
}

export function useInformationsCart() {
  const { values } = useFormikContext<{ cart: Cart[] }>();
  const cart = values.cart ?? [];

  const informations = useMemo(() => {
    const total = { quantity: 0, discountValue: 0, total: 0 };

    for (let i = 0; i < cart.length; i++) {
      const variations = cart[i].variations ?? [];
      for (let j = 0; j < variations.length; j++) {
        const variation = variations[j];
        total.quantity += Number(variation.quantity) || 0;
        total.discountValue += parseNumber(variation.discountValue);
        total.total += parseNumber(variation.total);
      }
    }

    return {
      description: "Total",
      ...total,
    };
  }, [cart]);

  return { cart, informations };
}