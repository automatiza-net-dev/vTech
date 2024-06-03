// @ts-nocheck
import React, { memo, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import moment from "moment";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";

import { Container } from "./styles";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import { DatePicker, Input, Select, notification } from "antd";
const { Option } = Select;

import { accessControlTitles } from "@/OLD/utils/generalUtils";

const TitlesForm = memo(function TitlesForm({
  plans,
  checkingAccounts,
  paymentMethods,
  options,
  data,
  setData,
  submit,
  loading,
  setVisible,
}) {
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        let error;
        data?.map((title) => {
          if (title?.paymentValue.includes("-")) {
            error = true;
          } else {
            error = false;
          }
        });

        return error
          ? notification.error({
              message: "O valor de pagamento deve ser maior ou igual à 0",
            })
          : submit();
      }}
    >
      {data?.length > 0 &&
        data.map((title, i) => {
          const flags = paymentMethods?.find(
            (method) => method?.id === title?.paymentMethodId
          )?.flags;

          const editFieldsPermission = useUserHasPermission(
            `${accessControlTitles(title?.type)}02`
          );

          return (
            <Container className="uk-padding-small uk-margin-top" key={i}>
              <section>
                <div className="uk-flex">
                  <div className="uk-margin-small-right uk-width-1-1">
                    <label>Cliente</label>
                    <Input value={title?.client} disabled />
                  </div>
                  <div className="uk-margin-small-right uk-width-1-1">
                    <label>Documento</label>
                    <Input value={title?.document} disabled />
                  </div>
                  <div className="uk-margin-small-right uk-width-1-2">
                    <label>Dt. Vencimento</label>
                    <DatePicker
                      value={title?.expirationDate}
                      format="DD/MM/YYYY"
                      disabled
                    />
                  </div>
                  <div className="uk-margin-small-right uk-width-1-2">
                    <label>Dt. Emissão</label>
                    <DatePicker
                      value={title?.issueDate}
                      format="MM/YYYY"
                      disabled
                    />
                  </div>
                  <div className="uk-width-1-2 uk-margin-small-right">
                    <label>Dt Competência</label>
                    <DatePicker
                      className="uk-width-1-1"
                      format="MM/YYYY"
                      disabled
                      value={moment(title?.competenceDate, "MM/YYYY")}
                    />
                  </div>
                  <div className="uk-margin-small-right uk-width-1-1">
                    <label>Nota Fiscal</label>
                    <Input value={title?.fiscalNote} disabled />
                  </div>
                </div>
                <div className="uk-flex uk-margin-top">
                  <div className="uk-width-1-2 uk-margin-small-right">
                    <label>Valor</label>
                    <Input value={title?.originalValue} disabled />
                  </div>
                  <div className="uk-margin-small-right uk-width-1-2">
                    <label>Dt. Pagamento</label>
                    <DatePicker
                      value={title?.paymentDate}
                      format={"DD/MM/YYYY"}
                      className="uk-width-1-1"
                      onChange={(e) => {
                        const dailyFee =
                          (convertIntlCurrency(title?.originalValue) *
                            title?.feePercentage) /
                          100 /
                          30;

                        const totalFee =
                          moment(e).diff(title?.expirationDate, "days") *
                          dailyFee;

                        const totalDiscount =
                          (convertIntlCurrency(title?.originalValue) *
                            title?.feeDiscountPercentage) /
                          100;

                        const newArr = [...data];

                        newArr.splice(i, 1, {
                          ...title,
                          paymentDate: e,
                          paymentValue: currencyFormatter(
                            totalFee +
                              convertIntlCurrency(title?.originalValue) -
                              totalDiscount
                          ),
                        });

                        setData(newArr);
                      }}
                    />
                  </div>
                  <div className="uk-margin-small-right uk-width-1-2">
                    <label>R$ Juros</label>
                    <Input
                      value={title?.fee}
                      onChange={(e) => {
                        const newArr = [...data];

                        newArr.splice(i, 1, {
                          ...title,
                          fee: currencyFormatter(
                            convertIntlCurrency(e.target.value)
                          ),
                          paymentValue: currencyFormatter(
                            convertIntlCurrency(title?.originalValue) +
                              convertIntlCurrency(e.target.value) -
                              convertIntlCurrency(title?.discountValue)
                          ),
                        });

                        setData(newArr);
                      }}
                    />
                  </div>
                  <div className="uk-margin-small-right uk-width-1-2">
                    <label>R$ Desconto</label>
                    <Input
                      value={title?.discountValue}
                      onChange={(e) => {
                        const newArr = [...data];

                        newArr.splice(i, 1, {
                          ...title,
                          discountValue: currencyFormatter(
                            convertIntlCurrency(e.target.value)
                          ),
                          paymentValue: currencyFormatter(
                            convertIntlCurrency(title?.originalValue) +
                              convertIntlCurrency(title?.fee) -
                              convertIntlCurrency(e.target.value)
                          ),
                        });

                        setData(newArr);
                      }}
                    />
                  </div>
                  <div className="uk-width-1-2">
                    <label>Vlr Pgto</label>
                    <Input
                      value={title?.paymentValue}
                      disabled
                      className={
                        title?.paymentValue.includes("-") && "negative-field"
                      }
                    />
                  </div>
                </div>
                <div className="uk-margin-small-right uk-width-1-1 uk-flex uk-margin-small-top">
                  <div className="uk-width-1-3 uk-margin-small-right">
                    <label>Forma de pagamento</label>
                    <br />
                    <Select
                      disabled={!editFieldsPermission}
                      value={title?.paymentMethodId}
                      className="uk-width-1-1"
                      onChange={(val) => {
                        const newArr = [...data];

                        newArr.splice(i, 1, {
                          ...title,
                          paymentMethodId: val,
                          flagId: "",
                        });

                        setData(newArr);
                      }}
                    >
                      {paymentMethods?.length > 0 &&
                        paymentMethods?.map((method, i) => (
                          <Option value={method?.id} key={i}>
                            {method?.description}
                          </Option>
                        ))}
                    </Select>
                  </div>
                  <div className="uk-width-1-3">
                    <label>Bandeira</label>
                    <br />
                    <Select
                      value={title?.flagId}
                      className="uk-width-1-1"
                      disabled={
                        editFieldsPermission ? !(flags?.length > 0) : true
                      }
                      onChange={(val) => {
                        const newArr = [...data];

                        newArr.splice(i, 1, {
                          ...title,
                          flagId: val,
                          tefAcquirerId: flags?.find((flag) => flag?.id === val)
                            ?.acquirer?.id,
                        });

                        setData(newArr);
                      }}
                    >
                      {flags?.length > 0 &&
                        flags?.map((flag, i) => (
                          <Option value={flag?.flag?.id} key={i}>
                            {flag?.flag?.description}
                          </Option>
                        ))}
                    </Select>
                  </div>
                </div>
                <div className="uk-flex uk-margin-top">
                  <div className="uk-margin-small-right uk-width-1-6">
                    <label>Plano de contas</label>
                    <br />
                    <Select
                      className="uk-width-1-1"
                      value={title?.planId}
                      disabled={!editFieldsPermission}
                    >
                      {plans?.length > 0 &&
                        plans?.map((plan, i) => (
                          <Option key={i} value={plan?.id}>
                            {plan?.description}
                          </Option>
                        ))}
                    </Select>
                  </div>
                  {/*
                  <div className="uk-margin-small-right uk-width-1-2">
                    <label>Agência</label>
                    <Input
                      value={title?.agency}
                      onChange={(e) => {
                        const newArr = [...data];

                        newArr.splice(i, 1, {
                          ...title,
                          agency: e.target.value
                        });

                        setData(newArr);
                      }}
                    />
                  </div>
                  <div className="uk-margin-small-right uk-width-1-2">
                    <label>Banco</label>
                    <Input
                      value={title?.bank}
                      onChange={(e) => {
                        const newArr = [...data];

                        newArr.splice(i, 1, {
                          ...title,
                          bank: e.target.value
                        });

                        setData(newArr);
                      }}
                    />
                  </div>
                  <div className="uk-margin-small-right uk-width-1-2">
                    <label>Conta</label>
                    <Input
                      value={title?.account}
                      onChange={(e) => {
                        const newArr = [...data];

                        newArr.splice(i, 1, {
                          ...title,
                          account: e.target.value
                        });

                        setData(newArr);
                      }}
                    />
                  </div>
                  <div className="uk-margin-small-right uk-width-1-1">
                    <label>CPF Portador</label>
                    <Input
                      value={title?.userDocument}
                      onChange={(e) => {
                        const newArr = [...data];

                        newArr.splice(i, 1, {
                          ...title,
                          userDocument: e.target.value
                        });

                        setData(newArr);
                      }}
                    />
                  </div>
                        */}
                  <div className="uk-width-1-4 uk-margin-small-right">
                    <label>N° Comprovante / Nsu</label>
                    <Input
                      value={title?.nsuDocument}
                      onChange={(e) => {
                        const newArr = [...data];

                        newArr.splice(i, 1, {
                          ...title,
                          nsuDocument: e.target.value,
                        });

                        setData(newArr);
                      }}
                    />
                  </div>
                  <div className="uk-margin-small-right uk-width-1-4">
                    <label>Conta Corrente</label>
                    <br />
                    <Select
                      className="uk-width-1-1"
                      value={title?.checkingAccountId}
                      onChange={(val) => {
                        const newArr = [...data];

                        newArr.splice(i, 1, {
                          ...title,
                          checkingAccountId: val,
                        });

                        setData(newArr);
                      }}
                    >
                      {checkingAccounts?.length > 0 &&
                        checkingAccounts?.map((account, i) => (
                          <Option value={account?.id} key={i}>
                            {account?.description}
                          </Option>
                        ))}
                    </Select>
                  </div>
                  <div className="uk-margin-small-right uk-width-1-4">
                    <label>Histórico</label>
                    <Input value={title?.historic} />
                  </div>

                  {/*
                  <div className="uk-width-1-1">
                    <label>Número código de barras</label>
                    <Input
                      value={title?.barCode}
                      onChange={(e) => {
                        const newArr = [...data];

                        newArr.splice(i, 1, {
                          ...title,
                          barCode: e.target.value
                        });

                        setData(newArr);
                      }}
                    />
                  </div>
                  */}
                </div>
              </section>
            </Container>
          );
        })}
      <hr />
      <footer className="uk-flex uk-margin-top uk-flex-right">
        {!loading ? (
          <CustomButton classCallback="uk-margin-right" type="submit">
            Salvar
          </CustomButton>
        ) : (
          <CustomButton>Carregando ...</CustomButton>
        )}
        <CustomButton type="button" onClick={() => setVisible(false)}>
          Cancelar
        </CustomButton>
      </footer>
    </form>
  );
});

export default TitlesForm;
