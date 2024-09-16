// @ts-nocheck
import React, { memo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import { useShowFinance } from "@/OLD/hooks/useFinances";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { usePlans } from "@/OLD/hooks/usePlans";

import { financesService } from "@/OLD/services/finances.service";

import { Container } from "./styles";
import { Button } from "infinity-forge";
import { notification } from "antd";
import Edit from "../Actions/Edit";

import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

const Details = memo(function Details() {
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { finance } = useShowFinance(router.query.innerpage);
  const { paymentMethods } = usePaymentMethods(false, false);
  const { plans } = usePlans();

  const formatFinance = () => {
    setData({
      paymentValue: finance?.payment_value,
      paymentDate: finance?.payment_date
        ? moment(finance?.payment_date).format("DD/MM/YYYY")
        : "",
      client: finance?.client?.name,
      installment: finance?.installment,
      competenceDate: moment(finance?.competence_date, "MM/YYYY"),
      accountPlanId: finance?.accountPlan?.id,
      paymentMethodId: finance?.paymentMethod?.id,
      document: finance?.document,
      historic: finance?.historic,
      expirationDate: moment(finance?.expiration_date),
      originalValue: currencyFormatter(finance?.original_value),
      reconciled: finance?.reconciled,
      checkingAccountId: finance?.checkingAccount?.id,
      feeValue: currencyFormatter(finance?.fee_value),
      feePercentage: finance?.fee_percentage,
      discountValue: currencyFormatter(finance?.discount_value),
      discountPercentage: finance?.discount_percentage,
      observation: finance?.observation,
      fiscalNote: finance?.fiscal_note,
      userDocument: finance?.user_document,
      barCode: finance?.barCode,
      bank: finance?.bank,
      agency: finance?.agency,
      account: finance?.account,
      issueDate: moment(finance?.issue_date),
      barCode: finance?.bar_code,
      value: currencyFormatter(finance?.value),
      tefFlagId: finance?.flag?.id,
      nsuDocument: finance?.nsu_document,
    });
  };

  const submitUpdate = useCallback(() => {
    setLoading(true);
    const newObj = { ...data };
    let error = false;

    delete newObj?.client;
    delete newObj?.document;

    if (!newObj?.accountPlanId) {
      return notification.warning({ message: "Plano de contas obrigatório" });
    }

    financesService
      .update(finance?.id, {
        ...newObj,
        originalValue: convertIntlCurrency(newObj.originalValue),
        feeValue: convertIntlCurrency(newObj?.feeValue),
        discountValue: convertIntlCurrency(newObj?.discountValue),
      })
      .then((_res) =>
        notification.success({ message: "Parcela atualizada com sucesso!" })
      )
      .catch((err) => {
        error = true;
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        return notification.error({
          message: "Houve um erro ao atualizar a parcela selecionada...",
        });
      })
      .finally(() => {
        setLoading(false);
        !error && router.back();
      });
  }, [data, finance?.id]);

  useEffect(() => {
    formatFinance();
  }, [finance]);

  return (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Detalhes do título</h3>
      <hr />
      <div className="uk-flex uk-flex-right">
        <Button onClick={() => setEdit(true)} text="Editar" />
      </div>
      <section className="body-page uk-padding uk-margin-top">
        <Edit
          data={data}
          setData={setData}
          paymentMethods={paymentMethods}
          plans={plans}
          setVisible={false}
          edit={edit}
          submit={submitUpdate}
          setEdit={setEdit}
        />
      </section>
      <Button onClick={() => router.back()} text="Voltar" />
    </Container>
  );
});

export default Details;
