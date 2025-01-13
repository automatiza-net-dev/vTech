import { useState } from "react";

import { useFormikContext } from "formik";

import { Tutor } from "@/domain";

import {
  Icon,
  Input,
  Modal,
  Select,
  Tooltip,
  formatNumberToCurrency,
} from "infinity-forge";

import { useQueryClient } from "react-query";
import { useLoadAllReasons } from "@/presentation/hooks";

import { FormData } from "./interfaces";
import { AddBudgetNew } from "@/presentation";
import { budgetStatusFormatter } from "@/OLD/components/Budget";

export function BudgetsList({
  hasOpenedBudget,
  tutors,
}: {
  hasOpenedBudget: boolean;
  tutors?: Tutor[];
}) {
  const [open, setOpen] = useState(false);

  const { data, isFetching } = useLoadAllReasons("OR");

  const { values, setFieldValue } = useFormikContext<FormData>();

  const queryClient = useQueryClient();
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
                  Orçamento {budget.tag} (
                  {budgetStatusFormatter(budget, () =>
                    queryClient.invalidateQueries(["openNegotiations"])
                  )}
                  )
                  {hasOpenedBudget && (
                    <Tooltip
                      idTooltip="EditarToolTip"
                      enableHover
                      content={"EDITAR"}
                      trigger={
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(true);
                          }}
                        >
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
                    {item.quantity}x{" "}
                    {item?.productVariation?.product.description}
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
                <div className="-bold">
                  {formatNumberToCurrency(budget.total_value)}
                </div>
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
                    height: "30px",
                    width: "30px",

                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={budget?.checked}
                    style={{ height: "30px" }}
                  />
                </div>
              )}
            </div>
            {tutors && hasOpenedBudget && (
              <Select
                label="Responsável Financeiro"
                name={pathName + `.financialResponsibleId`}
                onlyOneValue
                options={tutors?.map((tutor) => ({
                  label: tutor?.name,
                  value: tutor?.id,
                }))}
              />
            )}

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
            <Modal open={open} onClose={() => setOpen(false)}>
              {open && <AddBudgetNew budgetId={budget.id} setModal={setOpen} />}
            </Modal>
          </div>
        );
      })}
    </>
  );
}
