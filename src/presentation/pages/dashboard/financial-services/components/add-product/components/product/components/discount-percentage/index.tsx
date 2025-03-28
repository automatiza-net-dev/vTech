import { CartVariation } from "../../../interfaces";

export function DiscountPercentage({
  variation,
}: {
  variation: CartVariation;
}) {
  const maximum_discount_percentage = variation.maximum_discount_percentage;
  const percentageDiscount = (
    (Number(
      (typeof variation.discountValue === "string"
        ? (variation.discountValue as string).replaceAll(",", ".")
        : variation.discountValue) || 0
    ) /
      (Number(variation.quantity || 1) * Number(variation.unitaryValue || 0))) *
    100
  ).toFixed(2);

  if (isNaN(Number(percentageDiscount)) || isNaN(maximum_discount_percentage)) {
    return <></>;
  }

  return (
    <div className="discount_percentage">
      <h4 className="font-12-bold">
        Desconto:{" "}
        <span
          style={{
            color:
              Number(percentageDiscount) > maximum_discount_percentage
                ? "red"
                : "green",
          }}
        >
          {percentageDiscount}%
        </span>
      </h4>
    </div>
  );
}
