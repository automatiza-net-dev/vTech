import { ProductCart } from "@/domain";

import { Cart } from "../interfaces";
import { transformStringToNumber } from "@/presentation/utils";

function verifyIsApproved(
  cartItem: Cart["variations"][0],
  initialCartItem?: Cart["variations"][0]
) {
  if (!initialCartItem) {
    return false;
  }

  if (transformStringToNumber(cartItem.discountValue) >  transformStringToNumber(initialCartItem.discountValue)) {
    return false;
  }

  return cartItem.approved;
}

export function formatCart(cart: Cart[], initialCart: Cart[]): ProductCart[] {
  if (!cart || cart.length === 0) {
    return [];
  }

  return cart
    ?.flatMap((item) => item.variations)
    ?.map((variation) => {
      const verifyMaxDiscount = !!variation?.exceedDiscount ? true : false;

      const initialCartItem = initialCart
        ?.flatMap((item) => item.variations)
        ?.find((item) => item.id === variation.id);

      const approved = verifyIsApproved(variation, initialCartItem);

      return {
        billItemId: variation.billItemId || "",
        budgetItemId: variation.budgetItemId || "",
        maxDiscount: verifyMaxDiscount,
        courtesy: variation?.courtesy || false,
        approved,
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
