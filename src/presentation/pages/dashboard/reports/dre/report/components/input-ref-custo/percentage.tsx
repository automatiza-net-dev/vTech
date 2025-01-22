import { useFormikContext } from "formik";
import { calcRefCusto } from "../../utils";

export function Percentage({ tag }) {
  const { values } = useFormikContext<any>();

  const dreFlatten = values["dreFlatten"];

  const value = dreFlatten[tag];
  const refCustoBasear = values["basear"]?.refCusto;

  const custoBasear = calcRefCusto(refCustoBasear, dreFlatten);

  const percentage = (
    (Number(value?.custo || 0) / Number(custoBasear || 0)) *
    100
  ).toFixed(1);

  return (
    <span className="font-14-regular">
      {tag === values["basear"]?.tag
        ? "100"
        : isNaN(Number(percentage))
        ? 0
        : percentage}
      %
    </span>
  );
}
