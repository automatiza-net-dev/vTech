import { InputCurrency } from "infinity-forge";
import { DiscountPercentage } from "../discount-percentage";

export function InputTotal({ variation, pathName }) {
  return (
    <div className="total">
      <div>
        <InputCurrency
          // controlledInitialValue={{
          //   value: String(variation?.total),
          // }}
          name={pathName + `.total`}
          readOnly
        />

        {!!variation.discountValue && (
          <DiscountPercentage variation={variation} />
        )}
      </div>
    </div>
  );
}
