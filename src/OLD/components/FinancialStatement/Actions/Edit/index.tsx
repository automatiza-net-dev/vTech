// @ts-nocheck
// Core
import React, { memo, useState, useEffect } from "react";

// Utils
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";
import { normalizeStr } from "@/OLD/utils/normalizeString";

// Hooks
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";

// Components
import { Input, Select, DatePicker, Button, AutoComplete, Popconfirm } from "antd";
const { Option } = Select;

import { FiTrash2 } from "react-icons/fi";

const Edit = memo(function Edit({
  data,
  setData,
  submit,
  paymentMethods,
  plans,
  setVisible,
  edit = true,
  setEdit = false,
}) {
  const [flags, setFlags] = useState([]);
  const { checkingAccounts } = useCheckingAccounts();

  useEffect(() => {
    setFlags(
      paymentMethods.find((method) => method?.id === data?.paymentMethodId)
        ?.flags
    );
  }, [data, paymentMethods]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="uk-flex">
        <div className="uk-margin-small-right uk-width-1-2">
          <label>Cliente</label>
          <Input value={data?.client} disabled />
        </div>
        <div className="uk-margin-small-right">
          <label>Documento</label>
          <Input value={data?.document} disabled />
        </div>
        <div className="uk-margin-small-right">
          <label>Parcela</label>
          <Input disabled value={data.installment} />
        </div>
      </div>
      <div className="uk-flex uk-margin-top">
        <div className="uk-margin-small-right uk-width-1-4">
          <label>Emissão</label>
          <DatePicker
            disabled={!edit}
            className="uk-width-1-1"
            value={data?.issueDate}
            format="DD/MM/YYYY"
            onChange={(e) => setData({ ...data, issueDate: e })}
          />
        </div>
        <div className="uk-margin-small-right uk-width-1-4">
          <label>Vencimento</label>
          <DatePicker
            disabled={!edit}
            className="uk-width-1-1"
            format="DD/MM/YYYY"
            value={data?.expirationDate}
            onChange={(e) => setData({ ...data, expirationDate: e })}
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Data competência</label>
          <DatePicker
            disabled={!edit}
            className="uk-width-1-1"
            value={data?.competenceDate}
            format="MM/YYYY"
            onChange={(val) => setData({ ...data, competenceDate: val })}
          />
        </div>
        <div className="uk-width-1-5">
          <label>Nota Fiscal</label>
          <Input
            disabled={!edit}
            type="number"
            value={data?.fiscalNote}
            onChange={(e) => setData({ ...data, fiscalNote: e.target.value })}
          />
        </div>
      </div>
      <div className="uk-flex uk-margin-top">
        <div className="uk-margin-small-right">
          <label>Valor original parcela</label>
          <Input disabled />
        </div>
        <div className="uk-margin-small-right">
          <label>Valor tarifa forma pgto</label>
          <Input disabled />
        </div>
        <div className="uk-margin-small-right">
          <label>percentual tarifa froma pgto</label>
          <Input disabled />
        </div>
        <div className="uk-margin-small-right uk-width-1-4">
          <label>Valor parcela</label>
          <Input
            required
            disabled={!edit}
            value={data?.value}
            onChange={(e) =>
              setData({
                ...data,
                value: currencyFormatter(convertIntlCurrency(e.target.value)),
              })
            }
          />
        </div>
      </div>
      <div className="uk-flex uk-margin-top">
        <div className="uk-margin-small-right">
          <label>R$ Juros</label>
          <Input
            required
            disabled={!edit}
            value={data?.feeValue}
            onChange={(e) =>
              setData({
                ...data,
                feeValue: currencyFormatter(
                  convertIntlCurrency(e.target.value)
                ),
              })
            }
          />
        </div>
        <div className="uk-margin-small-right">
          <label>% Taxa Juros</label>
          <Input
            required
            disabled={!edit}
            value={data?.feePercentage}
            onChange={(e) =>
              setData({ ...data, feePercentage: e.target.value })
            }
          />
        </div>
        <div className="uk-margin-small-right">
          <label>R$ Desconto</label>
          <Input
            required
            disabled={!edit}
            value={data?.discountValue}
            onChange={(e) =>
              setData({
                ...data,
                discountValue: currencyFormatter(
                  convertIntlCurrency(e.target.value)
                ),
              })
            }
          />
        </div>
        <div className="uk-margin-small-right">
          <label>% Desconto</label>
          <Input
            required
            disabled={!edit}
            value={data?.discountPercentage}
            onChange={(e) =>
              setData({
                ...data,
                discountPercentage: e.target.value.replace(",", "."),
              })
            }
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Valor Total da parcela</label>
          <Input disabled />
        </div>
      </div>
      <div className="uk-flex uk-margin-top">
        <div className="uk-margin-small-right uk-width-1-4">
          <label>Forma pagamento</label>
          <AutoComplete
            disabled={!edit}
            value={
              paymentMethods.find(
                (method) => method.id === data?.paymentMethodId
              )?.description
            }
            className="uk-width-1-1"
            onChange={(val) => setData({ ...data, paymentMethodId: val })}
            onSelect={(_, opt) => {
              setFlags(opt?.flags);
              setData({
                ...data,
                paymentMethodId: opt?.id,
              });
            }}
            options={paymentMethods.map((method) => ({
              ...method,
              value: method?.description,
            }))}
            filterOption={(value, option) =>
              normalizeStr(option.value.toUpperCase()).includes(
                normalizeStr(value.toUpperCase())
              )
            }
          />
        </div>
        <div className="uk-width-1-4 uk-margin-small-right">
          <label>Bandeira</label>
          <br />
          <Select
            disabled={!edit}
            value={data?.tefFlagId}
            className="uk-width-1-1"
            onChange={(val) => {
              setData({ ...data, tefFlagId: val });
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
        <div className="uk-width-1-4 uk-margin-small-right">
          <label>Nº Comprovante / Nsu</label>
          <Input
            disabled={!edit}
            value={data?.nsuDocument}
            onChange={(e) => setData({ ...data, nsuDocument: e.target.value })}
          />
        </div>
      </div>
      <div className="uk-flex uk-margin-top">
        <div className="uk-width-1-4 uk-margin-small-right">
          <label>Plano Contas</label>
          <AutoComplete
            disabled={!edit}
            value={
              plans.find((plan) => plan.id === data?.accountPlanId)?.description
            }
            className="uk-width-1-1"
            onChange={(val) => setData({ ...data, accountPlanId: val })}
            onSelect={(_, opt) =>
              setData({
                ...data,
                accountPlanId: opt?.id,
              })
            }
            options={plans.map((plan) => ({
              ...plan,
              value: plan?.description,
            }))}
            filterOption={(value, option) =>
              normalizeStr(option.value.toUpperCase()).includes(
                normalizeStr(value.toUpperCase())
              )
            }
          />
        </div>
        <div className="uk-width-1-3 uk-margin-small-right">
          <label>Conta Corrente</label>
          <br />
          <Select
            disabled={!edit}
            className="uk-width-1-1"
            value={data?.checkingAccountId}
            onChange={(val) => {
              setData({ ...data, checkingAccountId: val });
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
      </div>
      <div className="uk-flex uk-margin-top">
        <div className="uk-margin-small-right">
          <label>Valor de pagamento</label>
          <Input value={data?.paymentValue} disabled />
        </div>
        <div className="uk-margin-small-right">
          <label>Data de pagamento</label>
          <Input value={data?.paymentDate} disabled />
        </div>
        <div className="uk-width-1-4">
          <label>Histórico</label>
          <Input
            disabled={!edit}
            value={data?.historic}
            onChange={(e) => setData({ ...data, historic: e.target.value })}
          />
        </div>
      </div>
      {/*
      <div className="uk-flex uk-margin-small-top">
        <div className="uk-margin-small-right">
          <label>Banco</label>
          <Input
            disabled={!edit}
            value={data?.bank}
            onChange={(e) => setData({ ...data, bank: e.target.value })}
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Agência</label>
          <Input
            disabled={!edit}
            value={data?.agency}
            onChange={(e) => setData({ ...data, agency: e.target.value })}
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Conta</label>
          <Input
            disabled={!edit}
            value={data?.account}
            onChange={(e) => setData({ ...data, account: e.target.value })}
          />
        </div>
      </div>
        */}
      <div className="uk-flex uk-margin-small-top">
        {/*
        <div className="uk-margin-small-right uk-width-2-4">
          <label>CPF Portador</label>
          <Input
            disabled={!edit}
            value={data?.userDocument}
            onChange={(e) => setData({ ...data, userDocument: e.target.value })}
          />
        </div>
        <div className="uk-margin-small-right uk-width-2-4">
          <label> Número código de barras </label>
          <Input
            disabled={!edit}
            type="number"
            value={data?.barCode}
            onChange={(e) => setData({ ...data, barCode: e.target.value })}
          />
        </div>
        */}
      </div>
      <hr />
      {edit && (
        <footer className="uk-margin-top uk-flex uk-flex-right">
          <Button type="primary" htmlType="submit" className="uk-margin-right">
            Salvar
          </Button>
          <Button
            htmlType="button"
            onClick={() => (!setEdit ? setVisible(false) : setEdit(false))}
          >
            Cancelar
          </Button>
        </footer>
      )}
    </form>
  );
});

export default Edit;
