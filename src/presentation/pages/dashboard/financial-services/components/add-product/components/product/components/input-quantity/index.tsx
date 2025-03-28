import { useFormikContext } from "formik";
import { Input } from "infinity-forge";
import { Cart } from "../../../../interfaces";
import { handleInputChangeCart } from "../../component";

export function InputQuantity({
  pathName,
  product,
  variation,
  indexProduct,
  indexVariation,
}) {
  const { values, setFieldValue } = useFormikContext<{
    cart: Cart[];
  }>();

  const cart = values["cart"];

  return (
    <Input
      type="number"
      name={pathName + `.quantity`}
      readOnly={!!product.variations?.[0]?.billItemId}
      onChangeInput={(value) => {
        handleInputChangeCart({
          cart,
          setFieldValue,
          value: value as string,
          pathName,
          indexProduct,
          indexVariation,
          fieldName: "quantity",
        });
      }}
      controlledInitialValue={{
        value: String(variation?.quantity),
      }}
    />
  );
}
