import { useFormikContext } from "formik";
import { Button, InputCurrency, InputRadio } from "infinity-forge";

import * as S from "./styles";
import { Cart } from "../../../../interfaces";

export function ApplyDiscount() {
  const { values, setFieldValue } = useFormikContext<{
    cart: Cart[];
    discount: string;
    discountType: "percent" | "fixed";
  }>();

  return (
    <S.ApplyDiscount>
      <h3 className="font-16-bold">Desconto geral da venda</h3>

      <div className="row">
        <InputRadio
          name="discountType"
          options={[
            { label: "Desconto em %", value: "percent" },
            { label: "Desconto em R$", value: "fixed" },
          ]}
        />

        <div style={{ width: 200 }}>
          <InputCurrency
            prefix=" "
            name="discount"
            placeholder="Desconto"
            onChangeMode="blur"
            decimalLimit={2}
          />
        </div>

        <Button
          type="button"
          onClick={() => {
            const cart = values?.cart ?? [];
            const discountValue = Number(
              values?.discount.replaceAll(",", ".") ?? "0",
            );
            const discountType = values?.discountType;

            if (!cart.length || !discountType) return;

            if (discountType === "percent") {
              const updatedCart = cart.map((item) => {
                const variation = item.variations[0];
                if (!variation) return item;

                const quantity = Number(variation.quantity) || 0;
                const unitPrice = variation.unitaryValue || 0;
                const totalDiscount =
                  (quantity * unitPrice * discountValue) / 100;

                const totalValue = quantity * unitPrice - totalDiscount;

                return {
                  ...item,
                  variations: [
                    {
                      ...variation,
                      total: Math.round(totalValue * 100) / 100,
                      discountValue: Math.round(totalDiscount * 100) / 100, // arredondando para 2 casas
                    },
                  ],
                };
              });

              setFieldValue("cart", updatedCart);
            }

            if (discountType === "fixed") {
              const totalSale = cart.reduce((acc, item) => {
                const variation = item.variations[0];
                const quantity = Number(variation?.quantity) || 0;
                const unitPrice = variation?.unitaryValue || 0;
                return acc + quantity * unitPrice;
              }, 0);

              if (totalSale === 0) return;

              const equivalentPercent = (discountValue / totalSale) * 100;

              const updatedCart = cart.map((item) => {
                const variation = item.variations[0];
                if (!variation) return item;

                const quantity = Number(variation.quantity) || 0;
                const unitPrice = variation.unitaryValue || 0;
                const totalDiscount =
                  (quantity * unitPrice * equivalentPercent) / 100;

                return {
                  ...item,
                  variations: [
                    {
                      ...variation,
                      total:
                        Math.round(
                          (variation.unitaryValue * quantity - totalDiscount) *
                            100,
                        ) / 100,
                      discountValue: Math.round(totalDiscount * 100) / 100,
                    },
                  ],
                };
              });

              setFieldValue("cart", updatedCart);
            }
          }}
          text="Aplicar"
        />
      </div>
    </S.ApplyDiscount>
  );
}
