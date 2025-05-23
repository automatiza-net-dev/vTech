import { useMemo } from "react";

import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";

import { AutoComplete, Button } from "antd";
import { DatePicker } from "@mui/x-date-pickers";

import { sortItems } from "@/OLD/utils/sortItems";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import moment from "moment";

function FormChild({ data, setData, visible, setVisible, submit }: any) {
  const { checkingAccounts } = useCheckingAccounts();

  sortItems(checkingAccounts, "description");
  const initialAccountDescription = useMemo(() => {
    return (
      checkingAccounts?.find((acc: any) => acc.id === data?.checkingAccountId)
        ?.description ?? ""
    );
  }, [checkingAccounts, data?.checkingAccountId]);

  const initialPaymentDate = useMemo(() => {
    return moment(data.paymentDate);
  }, [data?.paymentDate]);

  return (
    <section>
      <div>
        <label>Conta corrente</label>
        <AutoComplete
          className="uk-width-1-1"
          options={checkingAccounts?.map((account: any) => ({
            ...account,
            value: account?.description,
          }))}
          value={data?.accountDescription || initialAccountDescription}
          onChange={(val) =>
            setData((prv) => ({ ...prv, accountDescription: val }))
          }
          onSelect={(_, opt) =>
            setData((prv) => ({
              ...prv,
              accountDescription: String(opt?.value),
              checkingAccountId: opt?.id,
            }))
          }
          filterOption={(val, opt) =>
            normalizeStr(String(opt?.value)?.toUpperCase()).includes(
              normalizeStr(val.toUpperCase())
            )
          }
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Data de Pagamento</label>

        <div>
          <DatePicker
            format="DD/MM/YYYY"
            value={initialPaymentDate}
            onChange={(date) => {
              setData((prev: any) => ({
                ...prev,
                paymentDate: date ? date.toISOString() : null,
              }));
            }}
          />
        </div>
      </div>

      <hr />

      <footer className="uk-flex uk-flex-right">
        <Button
          type="primary"
          className="uk-margin-small-right"
          onClick={submit}
        >
          Salvar
        </Button>
        <Button
          onClick={() => {
            setVisible(false);
            setData({});
          }}
        >
          Cancelar
        </Button>
      </footer>
    </section>
  );
}

export default FormChild;
