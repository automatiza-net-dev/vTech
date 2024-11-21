import { useFormikContext } from "formik";
import { Select, formatNumberToCurrency } from "infinity-forge";

import { useLoadAllProducts } from "@/presentation";

import { Cart } from "../../interfaces";

export function SelectProduct() {
  const { values, setFieldValue } = useFormikContext<{
    cart: Cart[];
    product_selected: string | undefined;
  }>();

  const cart = values["cart"];
  const productsList = useLoadAllProducts();

  const options =
    productsList.data?.map((product) => {
      const sanclaDescription =
        product.description +
        (product.reference_code
          ? " - Cod: " +
            product.reference_code +
            " | " +
            formatNumberToCurrency(
              product?.variations?.[0]?.businessUnitProducts?.[0]?.price
            )
          : "");

      const liftOneDescription =
        product.description +
        (product.reference_code ? " - Cod: " + product.reference_code : "");

      return {
        label:
          process.env.client === "sancla"
            ? sanclaDescription
            : liftOneDescription,
        value: product.id,
      };
    }) || [];

  function handleChange(value) {
    const findProduct = productsList.data?.find(
      (product) => product.id === value
    );

    const cartItem = {
      id: findProduct?.id,
      courtesy: findProduct?.courtesy,
      variations: findProduct?.variations?.map(
        ({
          id,
          product: { description, reference_code },
          businessUnitProducts,
        }) => {
          const price = businessUnitProducts[0]?.price;
          const name =
            description + (reference_code && " - Cod: " + reference_code);

          return {
            quantity: 1,
            total: price,
            saleValue: price,
            discountValue: 0,
            description: name,
            unitaryValue: price,
            productVariationId: id,
            maximum_discount_percentage:
              businessUnitProducts[0].maximum_discount_percentage,
            toSubmit: true,
          };
        }
      ),
    };

    if (findProduct) {
      setFieldValue("cart", cart ? [...cart, cartItem] : [cartItem]);
    }
  }

  if (!options || options.length === 0) {
    return <></>;
  }

  return (
    <div className="select_product">
      <Select
        menuPlacement="bottom"
        onlyOneValue
        options={options}
        name="product_selected"
        placeholder="Selecionar para adicionar"
        label="Adicionar um produto/serviço"
        loading={productsList.isFetching}
        onChangeInput={handleChange}
      />
    </div>
  );
}
