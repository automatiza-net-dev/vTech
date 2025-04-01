import { useFormikContext } from "formik";
import { InputCurrency } from "infinity-forge";
import { useSystem } from "@/presentation/hooks";

import { Cart } from "../../../../interfaces";
import { handleInputChangeCart } from "../../component";

export function InputUnitaryValue({
  pathName,
  variation,
  indexProduct,
  indexVariation,
}) {
  const { values, setFieldValue } = useFormikContext<{
    cart: Cart[];
  }>();

  const cart = values["cart"];

  const { unit } = useSystem();

  const isPossibleChangePricesProducs = unit?.configs?.businessUnits?.alter_prices;

  return (
    <InputCurrency
      name={pathName + `.unitaryValue`}
      readOnly={!isPossibleChangePricesProducs || variation?.courtesy}
      onChangeMode="blur"
      onChangeBlur={(value) => {
        handleInputChangeCart({
          cart,
          setFieldValue,
          value: value as string,
          pathName,
          indexProduct,
          indexVariation,
          fieldName: "unitaryValue",
        });
      }}
      // controlledInitialValue={{
      //   value: String(variation?.unitaryValue),
      // }}
    />
  );
}
