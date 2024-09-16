import { RemoteBills, RemoteBudget } from "@/data";
import { container, TypesAutomatiza } from "@/container";

import { Cart } from "../components";

export async function DeleteCartItems(
  cart: Cart[],
  newCart: Cart[],
  isBill?: boolean
) {
  const getItensToDelete = (cart || [])?.filter(
    (initialItem) =>
      !newCart.some(
        (cartItem) =>
          initialItem.variations?.[0]?.id === cartItem.variations?.[0]?.id
      )
  );

  for (const item of getItensToDelete) {
    const idToDelete = item.variations?.[0]?.id;

    if (idToDelete) {
      if (isBill) {
        await container
          .get<RemoteBills>(TypesAutomatiza.RemoteBills)
          .deleteBillItem({ id: idToDelete });
      } else {
        await container
          .get<RemoteBudget>(TypesAutomatiza.RemoteBudget)
          .deleteBudgetItem({ id: idToDelete });
      }
    }
  }
}
