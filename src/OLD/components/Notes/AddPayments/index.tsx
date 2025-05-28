// @ts-nocheck
import { memo, useEffect, useState, useCallback } from "react";

import { receiptService } from "@/OLD/services/receipt.service";
import { budgetService } from "@/OLD/services/budgets.service";

import { useQueryClient } from "@/presentation/use-query";
import { useLoadPaymentsPreview } from "@/presentation";
import { useCompleteBudget } from "@/OLD/hooks/useBudgets";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";

import { Container } from "./styles";
import { useToast } from "infinity-forge";
import { Input, Collapse, Popconfirm } from "antd";
import { Button } from "infinity-forge";
const { Panel } = Collapse;

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import moment from "moment";
import { container, TypesAutomatiza } from "@/container";
import { RemoteBudget } from "@/data";
import { AxiosError } from "axios";

const AddPayments = memo(function AddPayments({
  receipt,
  setReload,
  origin = "receipts",
  budgetId = false,
  accountPlanId,
  onUpdatePayment
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
    fetch: origin !== "receipts" && !!budget?.id,
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
            paymentMethodFlagId: flag?.id,
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

  const submitBudgetPayment = useCallback(async () => {
    setLoading(true);

    const payload = {
      budgetId: budgetId,
      items: [
        {
          ...data,
          totalValue: convertIntlCurrency(data?.installmentValue),
        },
      ],
    };

    try {
      await container
        .get<RemoteBudget>(TypesAutomatiza.RemoteBudget)
        .createPayment(payload);

      setLoading(false);
      setPaymentsReload((prv) => !prv);
      onUpdatePayment && onUpdatePayment()
      queryClient.invalidateQueries({ queryKey: ["paymentsPreview"] });

      return createToast({ status: "success", message: "Pagamento adicionado com sucesso!"  })
    } catch (err) {

      if (window.confirm(err?.error?.message || err?.errors?.[0]?.field + " " +  err?.errors?.[0]?.message)) {
        await container
          .get<RemoteBudget>(TypesAutomatiza.RemoteBudget)
          .createPayment({
            ...payload,
            items: payload.items.map((item) => ({
              ...item,
              maxParcelas: true,
            })),
          });

        setLoading(false);
        setPaymentsReload((prv) => !prv);
        queryClient.invalidateQueries({ queryKey: ["paymentsPreview"] });
       
        return createToast({ status: "success", message: "Pagamento adicionado com sucesso!"  })
      }
    }
  }, [budget, data]);

  const removeBudgetPayment = (id) => {
    budgetService
      .removeBudgetPayment({ budgetPaymentId: id, origin: "Orçamento" })
      .then((_res) => {
        setPaymentsReload((prv) => !prv);
        queryClient.invalidateQueries({ queryKey: ["paymentsPreview"] });
      

      createToast({ status: "success", message: "Pagamento removido com sucesso!"   })
      })
      .catch((err) => {

        return  createToast({ status: "error", message: err?.response?.data?.message?.split(":")[1]   })
      });
  };

  const submitPayment = useCallback(async () => {
    setLoading(true);

    const payload = {
      receiptId: receipt?.id,
      items: [
        {
          ...data,
          installmentValue: convertIntlCurrency(data?.installmentValue),
          issueDate: moment().toISOString(),
          expirationDate: moment(data?.expirationDate).toISOString(),
          accountPlanId,
        },
      ],
    };

    try {
      await receiptService.createReceiptPayment(payload);

      setLoading(false);
      setReload((prv) => !prv);
      queryClient.invalidateQueries({ queryKey: ["paymentsPreview"] });

      onUpdatePayment && onUpdatePayment()

      return createToast({ status: "success", message:"Pagamento adicionado com sucesso!"  })
    } catch (error) {
      if (window.confirm(error?.error?.message || (error?.errors?.[0]?.field + " " +  error?.errors?.[0]?.message))) {
        await receiptService.createReceiptPayment({
          ...payload,
          items: payload.items.map((item) => ({
            ...item,
            maxParcelas: true,
          })),
        });

        setLoading(false);
        setReload((prv) => !prv);
        queryClient.invalidateQueries({ queryKey: ["paymentsPreview"] });
      }
    }

    setLoading(false);
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

  const someRequiresConfirmation = Array.from(
    Array(data?.maxInstallments)
  ).some((_, i) => {
    const requiresConfirmation = i + 1 > data?.installments_without_password;

    return requiresConfirmation;
  });

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
                            ...flag,
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
                            ...flag,
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
                  ?.filter((method) => method?.tef === "NAO")
                  ?.map((method) => (
                    <div
                      onClick={() => {
                        setData({
                          maxInstallments: method?.max_installments,
                          installments:
                            method?.flags?.[0]?.max_installments === 1
                              ? 1
                              : method?.flags?.[0]?.installments,
                          paymentMethodId: method?.id,
                          installmentValue: currencyFormatter(
                            origin !== "budgets"
                              ? totalValue - totalPayed
                              : totalBudget - totalBudgetPayed
                          ),
                        });
                      }}
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
              {Array.from(Array(data?.maxInstallments)).map((_, i) => {
                const requiresConfirmation =
                  i + 1 > data?.installments_without_password;

                return (
                  <div
                    style={{
                      background: requiresConfirmation ? "#EFEC63" : "",
                    }}
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
                );
              })}
            </div>
            <footer
                  style={{
                    marginTop: 15,
                    display: "flex",
                    gap: 5,
                    flexDirection: "column",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
            >
              <Button
                onClick={() =>
                  origin !== "budgets" ? submitPayment() : submitBudgetPayment()
                }
                classCallback="uk-margin-top"
                text="Confirmar"
              />

              {someRequiresConfirmation && (
                <p
                  style={{ marginTop: 5 }}
                  className="font-14-regular"
                >
                  Parcelas marcadas em <strong>amarelo</strong> precisarão de
                  autorização do supervisor para finalização da venda
                </p>
              )}
            </footer>
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
                <div className="font-16-regular">
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
                      <Button text="Remover Bloco" />
                    )}
                  </Popconfirm>
                </div>
              </div>
            ))}
        </div>
      )}
    </Container>
  );
});

export default AddPayments;
