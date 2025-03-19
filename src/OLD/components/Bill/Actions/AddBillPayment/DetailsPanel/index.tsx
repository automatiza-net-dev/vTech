// @ts-nocheck
// Core
import React, { memo, useState } from "react";

// Utils
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

// Components
import { Container } from "./styles";
import { Button, useToast } from "infinity-forge";
import { Input, Modal } from "antd";

export function DetailsPanel({
  formData,
  setFormData,
  submit,
  bill,
}) {
  const [confirmModal, setConfirmModal] = useState(false);
  let totalPayed = 0;

  const { createToast } = useToast();

  for (let i = 0; i < bill?.payments?.length; i += 1) {
    totalPayed += bill?.payments[i]?.total_value;
  }

  const valuesVerification = () => {
    if (
      parseFloat(totalPayed?.toFixed(2)) +
        convertIntlCurrency(formData?.installmentsValue) >
      parseFloat(bill?.total_value.toFixed(2))
    ) {
      return createToast({
        status: "error",
        message: "Valor pago maior que o valor total",
      });
    }

    if (convertIntlCurrency(formData?.installmentsValue) <= 0) {
      return createToast({
        status: "error",
        message: "O valor do pagamento deve ser maior que zero",
      });
    }

    return submit();
  };

  const someRequiresConfirmation = Array.from(
    Array(formData?.maxInstallments)
  ).some((_, i) => {
    const requiresConfirmation =
      i + 1 > formData?.installments_without_password;

    return requiresConfirmation;
  });

  return (
    <Container className="uk-width-1-4 uk-margin-left uk-text-center uk-box-shadow-small uk-padding-small">
      <h5 className="uk-margin-remove uk-text-center">Detalhes</h5>
      <hr />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          valuesVerification();
        }}
      >
        <div className="">
          <div className="">
            <label>Valor a receber</label>
            <Input
              value={formData?.installmentsValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  installmentsValue: currencyFormatter(
                    convertIntlCurrency(e.target.value)
                  ),
                })
              }
            />
          </div>
          <div className="uk-margin-small-top">
            <label>Nº Comprovante / NSU</label>
            <Input
              required={formData?.requiresDocument}
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, nsuDocument: e.target.value })
              }
              value={formData?.nsuDocument}
            />
          </div>
        </div>
        {!!formData?.maxInstallments && formData?.maxInstallments > 1 && (
          <>
            <div className="uk-margin-top">
              <label>Escolha a quantidade de parcelas</label>
              <br />
              <div className="uk-flex uk-flex-center uk-margin-small-top uk-flex-wrap">
                {Array.from(Array(formData?.maxInstallments)).map((_, i) => {
                  const requiresConfirmation =
                    i + 1 > formData?.installments_without_password;

                  const handleClick = () => {
                    setFormData({
                      ...formData,
                      installments: i + 1,
                      paymentMethodFlagInstallmentId:
                        formData?.installmentsList?.find(
                          (installment) => installment?.installment === i + 1
                        )?.id,
                    });
                  };

                  return (
                    <div
                      style={{
                        background: requiresConfirmation ? "#EFEC63" : "",
                      }}
                      onClick={handleClick}
                      key={i}
                      className={`uk-margin-right uk-margin-small-top uk-box-shadow-small installment-button ${
                        formData?.installments === i + 1
                          ? "selected-installments"
                          : ""
                      } `}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
        <footer
          className="uk-margin-top"
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button type="submit" text="Confirmar" />

          {someRequiresConfirmation && (
            <p
              style={{ marginTop: 5, textAlign: "start" }}
              className="font-14-regular"
            >
              Parcelas marcadas em <strong>amarelo</strong> precisarão de
              autorização do supervisor para finalização da venda
            </p>
          )}
        </footer>
      </form>
    </Container>
  );
}
