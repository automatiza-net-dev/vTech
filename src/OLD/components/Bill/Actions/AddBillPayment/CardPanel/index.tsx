import React, { memo, useState, useEffect } from "react";

import { Container } from "./styles";

import { currencyFormatter } from "@/OLD/components/Budget";

function DebitPanel({
  methods,
  title,
  formData,
  setFormData,
  bill,
}) {
  const [flagsGroups, setFlagsGroups] = useState<any>([]);

  let totalPayed = 0;

  for (let i = 0; i < bill?.payments?.length; i += 1) {
    totalPayed += bill?.payments[i]?.total_value;
  }

  const formatFlags = () => {
    setFlagsGroups(
      methods.map((method) =>
        method?.flags?.map((flag) => {
          return {
            ...flag,
            paymentMethodId: method?.id,
            paymentMethodFlagId: flag?.id,
            installments_without_password: flag?.installments_without_password,
            tef: method?.tef,
            type: method?.type,
            requiresDocument: method?.requires_document,
          };
        })
      )
    );
  };

  useEffect(() => {
    methods?.length > 0 && formatFlags();
  }, [methods]);

  return (
    <Container>
      <h5 className="uk-margin-remove uk-text-center">{title}</h5>
      <hr />
      <div className="uk-flex uk-flex-wrap uk-margin-small-top">
        {flagsGroups?.length > 0 &&
          flagsGroups?.map((flags) =>
            flags.map((flag, i) => (
              <p
                key={i}
                onClick={() => {
                  setFormData({
                    ...formData,
                    budgetPaymentId: null,
                    installments_without_password:
                      flag?.installments_without_password,
                    paymentMethodId: flag?.paymentMethodId,
                    paymentMethodFlagId: flag?.id,
                    acquirerId: flag?.acquirer?.id,
                    flagId: flag?.flag?.id,
                    maxInstallments: flag?.max_installments,
                    paymentDescription: `${flag?.tef} CARTÃO ${flag?.type}`,
                    installments: flag?.max_installments < 2 ? 1 : null,
                    requiresDocument: flag?.requiresDocument,
                    installmentsValue: currencyFormatter(
                      bill?.total_value - totalPayed < 0
                        ? 0
                        : bill?.total_value - totalPayed
                    ),
                    installmentsList: flag?.installments,
                  });
                }}
                className={`uk-margin-remove uk-width-1-2 uk-box-shadow-small card-box uk-padding-small uk-text-center ${
                  formData?.flagId === flag?.flag?.id &&
                  formData?.paymentMethodId === flag?.paymentMethodId && formData?.acquirerId === flag?.acquirer?.id &&
                  "flag-selected"
                }`}
              >
                {flag?.flag?.description}
                {flag?.acquirer?.description && <>
                  <br />
                  {`(${flag?.acquirer?.description})`}
                </>}
                <div>
                  <span className="uk-text-muted text-small" key={i}>
                    Até {flag?.max_installments}x
                  </span>
                </div>
              </p>
            ))
          )}
      </div>
    </Container>
  );
}

export default DebitPanel;
