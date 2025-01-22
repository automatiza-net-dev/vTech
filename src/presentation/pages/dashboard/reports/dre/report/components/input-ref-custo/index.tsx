import { useEffect } from "react";

import { useFormikContext } from "formik";
import { InputCurrency } from "infinity-forge";

import { Percentage } from "./percentage";
import { Agrupamento } from "../../types";
import { calcRefCusto } from "../../utils";

export function InputRefCusto({
  tag,
  custo,
  description,
  initialFlattenList,
}: Agrupamento & { initialFlattenList: any }) {
  const { values, setFieldValue } = useFormikContext<any>();

  async function onChangeInputCurrency(value: number | string) {
    setFieldValue(`dreFlatten.${tag}.custo`, value);

    const newListFlattenUpdateWithNewValue: { [key in string]: Agrupamento } =
      Object.keys(values.dreFlatten as { [key in string]: Agrupamento }).reduce(
        (reducer, item) => {
          const itemValue = values.dreFlatten[item];

          if (String(tag) === String(item)) {
            return {
              ...reducer,
              [item]: {
                ...itemValue,
                custo: Number(value),
              },
            };
          }

          return { ...reducer, [item]: itemValue };
        },
        {}
      );

    const groupDresById: Agrupamento[] = (
      values.dreFlattenArray as Agrupamento[]
    ).filter((dre) => dre.refs && dre.refs.map((r) => String(r)).includes(tag));


    if (groupDresById && groupDresById.length > 0) {
      for (const dre of groupDresById) {
        const fatherRefCusto = dre.refCusto;

        const costDreFather = calcRefCusto(
          fatherRefCusto,
          newListFlattenUpdateWithNewValue
        );

        setFieldValue(`dreFlatten.${dre.tag}.custo`, costDreFather);
      }
    }
  }

  useEffect(() => {
    if (custo && custo > 0) {
      onChangeInputCurrency(custo);
    }
  }, []);

  const refCusto = initialFlattenList[tag]?.refCusto;

  return (
    <div className="group_values">
      <InputCurrency
        name={`dreFlatten.${tag}.custo`}
        disabled={!!refCusto}
        onChangeInput={onChangeInputCurrency as any}
      />

      <Percentage tag={tag} />
    </div>
  );
}
