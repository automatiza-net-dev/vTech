import React, { useEffect, useMemo, useState } from "react";

import moment from "moment";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";

// Components
import { Container } from "./styles";
import { Input, DatePicker, AutoComplete } from "antd";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { Select } from "infinity-forge";
import { useFormikContext } from "formik";

function Installments({
  installments,
  setInstallments,
  index,
  paymentMethods,
  type,
  paymentMethodSearch,
}) {
  const [flags, setFlags] = useState([]);
  const [initialValue] = useState(paymentMethodSearch);

  useEffect(() => {
    const newFlags = paymentMethods
      .find((method) => method?.id === installments?.[index]?.paymentMethodId)
      ?.flags?.map((flag: any) => ({
        label: flag?.flag?.description,
        value: flag?.flag?.id,
      }));

    setFlags(newFlags);
  }, []);

  const { setFieldValue } = useFormikContext();

  return (
    <Container className="uk-margin-top uk-padding-small">
      <div className="uk-flex">
        <div className="uk-margin-small-right small-box">
          <label>Parcela</label>
          <Input disabled value={installments[index]?.installment} />
        </div>
        <div className="uk-margin-small-right">
          <label>Valor</label>
          <Input
            value={installments[index]?.originalValue}
            onChange={(e) => {
              const obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                originalValue: currencyFormatter(
                  convertIntlCurrency(e.target.value)
                ),
              });
              setInstallments(obj);
            }}
          />
        </div>
        {/*
        <div className="uk-margin-small-right">
          <label>Emissão</label>
          <DatePicker
            className="uk-width-1-1"
            value={installments[index]?.issueDate}
            format="DD/MM/YYYY"
            onChange={(e) => {
              const obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                issueDate: e
              });
              setInstallments(obj);
            }}
          />
        </div>
            */}
        <div className="uk-margin-small-right">
          <label>Vencimento</label>
          <DatePicker
            className="uk-width-1-1"
            format="DD/MM/YYYY"
            value={installments[index]?.expirationDate}
            onChange={(e) => {
              const obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                expirationDate: e,
              });
              setInstallments(obj);
            }}
          />
        </div>
        <div className="uk-margin-small-right">
          <label> Data Competência </label>
          <DatePicker
            className="uk-width-1-1"
            format="MM/YYYY"
            picker="month"
            value={installments[index]?.competenceDate}
            onChange={(e) => {
              let obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                competenceDate: e,
              });

              if (index === 0) {
                if (type === "rec") {
                  obj = obj?.map((item, i) => {
                    return {
                      ...item,
                      competenceDate: moment(e, "MM/YYYY").add(i * 1, "month"),
                    };
                  });
                } else {
                  obj = obj?.map((item) => {
                    return {
                      ...item,
                      competenceDate: e,
                    };
                  });
                }
              }

              setInstallments(obj);
            }}
          />
        </div>
        <div className="uk-margin-small-right uk-width-1-2">
          <Select
            label="Forma de pagamento"
            name={`installments.methodpayment[${index}].paymentMethodId`}
            value={installments?.[index]?.paymentMethodId}
            onlyOneValue
            options={
              paymentMethods?.map((method) => ({
                label: method?.description,
                value: method?.id,
              })) || []
            }
            onChangeInput={(value) => {
              const obj = installments;

              obj.splice(index, 1, {
                ...installments[index],
                paymentMethodId: value,
                tefFlagId: "",
              });

              setFlags(
                paymentMethods
                  .find((method) => method?.id === value)
                  ?.flags?.map((flag: any) => ({
                    label: flag?.flag?.description,
                    value: flag?.flag?.id,
                  }))
              );

              setFieldValue(
                `installments.methodpayment[${index}].tefFlagId`,
                ""
              );

              setInstallments(obj);
            }}
          />
        </div>

        <div className="uk-margin-small-right uk-width-1-2">
          <Select
            label="Bandeira"
            name={`installments.methodpayment[${index}].tefFlagId`}
            onlyOneValue
            options={flags}
            value={installments?.[index]?.tefFlagId || ""}
            onChangeInput={(value) => {
              const obj = installments;

              obj.splice(index, 1, {
                ...installments[index],
                tefAcquirerId: paymentMethods
                  .find(
                    (payment) =>
                      payment.id === installments?.[index]?.paymentMethodId
                  )
                  ?.flags?.find((item) => item?.flag?.id === value)?.acquirer?.id,
                tefFlagId: value,
              });

              setInstallments(obj);
            }}
          />
        </div>

        <div className="uk-width-1-3">
          <label>Nº Comprovante / Nsu</label>
          <Input
            value={installments[index]?.nsuDocument}
            onChange={(e) => {
              const obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                nsuDocument: e.target.value,
              });
              setInstallments(obj);
            }}
          />
        </div>
        {/*
        <div className="">
          <label> Data Competência </label>
          <DatePicker
            required
            className="uk-width-1-1"
            format="MM/YYYY"
            picker="month"
            value={installments[index]?.competenceDate}
            onChange={(e) => {
              const obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                competenceDate: e
              });
              setInstallments(obj);
            }}
          />
        </div>
      </div>
      <div className="uk-flex uk-margin-small-top">
        <div className="uk-margin-small-right uk-width-1-4">
          <label>Plano Contas</label>
          <AutoComplete
            value={
              plans.find(
                (plan) => plan.id === installments[index]?.accountPlanId
              )?.description
            }
            className="uk-width-1-1"
            onChange={(e) => {
              const obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                accountPlanId: e
              });
              setInstallments(obj);
            }}
            options={plans.map((plan) => ({
              value: plan?.description,
              label: plan?.description
            }))}
            onSelect={(value) => {
              const obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                accountPlanId: plans.find((plan) => plan.id === value)?.id
              });
              setInstallments(obj);
            }}
            filterOption={(value, option) =>
              normalizeStr(option.value.toUpperCase()).includes(
                normalizeStr(value.toUpperCase())
              )
            }
          />
        </div>
        <div className="uk-margin-small-right">
          <label>CPF Portador</label>
          <Input
            value={installments[index]?.userDocument}
            onChange={(e) => {
              const obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                userDocument: e.target.value
              });
              setInstallments(obj);
            }}
          />
        </div>
        <div className="uk-margin-right">
          <label> Número código de barras </label>
          <Input
            type="number"
            value={installments[index]?.barCode}
            onChange={(e) => {
              const obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                barCode: e.target.value
              });
              setInstallments(obj);
            }}
          />
        </div>
        */}
      </div>
      <div className="uk-flex uk-margin-small-top">
        {/*
        <div className="uk-margin-small-right">
          <label>Banco</label>
          <Input
            value={installments[index]?.bank}
            onChange={(e) => {
              const obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                bank: e.target.value
              });
              setInstallments(obj);
            }}
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Agência</label>
          <Input
            value={installments[index]?.agency}
            onChange={(e) => {
              const obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                agency: e.target.value
              });
              setInstallments(obj);
            }}
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Conta</label>
          <Input
            value={installments[index]?.account}
            onChange={(e) => {
              const obj = [...installments];
              obj.splice(index, 1, {
                ...installments[index],
                account: e.target.value
              });
              setInstallments(obj);
            }}
          />
        </div>
        */}
      </div>
      {/*
      <div>
        <label>Histórico</label>
        <Input
          value={installments[index]?.historic}
          onChange={(e) => {
            const obj = [...installments];
            obj.splice(index, 1, {
              ...installments[index],
              historic: e.target.value
            });
            setInstallments(obj);
          }}
        />
      </div>
      */}
    </Container>
  );
}

export default Installments;
