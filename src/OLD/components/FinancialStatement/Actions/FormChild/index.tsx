// @ts-nocheck
import { memo, useState } from "react";

import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";

import { Input, AutoComplete, Button } from "antd";
import { DatePicker } from "@mui/x-date-pickers";

import { sortItems } from "@/OLD/utils/sortItems";
import { normalizeStr } from "@/OLD/utils/normalizeString";

const FormChild = memo(function FormChild({
  data,
  setData,
  visible,
  setVisible,
  submit,
}) {
  const { checkingAccounts } = useCheckingAccounts();

  sortItems(checkingAccounts, "description");

  return (
    <section>
      <div>
        <label>Conta corrente</label>
        <AutoComplete
          className="uk-width-1-1"
          options={checkingAccounts?.map((account) => ({
            ...account,
            value: account?.description,
          }))}
          value={data?.accountDescription}
          onChange={(val) =>
            setData((prv) => ({ ...prv, accountDescription: val }))
          }
          onSelect={(_, opt) =>
            setData((prv) => ({
              ...prv,
              accountDescription: opt?.value,
              checkingAccountId: opt?.id,
            }))
          }
          filterOption={(val, opt) =>
            normalizeStr(opt?.value.toUpperCase()).includes(
              normalizeStr(val.toUpperCase())
            )
          }
        />
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
});

export default FormChild;
