import { Tooltip } from "infinity-forge";

import { BusinessUnitProduct } from "@/domain";

export function DiscountPercentage({
  percentageDiscount,
  maximum_discount_percentage,
}: {
  percentageDiscount: number;
  maximum_discount_percentage: BusinessUnitProduct["maximum_discount_percentage"];
}) {
  if (isNaN(percentageDiscount) || isNaN(maximum_discount_percentage)) {
    return <></>;
  }

  return (
    <div className="discount_percentage">
      <Tooltip
        position="top-center"
        enableHover
        trigger={
          <h4 className="font-12-bold">
            Desconto: {" "}
            <span
              style={{
                color:
                  percentageDiscount > maximum_discount_percentage
                    ? "red"
                    : "green",
              }}
            >
              {percentageDiscount}%
            </span>
          </h4>
        }
        content={
          Number(percentageDiscount) > maximum_discount_percentage
            ? "O valor do desconto é superior ao permitido"
            : "Desconto proporcional ao valor digitado"
        }
      />
    </div>
  );
}
