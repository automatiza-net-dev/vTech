import { useFormikContext } from "formik";
import { calcRefCusto } from "../../utils";

export function Percentage({ tag }) {
  const { values } = useFormikContext<any>();

  const dreFlatten = values["dreFlatten"];

  const baserTag = Object.keys(dreFlatten).find(tag =>  {
    const dre = dreFlatten[tag];

    return dre.basear
  })

  const basearObject = baserTag && dreFlatten[baserTag]

  const value = dreFlatten[tag];
  const custoBasear = basearObject?.total;

  const percentage = (
    (Number(value?.total || 0) / Number(custoBasear || 1)) *
    100
  ).toFixed(1);

  return (
    <span className="font-14-regular">
      {isNaN(Number(percentage))
        ? 0
        : percentage}
      %
    </span>
  );
}
