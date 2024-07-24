// @ts-nocheck
// Core
import React, { memo } from "react";

// Utils
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

// Components
import { Container } from "./styles";
import { Input, notification } from "antd";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";

const DetailsPanel = memo(function DetailsPanel({
  formData,
  setFormData,
  submit,
  bill,
}) {
  let totalPayed = 0;

  for (let i = 0; i < bill?.payments?.length; i += 1) {
    totalPayed += bill?.payments[i]?.total_value;
  }

  const valuesVerification = () => {
    if (
      parseFloat(totalPayed?.toFixed(2)) +
        convertIntlCurrency(formData?.installmentsValue) >
      parseFloat(bill?.total_value.toFixed(2))
    ) {
      return notification.warning({
        message: "Valor pago maior que o valor total",
      });
    }

    if (convertIntlCurrency(formData?.installmentsValue) <= 0) {
      return notification.warning({
        message: "O valor do pagamento deve ser maior que zero",
      });
    }

    return submit();
  };

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
                {Array.from(Array(formData?.maxInstallments)).map((_, i) => (
                  <div
                    onClick={() => {
                      setFormData({
                        ...formData,
                        installments: i + 1,
                        paymentMethodFlagInstallmentId:
                          formData?.installmentsList?.find(
                            (installment) => installment?.installment === i + 1
                          ).id,
                      });
                    }}
                    key={i}
                    className={`uk-margin-right uk-margin-small-top uk-box-shadow-small installment-button  ${
                      formData?.installments === i + 1 &&
                      "selected-installments"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <footer className="uk-margin-top">
          <CustomButton type="submit">Confirmar</CustomButton>
        </footer>
      </form>
    </Container>
  );
});

export default DetailsPanel;
