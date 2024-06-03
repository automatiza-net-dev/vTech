// @ts-nocheck
// Core
import React, { memo } from "react";

// Container
import { Container } from "./styles";

// Utils
import { currencyFormatter } from "@/OLD/components/Budget";

const NonTefPanel = memo(function NonTefPanel({
  methods,
  formData,
  setFormData,
  bill,
}) {
  let totalPayed = 0;

  for (let i = 0; i < bill?.payments?.length; i += 1) {
    totalPayed += bill?.payments[i]?.total_value;
  }

  return (
    <Container className="uk-margin-left">
      <h5 className="uk-margin-remove uk-text-center">Outros métodos</h5>
      <hr />
      <div>
        {methods?.map((method, i) => (
          <p
            key={i}
            className={`uk-margin-remove uk-width-1-1 uk-box-shadow-small card-box uk-padding-small uk-text-center ${
              formData?.paymentMethodId === method?.id && "payment-selected"
            }`}
            onClick={() => {
              setFormData({
                installmentsList: method?.flags[0]?.installments,
                expirationDate: formData?.expirationDate,
                paymentMethodId: method?.id,
                maxInstallments: method?.max_installments,
                installments: method?.max_installments < 2 ? 1 : null,
                paymentDescription: method?.description,
                installmentsValue: currencyFormatter(
                  bill?.total_value - totalPayed < 0
                    ? 0
                    : bill?.total_value - totalPayed
                ),
                // installmentsList: method?.fees
              });
            }}
          >
            {method?.description}
          </p>
        ))}
      </div>
    </Container>
  );
});

export default NonTefPanel;
