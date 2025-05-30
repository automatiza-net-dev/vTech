import React, { memo } from "react";

import { currencyFormatter } from "@/OLD/components/Budget";

import { Container } from "./styles";
import { Input } from "antd";

export default function ResumePanel({ bill, formData }: any) {
  let totalPayed = 0;

  for (let i = 0; i < bill?.payments?.length; i += 1) {
    totalPayed += bill?.payments[i]?.total_value;
  }

  return (
    <Container className="uk-margin-left uk-width-1-3 uk-box-shadow-small uk-padding-small">
      <h5 className="uk-margin-remove uk-text-center">Resumo de valores</h5>
      <hr />
      <section className="uk-flex uk-flex-around text-small">
        <div className="uk-width-1-3 uk-box-shadow-small uk-padding-small">
          <div>
            <label>SubTotal</label>
            <Input disabled value={currencyFormatter(bill?.total_value)} />
          </div>
          <div className="uk-margin-small-top">
            <label>Juros</label>
            <Input disabled value={currencyFormatter(bill?.fee_value)} />
          </div>
          <div className="uk-margin-small-top">
            <label>Total</label>
            <Input disabled value={currencyFormatter(bill?.total_value)} />
          </div>
        </div>
        <div className="uk-width-1-3 uk-box-shadow-small uk-padding-small">
          <div>
            <label>Total Recebido</label>
            <Input disabled value={currencyFormatter(totalPayed)} />
          </div>
          <div className="uk-margin-small-top">
            <label>Total a receber</label>
            <Input
              disabled
              value={currencyFormatter(
                bill?.total_value - totalPayed < 0
                  ? 0
                  : bill?.total_value - totalPayed
              )}
            />
          </div>
          <div className="uk-margin-small-top">
            <label>Troco</label>
            <Input
              disabled
              value={currencyFormatter(
                totalPayed - bill?.total_value < 0
                  ? 0
                  : totalPayed - bill?.total_value
              )}
            />
          </div>
        </div>
      </section>
      <section className="uk-margin-top">
        <div>
          Pagamento Atual:
          <br />
          <span className="uk-text-bold payment-description-label">
            {formData?.paymentDescription}
          </span>
        </div>
        <div className="uk-margin-small-top">
          <span>Total venda:</span>
          <br />
          <Input
            value={currencyFormatter(bill?.total_value)}
            disabled
            className="payment-value-input uk-width-1-3"
          />
        </div>
      </section>
    </Container>
  );
}

