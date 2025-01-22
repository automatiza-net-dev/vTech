import { InputCurrency } from "infinity-forge";

import { Percentage } from "./percentage";
import { calcRefCusto } from "../../utils";
import { useEffect } from "react";
import { useFormikContext } from "formik";
import { Agrupamento } from "../../types";

export function InputTotal({ tag, total, initialFlattenList }: any) {
  const { values, setFieldValue } = useFormikContext<any>();

  async function onChangeInputCurrency(value: number | string) {
    setFieldValue(`dreFlatten.${tag}.total`, value);

    const newListFlattenUpdateWithNewValue: { [key in string]: Agrupamento } =
      Object.keys(values.dreFlatten as { [key in string]: Agrupamento }).reduce(
        (reducer, item) => {
          const itemValue = values.dreFlatten[item];

          if (String(tag) === String(item)) {
            return {
              ...reducer,
              [item]: {
                ...itemValue,
                total: Number(value),
              },
            };
          }

          return { ...reducer, [item]: itemValue };
        },
        {}
      );

    const groupDresById = values.dreFlattenArray.filter(
      (dre) => dre.refs && dre.refs.map((r) => String(r)).includes(tag)
    );

    if (groupDresById && groupDresById.length > 0) {
      for (const dre of groupDresById) {
        const fatherRefCusto = dre.refCusto;

        const costDreFather = calcRefCusto(
          fatherRefCusto,
          newListFlattenUpdateWithNewValue,
          true
        );

        setFieldValue(`dreFlatten.${dre.tag}.total`, costDreFather);
      }
    }
  }

  useEffect(() => {
    if (total && total > 0) {
      onChangeInputCurrency(total);
    }
  }, []);

  const refCusto = initialFlattenList[tag]?.refCusto;

  return (
    <div className="group_values">
      <InputCurrency name={`dreFlatten.${tag}.total`} disabled={true} />

      <Percentage tag={tag} />
    </div>
  );
}
