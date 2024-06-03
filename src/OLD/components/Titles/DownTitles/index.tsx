// @ts-nocheck
import React, { memo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import { financesService } from "@/OLD/services/finances.service";

import { useAuth } from "@/OLD/hooks/useAuth";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";
import { usePlans } from "@/OLD/hooks/usePlans";
import { useShowFinance } from "@/OLD/hooks/useFinances";

import moment from "moment";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";

import { Container } from "./styles";
import Header from "./Header";
import TitlesForm from "./TitlesForm";
import { notification } from "antd";

const DownTitles = memo(function ({ setVisible, setReload }) {
  const [options, setOptions] = useState(false);
  const [data, setData] = useState([]);
  const [ids, setIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { titles, setTitles } = useAuth();
  const { paymentMethods } = usePaymentMethods();
  const { checkingAccounts } = useCheckingAccounts();
  const { plans } = usePlans();
  const { finances } = useShowFinance(ids);

  useEffect(() => {
    setIds(titles?.map((title) => title?.id));
  }, [titles]);

  useEffect(() => {
    finances?.length > 0 &&
      setData(
        finances?.map((title) => {
          const dailyFee = (title?.value * title?.fee_percentage) / 100 / 30;

          const totalFee =
            moment(new Date()).diff(title?.expiration_date, "days") * dailyFee;

          const totalDiscount =
            (title?.value * title?.discount_percentage) / 100;

          return {
            paymentMethodId: title?.paymentMethod?.id,
            planId: title?.accountPlan?.id,
            client: title?.client?.name,
            id: title?.id,
            document: title?.document,
            expirationDate: moment(title?.expiration_date),
            issueDate: moment(title?.issueDate),
            fiscalNote: title?.fiscal_note,
            originalValue: currencyFormatter(title?.value),
            paymentDate: moment(new Date()),
            fee: currencyFormatter(0),
            feePercentage: title?.fee_percentage,
            feeDiscountPercentage: title?.fee_discount_percentage,
            discountValue: currencyFormatter(0),
            paymentValue: currencyFormatter(title?.value),
            agency: title?.agency,
            bank: title?.bank,
            account: title?.account,
            userDocument: title?.user_document,
            paymentNumber: "",
            checkingAccountId: "",
            historic: title?.historic,
            barCode: title?.bar_code,
            nsuDocument: title?.nsu_document,
            competenceDate: title?.competence_date,
            checkingAccountId: title?.checkingAccount?.id,
            flagId: title?.flag?.id,
            type: title?.type,
          };
        })
      );
  }, [finances]);

  const submit = useCallback(() => {
    if ((data ?? []).length === 0) {
      return notification.error({
        message: `Selecione ao menos um título para baixar`,
      });
    }

    setLoading(true);

    const itemsData = (data ?? []).map((item) => ({
      financeId: item?.id,
      checkingAccountId: item?.checkingAccountId,
      paymentDate: moment(item?.paymentDate).toISOString(),
      paymentValue: convertIntlCurrency(item?.paymentValue),
      originDownFlag: "FINANCEIRO",
      feeValue: convertIntlCurrency(item?.fee),
      feePercentage: item?.feePercentage,
      discountValue: convertIntlCurrency(item?.discountValue),
      discountPercentage: item?.discountPercentage,
      userDocument: item?.userDocument,
      nsuDocument: item?.nsuDocument,
      barCode: item?.barCode,
      bank: item?.bank,
      agency: item?.agency,
      account: item?.account,
      tefFlagId: item?.flagId,
      tefAcquirerId: item?.tefAcquirerId,
      increaseValue: 0,
      IncreasePercentage: 0,
      competenceDate: item?.competenceDate,
    }));

    financesService
      .updateDown({
        items: itemsData,
      })
      .then((_res) => {
        setLoading(false);
        setVisible(false);
        setReload((prv) => !prv);
        return notification.success({
          message: "título baixado com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: `Verifique os campos dos títulos`,
        });
      });
  }, [data]);

  return (
    <Container className="uk-padding">
      {/*
      <h3 className="uk-line uk-margin-remove">Baixa de títulos</h3>
      <hr />
      */}
      <div className="body-page">
        <Header
          options={options}
          setOptions={setOptions}
          plans={plans}
          checkingAccounts={checkingAccounts}
          paymentMethods={paymentMethods}
          data={data}
          setData={setData}
        />
      </div>
      <TitlesForm
        setVisible={setVisible}
        loading={loading}
        submit={submit}
        titles={titles}
        setTitles={setTitles}
        paymentMethods={paymentMethods}
        plans={plans}
        checkingAccounts={checkingAccounts}
        options={options}
        data={data}
        setData={setData}
      />
    </Container>
  );
});

export default DownTitles;
