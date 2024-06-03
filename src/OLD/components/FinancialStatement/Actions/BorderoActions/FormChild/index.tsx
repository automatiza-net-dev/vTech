// @ts-nocheck
import { memo } from "react";

import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";

import { AutoComplete, Input, Button } from "antd";
import { DatePicker } from "@mui/x-date-pickers";

import { sortItems } from "@/OLD/utils/sortItems";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

const { TextArea } = Input;

const FormChild = memo(function FormChild({
  data,
  setData,
  submit,
  setVisible,
  type,
  paymentType = "all",
  bordero,
}) {
  const { paymentMethods } = usePaymentMethods();
  const { checkingAccounts } = useCheckingAccounts();

  sortItems(paymentMethods, "description");
  sortItems(checkingAccounts, "description");

  return (
    <section>
      {type === "down" ? (
        <>
          <div className="uk-width-1-1">
            <label>Conta corrente para baixa</label>
            <AutoComplete
              className="uk-width-1-1"
              onChange={(val) =>
                setData({ ...data, checkingAccountDescription: val })
              }
              onSelect={(_, opt) =>
                setData({
                  ...data,
                  checkingAccountDescription: opt?.val,
                  checkingAccountId: opt?.id,
                })
              }
              options={checkingAccounts?.map((account) => ({
                ...account,
                value: account?.description,
                key: account?.id,
              }))}
              filterOption={(val, opt) =>
                normalizeStr(opt?.value?.toUpperCase())?.includes(
                  normalizeStr(val?.toUpperCase())
                )
              }
            />
          </div>
          <div className="uk-flex uk-margin-small-top" style={{ gap: "10px" }}>
            <div className="uk-width-1-1">
              <label>Forma de pagamento</label>
              <AutoComplete
                className="uk-width-1-1"
                options={paymentMethods?.map((method) => ({
                  ...method,
                  value: method?.description,
                }))}
                value={data?.paymentMethodDescription}
                onChange={(val) =>
                  setData({ ...data, paymentMethodDescription: val })
                }
                onSelect={(val, opt) =>
                  setData({
                    ...data,
                    checkingAccountId: opt?.checkingAccount?.id,
                    paymentMethodId: opt?.id,
                    paymentMethodDescription: opt?.value,
                  })
                }
                filterOption={(val, opt) =>
                  normalizeStr(opt?.value?.toUpperCase())?.includes(
                    normalizeStr(val?.toUpperCase())
                  )
                }
              />
            </div>
          </div>
          <div className="uk-margin-small-top uk-width-1-2 uk-margin-small-right">
            <label>Valor bordero</label>
            <Input disabled value={currencyFormatter(bordero?.value)} />
          </div>
          <div className="uk-flex uk-margin-small-top" style={{ gap: "10px" }}>
            <div>
              <label>Juros (R$)</label>
              <Input
                value={data?.interestValue}
                onChange={(e) => {
                  setData({
                    ...data,
                    interestPercentage: 0,
                    interestValue: currencyFormatter(
                      convertIntlCurrency(e.target.value)
                    ),
                  });
                }}
              />
            </div>
            {/*
            <div>
              <label>Juros (%)</label>
              <Input
                value={data?.interestPercentage}
                onChange={(e) => {
                  if (e.target.value >= 0 && e.target.value <= 100) {
                    setData({
                      ...data,
                      interestPercentage: e.target.value,
                      interestValue: currencyFormatter(0)
                    });
                  }
                }}
              />
            </div>
                  */}
            <div>
              <label>Desconto (R$)</label>
              <Input
                value={data?.discountValue}
                onChange={(e) =>
                  setData({
                    ...data,
                    discountPercentage: 0,
                    discountValue: currencyFormatter(
                      convertIntlCurrency(e.target.value)
                    ),
                  })
                }
              />
            </div>
            {/*
            <div>
              <label>Desconto (%)</label>
              <Input
                value={data?.discountPercentage}
                onChange={(e) => {
                  if (e.target.value >= 0 && e.target.value <= 100) {
                    setData({
                      ...data,
                      discountPercentage: e.target.value,
                      discountValue: currencyFormatter(0)
                    });
                  }
                }}
              />
            </div>
            */}
          </div>
          <div className="uk-flex uk-margin-small-top">
            <div className="uk-width-1-2 uk-margin-right">
              <label>Valor Pagamento</label>
              <Input
                disabled
                value={currencyFormatter(
                  bordero?.value +
                    convertIntlCurrency(data?.interestValue) -
                    convertIntlCurrency(data?.discountValue)
                )}
              />
            </div>
            <div className="uk-width-1-2">
              <label>Data de pagamento</label>
              <DatePicker
                slotProps={{ textField: { variant: "standard" } }}
                value={data?.paymentDate}
                onChange={(val) => setData({ ...data, paymentDate: val })}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="uk-margin-small-top">
            <label>Motivo estorno</label>
            <TextArea
              value={data?.reason}
              onChange={(e) => setData({ ...data, reason: e.target.value })}
            />
          </div>
        </>
      )}
      <hr />
      <footer className="uk-flex uk-flex-right">
        <Button
          className="uk-margin-small-right"
          onClick={() => {
            setVisible(false);
            setData({
              interestValue: currencyFormatter(0),
              discountValue: currencyFormatter(0),
            });
          }}
        >
          Cancelar
        </Button>
        <Button type="primary" onClick={submit}>
          Salvar
        </Button>
      </footer>
    </section>
  );
});

export default FormChild;
