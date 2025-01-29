import { useFormikContext } from "formik";
import { calcRefCusto } from "../../utils";

export function Percentage({ tag }) {
  const { values } = useFormikContext<any>();
  const dreFlatten = values["dreFlatten"];

  const value = dreFlatten[tag];
  let custoValue = String(value?.custo || "0");

  if (custoValue.endsWith(",")) {
    custoValue = custoValue.replace(/,$/, "");  
  }
  
  let parsedCusto = Number(custoValue);
  const refCustoBasear = values["basear"]?.refCusto;
  const custoBasear = calcRefCusto(refCustoBasear, dreFlatten);

  const percentage = custoBasear && custoBasear > 0 ? ((parsedCusto / custoBasear) * 100).toFixed(1) : "0";

  return (
    <span className="font-14-regular">
      {tag === values["basear"]?.tag ? "100" : percentage}%
    </span>
  );
}
