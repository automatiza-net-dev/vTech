import { formatNumberToCurrency } from "infinity-forge";

import { useInformationsCart } from "../../utils";
import { ApplyDiscount } from "../apply-discount";

import * as S from "./styles";

export function Total() {
  const { informations, cart } = useInformationsCart();

  if (!cart || cart.length === 0 || informations?.quantity === 0) {
    return <></>;
  }

  return (
    <>
      <S.Total>
        <div className="font-14">
          <strong className="-bold">Quantidade:</strong>{" "}
          <span className="-regular">{informations.quantity}</span>
        </div>

        <div className="font-14">
          <strong className="-bold">Desconto:</strong>{" "}
          <span className="-regular">
            {formatNumberToCurrency(informations.discountValue)}
          </span>
        </div>

        <div className="font-14">
          <strong className="-bold">Total:</strong>{" "}
          <span className="-regular">
            {formatNumberToCurrency(informations.total)}
          </span>
        </div>
      </S.Total>

      <ApplyDiscount />
    </>
  );
}
