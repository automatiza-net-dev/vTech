import { Tutor } from "@/domain";
import { FormBudgetItem, FormData } from "../interfaces";
import { useLoadAllReasons } from "@/presentation/hooks";
import { useFormikContext } from "formik";
import { useState } from "react";
import { useQueryClient } from "react-query";

import {
  Icon,
  Input,
  Modal,
  Select,
  Tooltip,
  formatNumberToCurrency,
} from "infinity-forge";

import { AddBudgetNew } from "@/presentation";
import { budgetStatusFormatter } from "@/OLD/components/Budget";
import AddPaymentPreview from "@/OLD/components/Budget/Actions/add-payment-preview";

export function BudgetItem({
  budget,
  tutors,
  index,
  hasOpenedBudget,
}: {
  tutors: Tutor[] | undefined;
  hasOpenedBudget: boolean;
  budget: FormBudgetItem;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  const { data, isFetching } = useLoadAllReasons("OR");

  const { values, setFieldValue } = useFormikContext<FormData>();

  const queryClient = useQueryClient();
  const activeBudget = values?.budgets?.find((budget) => budget.checked);

  const status = budget.status;
  const pathName = `budgets[${index}]`;
  const showObservations = activeBudget && !budget.checked;

  return (
    <>
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
            <>
              <div key={item.id} className="content">
                <div>
                  {item.quantity}x{" "}
                  {item?.productVariation?.product.description +
                    (item?.departmentItems && item?.departmentItems.length > 0
                      ? " - " +
                        item?.departmentItems?.map(
                          (item) => item.department_item_description
                        )
                      : "")}
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
            </>
          ))}

          <div className="content">
            <div></div>
            <div className="total">Total</div>
            <div className="-bold">
              {formatNumberToCurrency(budget.total_value)}
            </div>
          </div>

          {tutors && budget.checked && (
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

        <Modal open={open} onClose={() => setOpen(false)}>
          {open && <AddBudgetNew budgetId={budget.id} setModal={setOpen} />}
        </Modal>

        {showObservations && (
          <div>
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
          </div>
        )}

        {budget?.payments && budget.payments.length > 0 && (
          <h3
            className="font-20-bold"
            style={{ marginTop: 20, marginBottom: 0 }}
          >
            <div>
              Previsão de pagamentos{" "}
              
              {hasOpenedBudget && (
                <AddPaymentPreview
                  budgetId={budget.id}
                  budgetTag={budget.tag}
                  onUpdatePayment={() => {
                    queryClient.invalidateQueries(["openNegotiations"]);
                  }}
                />
              )}
            </div>
          </h3>
        )}

        {budget.payments &&
          budget.payments.length > 0 &&
          budget?.payments?.map((item) => {
            return (
              <div key={item.id} className="payment font-16-regular">
                {item?.paymentMethod?.description} -{" "}
                {item?.tefAcquirer?.description} - {item?.tefFlag?.description}{" "}
                - {formatNumberToCurrency(item.total_value || 0)} (
                {item.installments}x)
              </div>
            );
          })}
      </div>
    </>
  );
}
