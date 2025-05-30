
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";

import { AutoComplete, Input, Button } from "antd";
import { DatePicker } from "@mui/x-date-pickers";

import { sortItems } from "@/OLD/utils/sortItems";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

const { TextArea } = Input;

export default function FormChild({
  setData,
  submit,
  setVisible,
  type,
  data
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
                setData(state => ({ ...state, checkingAccountDescription: val }))
              }
              onSelect={(_, opt) =>
                setData(state => ({
                  ...state,
                  checkingAccountDescription: opt?.val,
                  checkingAccountId: opt?.id,
                }))
              }
              options={checkingAccounts?.map((account) => ({
                ...account,
                value: account?.description,
                key: account?.id,
              }))}
              filterOption={(val, opt: any) =>
                normalizeStr(opt?.value?.toUpperCase())?.includes(
                  normalizeStr(val?.toUpperCase())
                )
              }
            />
          </div>
          <div className="uk-flex uk-margin-small-top" style={{ gap: "10px" }}>
            <div className="uk-width-1-2">
              <label>Forma de pagamento</label>
              <AutoComplete
                className="uk-width-1-1"
                options={paymentMethods?.map((method) => ({
                  ...method,
                  value: method?.description,
                }))}
                value={data?.paymentMethodDescription}
                onChange={(val) =>
                  setData(state => ({ ...state, paymentMethodDescription: val }))
                }
                onSelect={(val, opt) =>
                  setData(state => ({
                    ...state,
                    checkingAccountId: opt?.checkingAccount?.id,
                    paymentMethodId: opt?.id,
                    paymentMethodDescription: opt?.value,
                  }))
                }
                filterOption={(val, opt) =>
                  normalizeStr(opt?.value?.toUpperCase())?.includes(
                    normalizeStr(val?.toUpperCase())
                  )
                }
              />
            </div>
            <div className="uk-width-1-2">
              <label>Data de pagamento</label>
              <DatePicker
                slotProps={{ textField: { variant: "standard" } }}
                value={data?.paymentDate}
                onChange={(val) => setData(state => ({ ...state, paymentDate: val }))}
              />
            </div>
          </div>
          <div className="uk-flex uk-margin-small-top" style={{ gap: "10px" }}>
            <div>
              <label>Juros (R$)</label>
              <Input
                value={data?.interestValue}
                onChange={(e) => {
                  setData(state => ({
                    ...state,
                    interestPercentage: 0,
                    interestValue: currencyFormatter(
                      convertIntlCurrency(e.target.value)
                    ),
                  }));
                }}
              />
            </div>
            <div>
              <label>Juros (%)</label>
              <Input
                value={data?.interestPercentage}
                onChange={(e) => {
                  if (Number(e.target.value) >= 0 && Number(e.target.value) <= 100) {
                    setData(state => ({
                      ...state,
                      interestPercentage: e.target.value,
                      interestValue: currencyFormatter(0),
                    }));
                  }
                }}
              />
            </div>
            <div>
              <label>Desconto (R$)</label>
              <Input
                value={data?.discountValue}
                onChange={(e) =>
                  setData(state => ({
                    ...state,
                    discountPercentage: 0,
                    discountValue: currencyFormatter(
                      convertIntlCurrency(e.target.value)
                    ),
                  }))
                }
              />
            </div>
            <div>
              <label>Desconto (%)</label>
              <Input
                value={data?.discountPercentage}
                onChange={(e) => {
                  if (Number(e.target.value) >= 0 && Number(e.target.value) <= 100) {
                    setData(state => ({
                      ...state,
                      discountPercentage: e.target.value,
                      discountValue: currencyFormatter(0),
                    }));
                  }
                }}
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
              onChange={(e) => setData(state =>({ ...state, reason: e.target.value }))}
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
}
