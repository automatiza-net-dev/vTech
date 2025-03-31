import { useFormikContext } from "formik";
import { Icon } from "infinity-forge";
import { Cart } from "../../../../interfaces";
import { handleInputChangeCart } from "../../component";

import * as S from "./styles"

export function InputCourtesy({
  product,
  pathName,
  variation,
  indexProduct,
  indexVariation,
}: {
  variation;
  product: any;
  pathName: string;
  indexProduct: number;
  indexVariation: number;
}) {
  const { values, setFieldValue } = useFormikContext<{
    cart: Cart[];
  }>();

  const cart = values["cart"];

  return (
    <S.InputCourtesy>
      <div>
        <input
          type="checkbox"
          disabled={!product?.courtesy}
          checked={product?.variations?.[0]?.courtesy}
          onChange={(e) => {
            handleInputChangeCart({
              cart,
              setFieldValue,
              value: !variation?.courtesy as boolean,
              pathName,
              indexProduct,
              indexVariation,
              fieldName: "courtesy",
            });

            if (e.target.checked) {
              handleInputChangeCart({
                cart,
                setFieldValue,
                value: 0,
                pathName,
                indexProduct,
                indexVariation,
                fieldName: "unitaryValue",
              });

              handleInputChangeCart({
                cart,
                setFieldValue,
                value: 0,
                pathName,
                indexProduct,
                indexVariation,
                fieldName: "discountValue",
              });

              handleInputChangeCart({
                cart,
                setFieldValue,
                value: 0,
                pathName,
                indexProduct,
                indexVariation,
                fieldName: "total",
              });
            } else {
              handleInputChangeCart({
                cart,
                setFieldValue,
                value: variation?.saleValue,
                pathName,
                indexProduct,
                indexVariation,
                fieldName: "unitaryValue",
              });
            }
          }}
        />
      </div>
      <button
        type="button"
        className="delete"
        onClick={() => {
          setFieldValue(
            "cart",
            cart.filter((_, cartIndex) => cartIndex !== indexProduct)
          );
        }}
      >
        <Icon name="IconDelete" />
      </button>
    </S.InputCourtesy>
  );
}
