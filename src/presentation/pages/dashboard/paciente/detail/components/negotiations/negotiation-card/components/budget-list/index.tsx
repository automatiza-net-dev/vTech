import { useFormikContext } from "formik";

import {
  Icon,
  Input,
  Select,
  Tooltip,
  formatNumberToCurrency,
} from "infinity-forge";

import { useLoadAllReasons } from "@/presentation/hooks";

import { FormData } from "./interfaces";

export function BudgetsList({ hasOpenedBudget }: { hasOpenedBudget: boolean }) {
  const { data, isFetching } = useLoadAllReasons("OR");

  const { values, setFieldValue } = useFormikContext<FormData>();

  const activeBudget = values?.budgets?.find((budget) => budget.checked);

  return (
    <>
      {values.budgets.map((budget, index) => {
        const status = budget.status;
        const pathName = `budgets[${index}]`;
        const showObservations = activeBudget && !budget.checked;

        return (
          <div className="budgets-list" key={budget.id + status}>
            <div>
              <h3>
                <div>
                  Orçamento {budget.tag} ({status})
                  {hasOpenedBudget && (
                    <Tooltip
                      idTooltip="EditarToolTip"
                      enableHover
                      content={"EDITAR"}
                      trigger={
                        <button type="button" onClick={() => {}}>
                          <Icon name="IconEdit" />
                        </button>
                      }
                    />
                  )}
                </div>

                <div>Desconto</div>
                <div>Valor</div>
              </h3>

              {budget?.items?.map((item) => (
                <div key={item.id} className="content">
                  <div>
                    {item.quantity}x {item?.productVariation?.product.description}
                  </div>
                  
                  <div>
                    {item.discount_value
                      ? formatNumberToCurrency(item.discount_value)
                      : "-"}
                  </div>

                  <div>
                    {item.total_value
                      ? formatNumberToCurrency(item.total_value)
                      : "-"}
                  </div>
                </div>
              ))}

              <div className="content">
                <div></div>
                <div className="total">Total</div>
                <div className="-bold">{formatNumberToCurrency(budget.total_value)}</div>
              </div>

              {hasOpenedBudget && (
                <div
                  className="box-check"
                  onClick={() => {
                    values.budgets.forEach((_, i) => {
                      setFieldValue(`budgets[${i}].motivo`, undefined);
                      setFieldValue(`budgets[${i}].observacao`, undefined);
                      setFieldValue(`budgets[${i}].checked`, false);
                    });

                    setFieldValue(`budgets[${index}].checked`, !budget.checked);
                  }}
                  style={{
                    height: 30,
                    width: 30,
                    border: "1px solid #000",
                    backgroundColor: budget.checked ? "#000" : "#fff",
                  }}
                ></div>
              )}
            </div>

            {showObservations && (
              <div className="form_budget">
                <Select
                  onlyOneValue
                  label="Motivo"
                  loading={isFetching}
                  name={pathName + `.motivo`}
                  options={
                    data?.map((option) => ({
                      label: option.reason,
                      value: option.id,
                    })) || []
                  }
                />

                <Input name={pathName + `.observacao`} label="Observação" />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
