// @ts-nocheck
// Core
import React, { memo } from "react";

// Hooks
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { usePlans } from "@/OLD/hooks/usePlans";

// Utils
import moment from "moment";
import Masks from "@/OLD/utils/masks";

// Components
import { Container } from "./styles";
import { Input, DatePicker, Select } from "antd";
const { Option } = Select;

const ReceiptAndExpenses = memo(function ReceiptAndExpenses({
  type,
  data,
  setData,
}) {
  const { paymentMethods } = usePaymentMethods();
  const { plans } = usePlans();

  return (
    <Container>
      <div>
        <label>Descrição</label>
        <Input
          onChange={(e) => setData({ ...data, description: e.target.value })}
          value={data?.description}
        />
      </div>
      <div className="uk-flex uk-margin-top">
        <div className="custom-item-box">
          <label>Dt. de {type}</label>
          <DatePicker
            className="uk-margin-small-right"
            format="DD/MM/YYYY"
            value={moment(new Date())}
            disabled
          />
        </div>
        <div className="custom-item-box uk-margin-small-right">
          <label>Valor do lançamento</label>
          <Input
            onChange={(e) =>
              setData({ ...data, value: Masks.money(e.target.value) })
            }
            value={data?.value}
          />
        </div>
        <div className="custom-item-box">
          <label>Nota fiscal</label>
          <Input
            value={data?.fiscalNote}
            onChange={(e) => setData({ ...data, fiscalNote: e.target.value })}
          />
        </div>
      </div>
      <div className="uk-margin-small-top">
        <label>Forma de pagamento</label>
        <Select
          className="uk-width-1-1"
          value={data?.paymentMethodId}
          onChange={(val) => setData({ ...data, paymentMethodId: val })}
        >
          {paymentMethods.length > 0 &&
            paymentMethods?.map((method) => (
              <Option value={method?.id}>{method?.description}</Option>
            ))}
        </Select>
      </div>
      <div className="uk-margin-small-top">
        <label>Plano de contas</label>
        <Select
          className="uk-width-1-1"
          value={data?.accountPlanId}
          onChange={(val) => setData({ ...data, accountPlanId: val })}
        >
          {plans?.length > 0 &&
            plans
              ?.filter((plan) =>
                type === "Despesa"
                  ? plan?.type === "DEBITO"
                  : plan?.type === "CREDITO"
              )
              ?.map((plan) => (
                <Option value={plan?.id}>{plan?.description}</Option>
              ))}
        </Select>
      </div>
    </Container>
  );
});

export default ReceiptAndExpenses;
