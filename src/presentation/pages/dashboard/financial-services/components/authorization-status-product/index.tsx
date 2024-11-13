import { Product } from "@/domain";

import { Waiting } from "./waiting";
import { Aprroved } from "./approved";
import { Reproved } from "./reproved";
import { Cart } from "../add-product";

export type StatusAuthorizationProduct =
  | "approved"
  | "reproved"
  | "waiting"
  | "dont-need-aprove";

export function useAuthorizationStatusProduct(
  props?: Product | Cart
): StatusAuthorizationProduct {
  if (props?.approved) {
    return "approved";
  }

  if ((props?.courtesy || props?.max_discount) && props?.courtesy_approved_at) {
    return "reproved";
  }

  if (
    (props?.courtesy || props?.max_discount) &&
    props?.courtesy_approved_at === null
  ) {
    return "waiting";
  }

  return "dont-need-aprove";
}

export function AuthorizationStatusProduct({
  item,
}: {
  item?: Product | Cart;
}) {
  const status = useAuthorizationStatusProduct(item);

  if (status === "dont-need-aprove" || !item) return <></>;

  if (status === "approved") {
    return <Aprroved {...item} />;
  }

  if (status === "reproved") {
    return <Reproved {...item} />;
  }

  if (status === "waiting") {
    return <Waiting />;
  }
}
