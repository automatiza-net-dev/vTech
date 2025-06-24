import { memo, useCallback, useEffect } from "react";

import { useFormikContext } from "formik";

import { Agrupamento } from "../../types";
import { calcRefCusto } from "../../utils";

import { Percentage } from "./percentage";
import { InputCurrency } from "../../input-currency";

function InputTotal({ tag, total }: Agrupamento & { initialFlattenList: any }) {
  const { values, setFieldValue } = useFormikContext<any>();

  const findItemIsGroupToExtraRefCusto = useCallback((refCusto: string) => {
    return refCusto
      .split(" ")
      .filter((item) => !isNaN(Number(item)) || /^[+\-*/]$/.test(item.trim()))
      .filter((item) => item !== "" && !isNaN(Number(item)))
      .reduce((reducer, item) => {
        const valueItem = values.dreFlatten[item];

        if (valueItem && valueItem.itens && valueItem.itens.length > 0) {
          const newRef = reducer + valueItem.refCusto;

          return findItemIsGroupToExtraRefCusto(newRef);
        }

        return reducer + ` + ${item}`;
      }, "");
  }, []);

  const delay = 2000;

  useEffect(() => {
    setTimeout(() => {
      if (typeof total === "number") {
        const groupDresById = values.dreFlattenArray.filter(
          (dre) => dre.refs && dre.refs.map((r) => String(r)).includes(tag)
        );

        if (groupDresById && groupDresById.length > 0) {
          for (const dre of groupDresById) {
            const fatherRefCusto = findItemIsGroupToExtraRefCusto(dre.refCusto);

            const costDreFather = calcRefCusto(
              fatherRefCusto,
              values.dreFlatten,
              true
            );

            setFieldValue(
              `dreFlatten.${dre.tag}.total`,
              costDreFather?.toFixed(2)
            );
          }
        }
      }
    }, delay);
  }, []);

  return (
    <div className="group_values">
      <InputCurrency name={`dreFlatten.${tag}.total`} disabled={true} />

      <Percentage tag={tag} />
    </div>
  );
}

export default memo(InputTotal);
