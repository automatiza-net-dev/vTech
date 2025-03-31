// @ts-nocheck
// Core
import React, { memo, useState, useEffect } from "react";

// Utils
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { accessControlTitles } from "@/OLD/utils/generalUtils";

// Hooks
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Components
import { Input, Select, Button, AutoComplete } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import {
  FormHandler,
  useAuthAdmin,
  Select as SelectInfinityForge,
} from "infinity-forge";
const { Option } = Select;

const Edit = memo(function Edit({
  data,
  setData,
  submit,
  paymentMethods,
  plans,
  setVisible,
  edit = true,
  setEdit = false,
  source = false,
}) {
  const { user } = useAuthAdmin();

  const [flags, setFlags] = useState([]);

  const { checkingAccounts } = useCheckingAccounts();

  const editTitlePermission = useUserHasPermission(
    `${accessControlTitles(data?.type)}02`
  );

  const editPaymentMethodPermission = useUserHasPermission(
    `${accessControlTitles(data?.type)}10`
  );

  const hasInternalCode = user?.unit?.unitConfig?.internalCode;

  useEffect(() => {
    setFlags(
      paymentMethods.find((method) => method?.id === data?.paymentMethodId)
        ?.flags
    );
  }, [data, paymentMethods]);

  const allowPaymentMethodEdit = () => {
    if (edit && editPaymentMethodPermission) {
      return false;
    }
    return true;
  };

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
        <div className="uk-margin-small-right uk-width-1-4">
          <label>Parcela</label>
          <Input disabled value={data.installment} />
        </div>
        <div className="uk-width-1-4">
          <label>Conciliado</label>
          <Select
            value={data?.reconciled}
            onChange={(val) => setData({ ...data, reconciled: val })}
            disabled={!edit}
            className="uk-width-1-1"
          >
            <Option value={true}>Sim</Option>
            <Option value={false}>Não</Option>
          </Select>
        </div>
      </div>
      <div className="uk-flex uk-margin-top">
        <div className="uk-margin-small-right uk-width-1-4">
          <label>Data emissão</label>
          <DatePicker
            disabled={!edit}
            slotProps={{ textField: { variant: "standard" } }}
            className="uk-width-1-1"
            value={data?.issueDate}
            format="DD/MM/YYYY"
            onChange={(e) => setData({ ...data, issueDate: e })}
          />
        </div>
        <div className="uk-margin-small-right uk-width-1-4">
          <label>Data vencimento</label>
          <DatePicker
            disabled={!edit}
            slotProps={{ textField: { variant: "standard" } }}
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
            slotProps={{ textField: { variant: "standard" } }}
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
          <Input disabled value={data?.originalValue} />
        </div>
        <div className="uk-margin-small-right">
          <label>Valor tarifa forma pgto</label>
          <Input disabled value={data?.feePaymentMethod} />
        </div>
        <div className="uk-margin-small-right">
          <label>percentual tarifa forma pgto</label>
          <Input disabled value={data?.feePaymentPercentage} />
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
          <Input disabled value={data?.value} />
        </div>
      </div>
      <div className="uk-flex uk-margin-top">
        <div className="uk-margin-small-right uk-width-1-4">
          <FormHandler>
            <SelectInfinityForge
              disabled={allowPaymentMethodEdit()}
              label="Forma pagamento"
              name="paymentMethodId"
              onlyOneValue
              options={paymentMethods.map((method) => ({
                label: method.description,
                value: method?.id,
              }))}
              value={
                paymentMethods.find(
                  (method) => method.id === data?.paymentMethodId
                )?.id
              }
              onChangeInput={(value) => {
                const paymentSelected = paymentMethods?.find(
                  (payment) => String(payment.id) === value
                );

                setFlags(paymentSelected?.flags);

                setData({
                  ...data,
                  tefFlagId: "",
                  checkingAccountId: paymentSelected?.checkingAccount?.id || data?.checkingAccountId,
                  paymentMethodId: paymentSelected?.id,
                });
              }}
            />
          </FormHandler>
        </div>

        <div className="uk-width-1-4 uk-margin-small-right">
          <FormHandler>
            <SelectInfinityForge
              disabled={allowPaymentMethodEdit()}
              label="Bandeira"
              name="tefFlagId"
              onlyOneValue
              options={flags?.map((flag) => ({
                label: flag?.flag?.description,
                value: flag?.flag?.id,
              }))}
              value={data?.tefFlagId}
              onChangeInput={(value) => {
                setData({ ...data, tefFlagId: value });
              }}
            />
          </FormHandler>
        </div>
        <div className="uk-width-1-4 uk-margin-small-right">
          <label>Nº Comprovante / Nsu</label>
          <Input
            disabled={!edit}
            value={data?.nsuDocument}
            onChange={(e) => setData({ ...data, nsuDocument: e.target.value })}
          />
        </div>

        {hasInternalCode && (
          <div className="uk-width-1-4 uk-margin-small-right">
            <label>Código interno</label>
            <Input
              disabled={true}
              value={data?.internalCode}
              onChange={(e) =>
                setData({ ...data, internalCode: e.target.value })
              }
            />
          </div>
        )}
      </div>

      <div className="uk-flex uk-margin-top">
        <div className="uk-width-1-4 uk-margin-small-right">
          {Array.isArray(plans) && plans.length > 0 && (
            <FormHandler>
              <SelectInfinityForge
                label="Plano Contas"
                disabled={!edit}
                value={data?.accountPlanId}
                controlledInitialValue={{ value: data?.accountPlanId }}
                name="accountPlanId"
                onlyOneValue
                options={plans?.map((plan) => ({
                  label: plan.description,
                  value: plan.id,
                }))}
                value={data?.tefFlagId}
                onChangeInput={(value) => {
                  if(value !== data?.accountPlanId)
                  setData({ ...data, accountPlanId: value });
                }}
              />
            </FormHandler>
          )}
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
      {source === "finances" && !edit && editTitlePermission && (
        <Button onClick={() => setEdit(true)}>Editar</Button>
      )}
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
