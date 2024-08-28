import { ProductCart } from "@/domain";

import { Cart } from "../interfaces";

export function formatCart(cart: Cart[], maxDiscount: boolean): ProductCart[] {
  if (!cart || cart.length === 0) {
    return [];
  }

  return cart
    ?.flatMap((item) => item.variations)
    ?.map((variation) => {
      const verifyMaxDiscount =
        !!maxDiscount && !!variation?.exceedDiscount ? true : false;

      return {
        budgetItemId: variation.budgetItemId || "",
        maxDiscount: verifyMaxDiscount,
        courtesy: variation?.courtesy,
        discountValue:
          typeof variation.discountValue === "string"
            ? Number(
                (variation?.discountValue as string)?.replaceAll(",", ".") || 0
              )
            : Number(variation.discountValue || 0),
        productVariationId: variation.productVariationId,
        quantity: Number(variation.quantity),
        saleValue: variation.saleValue,
        unitaryValue:
          typeof variation.unitaryValue === "string"
            ? Number(
                (variation?.unitaryValue as string)?.replaceAll(",", ".") || 0
              )
            : Number(variation.unitaryValue || 0),
      };
    });
}
