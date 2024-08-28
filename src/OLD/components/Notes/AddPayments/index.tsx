// @ts-nocheck
import { memo, useEffect, useState, useCallback } from "react";

import { receiptService } from "@/OLD/services/receipt.service";
import { budgetService } from "@/OLD/services/budgets.service";

import { useQueryClient } from "react-query";
import { useLoadPaymentsPreview } from "@/presentation";
import { useCompleteBudget } from "@/OLD/hooks/useBudgets";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";

import { Container } from "./styles";
import { useToast } from "infinity-forge";
import { Input, notification, Collapse, Popconfirm } from "antd";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
const { Panel } = Collapse;

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import moment from "moment";

const AddPayments = memo(function AddPayments({
  receipt,
  setReload,
  origin = "receipts",
  budgetId = false,
  accountPlanId,
}) {
  const [flags, setFlags] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentsReload, setPaymentsReload] = useState(false);
  const [filters, setFilters] = useState({ active: true });

  const { createToast } = useToast();
  const { paymentMethods } = usePaymentMethods(filters);
  const { data: budget } = useCompleteBudget(budgetId, origin === "budgets");
  const { data: budgetPayments } = useLoadPaymentsPreview({
    budgetId: budget?.id,
    fetch: origin !== "receipts",
  });

  const queryClient = useQueryClient();
  const addBudgetPaymentsPermission = useUserHasPermission("ORC08");
  const removeBudgetPaymentPermission = useUserHasPermission("ORC10");

  const formatFlags = () => {
    let arr = [];
    paymentMethods?.map((method) =>
      method?.flags?.map((flag) => {
        if (method?.tef !== "NAO") {
          arr?.push({
            ...flag,
            type: method?.type,
            paymentMethodId: method?.id,
          });
        }
      })
    );
    setFlags(arr);
  };

  useEffect(() => {
    paymentMethods?.length > 0 && formatFlags();
  }, [paymentMethods]);

  const totalValue = receipt?.total_value;
  const totalPayed = receipt?.payments
    ?.filter((item) => item?.status !== "Excluido")
    ?.reduce((acc, current) => acc + current?.installment_value, 0);

  const totalBudget = budget?.items?.reduce(
    (acc, current) => acc + current?.total_value,
    0
  );
  const totalBudgetPayed = budgetPayments?.length
    ? budgetPayments
        ?.filter((item) => item?.status !== "Excluido")
        ?.reduce((acc, current) => acc + current?.valor_total, 0)
    : 0;

  const submitBudgetPayment = useCallback(() => {
    setLoading(true);

    budgetService
      .createBudgetPayments({
        budgetId: budgetId,
        items: [
          {
            paymentMethodId: data?.paymentMethodId,
            tefAcquirerId: data?.tefAcquirerId,
            tefFlagId: data?.tefFlagId,
            installments: data?.installments,
            totalValue: convertIntlCurrency(data?.installmentValue),
          },
        ],
      })
      .then((res) => {
        setLoading(false);
        setPaymentsReload((prv) => !prv);
        queryClient.invalidateQueries({ queryKey: ["paymentsPreview"] });
        return notification.success({
          message: "Pagamento adicionado com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: err?.response?.data?.message?.split(":")[1],
        });
      });
  }, [budget, data]);

  const removeBudgetPayment = (id) => {
    budgetService
      .removeBudgetPayment({ budgetPaymentId: id, origin: "Orçamento" })
      .then((_res) => {
        setPaymentsReload((prv) => !prv);
        queryClient.invalidateQueries({ queryKey: ["paymentsPreview"] });
        notification.success({ message: "Pagamento removido com sucesso!" });
      })
      .catch((err) => {
        return notification.error({
          message: err?.response?.data?.message?.split(":")[1],
        });
      });
  };

  const submitPayment = useCallback(() => {
    setLoading(true);

    receiptService
      .createReceiptPayment({
        receiptId: receipt?.id,
        items: [
          {
            paymentMethodId: data?.paymentMethodId,
            tefAcquirerId: data?.tefAcquirerId,
            tefFlagId: data?.tefFlagId,
            installments: data?.installments,
            installmentValue: convertIntlCurrency(data?.installmentValue),
            issueDate: moment().toISOString(),
            expirationDate: moment(data?.expirationDate).toISOString(),
            nsuDocument: data?.nsuDocument,
            accountPlanId,
          },
        ],
      })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        queryClient.invalidateQueries({ queryKey: ["paymentsPreview"] });
        return notification.success({
          message: "Pagamento adicionado com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
        err?.response?.data?.errors?.forEach((item) => {
          createToast({ message: item?.message, status: "error" });
          if (item?.field?.includes("accountPlanId")) {
            createToast({
              message: "Selecione um plano de contas",
              status: "error",
            });
          }
        });
      });
  }, [data, accountPlanId]);

  const verifyRender = () => {
    if (origin !== "budgets") {
      return true;
    } else {
      if (!!addBudgetPaymentsPermission) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <Container>
      {verifyRender() && (
        <section className="uk-flex">
          <div className="uk-width-1-4 uk-margin-small-right">
            <div>
              <h4 className="uk-margin-remove uk-text-center">Débito</h4>
              <hr />
              <div className="uk-flex uk-flex-wrap uk-margin-small-top">
                {flags?.length > 0 &&
                  flags
                    ?.filter((flag) => flag?.type === "DEBITO")
                    ?.map((flag) => (
                      <div
                        onClick={() =>
                          setData({
                            paymentMethodId: flag?.paymentMethodId,
                            tefAcquirerId: flag?.acquirer?.id,
                            tefFlagId: flag?.flag?.id,
                            maxInstallments: flag?.max_installments,
                            installments:
                              flag?.max_installments === 1
                                ? 1
                                : flag?.installments,
                            paymentMethodFlagInstallmentId:
                              flag?.max_installments === 1 &&
                              flag?.installments[0]?.id,
                            installmentValue: currencyFormatter(
                              origin !== "budgets"
                                ? totalValue - totalPayed
                                : totalBudget - totalBudgetPayed
                            ),
                          })
                        }
                        className={`uk-margin-remove uk-width-1-2 uk-box-shadow-small card-box uk-padding-small uk-text-center ${
                          data?.tefFlagId === flag?.flag?.id &&
                          data?.paymentMethodId === flag?.paymentMethodId &&
                          data?.maxInstallments === flag?.max_installments &&
                          "flag-selected"
                        }`}
                      >
                        {flag?.flag?.description}
                        <br />
                        <span className="uk-text-muted text-small">
                          Até {flag?.max_installments}x
                        </span>
                      </div>
                    ))}
              </div>
            </div>
            <div className="uk-margin-small-top">
              <h4 className="uk-margin-remove uk-text-center">Crédito</h4>
              <hr />
              <div className="uk-flex uk-flex-wrap uk-margin-small-top">
                {flags?.length > 0 &&
                  flags
                    ?.filter((flag) => flag?.type === "CREDITO")
                    ?.map((flag) => (
                      <div
                        onClick={() =>
                          setData({
                            paymentMethodId: flag?.paymentMethodId,
                            tefAcquirerId: flag?.acquirer?.id,
                            tefFlagId: flag?.flag?.id,
                            maxInstallments: flag?.max_installments,
                            installments:
                              flag?.max_installments === 1
                                ? 1
                                : flag?.installments,
                            paymentMethodFlagInstallmentId:
                              flag?.max_installments === 1 &&
                              flag?.installments[0]?.id,
                            installmentValue: currencyFormatter(
                              origin !== "budgets"
                                ? totalValue - totalPayed
                                : totalBudget - totalBudgetPayed
                            ),
                          })
                        }
                        className={`uk-margin-remove uk-width-1-2 uk-box-shadow-small card-box uk-padding-small uk-text-center ${
                          data?.tefFlagId === flag?.flag?.id &&
                          data?.paymentMethodId === flag?.paymentMethodId &&
                          data?.maxInstallments === flag?.max_installments &&
                          "flag-selected"
                        }`}
                      >
                        {flag?.flag?.description}
                        <br />
                        <span className="uk-text-muted text-small">
                          Até {flag?.max_installments}x
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
          <div>
            <div>
              <h4 className="uk-margin-remove">Outros métodos</h4>
              <hr />
              {paymentMethods?.length > 0 &&
                paymentMethods
                  ?.filter(
                    (method) =>
                      method?.flags?.length === 0 && method?.tef === "NAO"
                  )
                  ?.map((method) => (
                    <div
                      onClick={() =>
                        setData({
                          installments: 1,
                          paymentMethodId: method?.id,
                          installmentValue: currencyFormatter(
                            origin !== "budgets"
                              ? totalValue - totalPayed
                              : totalBudget - totalBudgetPayed
                          ),
                        })
                      }
                      className={`uk-margin-remove uk-width-1-1 uk-box-shadow-small card-box uk-padding-small uk-text-center ${
                        data?.paymentMethodId === method?.id && "flag-selected"
                      }`}
                    >
                      {method?.description}
                    </div>
                  ))}
            </div>
          </div>
          <div className="uk-text-center uk-width-1-4 uk-margin-small-left">
            <h4 className="uk-margin-remove">Detalhes</h4>
            <hr />
            <div>
              <label>Valor a receber</label>
              <Input
                value={data?.installmentValue}
                onChange={(e) =>
                  setData({
                    ...data,
                    installmentValue: currencyFormatter(
                      convertIntlCurrency(e.target.value)
                    ),
                  })
                }
              />
            </div>
            {origin !== "budgets" && (
              <div>
                <label>Comprovante / NSU</label>
                <Input
                  value={data?.nsuDocument}
                  onChange={(e) =>
                    setData({ ...data, nsuDocument: e.target.value })
                  }
                />
              </div>
            )}
            <div className="uk-flex uk-flex-center uk-margin-small-top uk-flex-wrap">
              {Array.from(Array(data?.maxInstallments)).map((_, i) => (
                <div
                  onClick={() => {
                    setData({
                      ...data,
                      installments: i + 1,
                      paymentMethodFlagInstallmentId:
                        data?.installmentsList?.find(
                          (installment) => installment?.installment === i + 1
                        ).id,
                    });
                  }}
                  key={i}
                  className={`uk-margin-right uk-margin-small-top uk-box-shadow-small installment-button  ${
                    data?.installments === i + 1 && "selected-installments"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div>
              <CustomButton
                onClick={() =>
                  origin !== "budgets" ? submitPayment() : submitBudgetPayment()
                }
                classCallback="uk-margin-top"
              >
                Confirmar
              </CustomButton>
            </div>
          </div>
          <div className="uk-width-1-4 uk-text-center uk-margin-small-left">
            <h4 className="uk-margin-remove">Resumo de valores</h4>
            <hr />
            <div className="uk-flex">
              <div className="uk-width-1-2 uk-margin-small-right">
                <div>
                  <label>Subtotal</label>
                  <Input
                    disabled
                    value={currencyFormatter(
                      origin !== "budgets" ? totalValue : totalBudget
                    )}
                  />
                </div>
                <div>
                  <label>Juros</label>
                  <Input disabled value={currencyFormatter(0)} />
                </div>
                <div>
                  <label>Total</label>
                  <Input
                    disabled
                    value={currencyFormatter(
                      origin !== "budgets" ? totalValue : totalBudget
                    )}
                  />
                </div>
              </div>
              {origin !== "budgets" && (
                <div className="uk-width-1-2">
                  <div>
                    <label>Total pago</label>
                    <Input disabled value={currencyFormatter(totalPayed)} />
                  </div>
                  <div>
                    <label>Total pendente</label>
                    <Input
                      disabled
                      value={currencyFormatter(totalValue - totalPayed)}
                    />
                  </div>
                  <div>
                    <label>Troco</label>
                    <Input
                      disabled
                      value={
                        totalPayed - totalValue > 0
                          ? currencyFormatter(totalPayed - totalValue)
                          : currencyFormatter(0)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
            {origin !== "budgets" && (
              <div className="uk-width-1-2 uk-margin-small-top uk-text-left">
                <div>
                  <label>Pagamento atual:</label>
                </div>
                <div>
                  <label>Total venda</label>
                  <Input disabled style={{ backgroundColor: "#f08080" }} />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      {origin === "budgets" && (
        <div>
          {budgetPayments?.length > 0 &&
            budgetPayments?.map((item) => (
              <div className="budget-payment-desc">
                <div>
                  {`${item?.descricao_forma_pagamento} - ${
                    item?.descricao_adquirente_tef
                      ? item?.descricao_adquirente_tef + " - "
                      : ""
                  }  ${
                    item?.descricao_bandeira_tef
                      ? item?.descricao_bandeira_tef + " - "
                      : ""
                  } ${currencyFormatter(item?.valor_total)} (${
                    item?.qtd_parcelas_bloco_pgto
                  }x)`}
                </div>
                <div>
                  <Popconfirm
                    title="Deseja remover este pagamento ?"
                    onConfirm={() =>
                      removeBudgetPayment(item?.id_orcamento_pgto)
                    }
                  >
                    {removeBudgetPaymentPermission && (
                      <CustomButton>Remover bloco</CustomButton>
                    )}
                  </Popconfirm>
                </div>
              </div>
            ))}{" "}
        </div>
      )}
    </Container>
  );
});

export default AddPayments;
