// @ts-nocheck
// Core
import React, { memo, useEffect, useState } from "react";

// components
import { Input, Button } from "antd";

// Utils
import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

const FormChild = memo(function FormChild({
  data,
  setData,
  user,
  inputFocus,
  submit,
  setVisible
}) {
  const [count, setCount] = useState(0);

  const submitWithEnter = (e) => {
    setCount(0);
    if (e.key === "Enter") {
      const btn = document?.querySelector("#submit");

      btn?.click();
    }
  };

  useEffect(() => {
    document.addEventListener("keypress", submitWithEnter);
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        count === 0 && submit();
        setCount((prv) => prv + 1);
      }}
    >
      <section>
        <div>
          <label>Caixa do dia</label>
          <Input
            disabled
            value={moment(new Date()).format("DD/MM/YYYY - HH:mm")}
          />
        </div>
        <div className="uk-margin-top">
          <label>Responsável</label>
          <Input disabled value={user?.name} />
        </div>
        <div className="uk-margin-top">
          <label>Saldo inicial</label>
          <Input
            autoFocus
            id="to-focus-input"
            value={data?.initialBalance}
            onChange={(e) =>
              setData({
                ...data,
                initialBalance: currencyFormatter(
                  convertIntlCurrency(e.target.value)
                )
              })
            }
          />
        </div>
        <hr />
        <footer className="uk-flex uk-flex-right uk-margin-small-top">
          <Button
            id="submit"
            htmlType="submit"
            type="primary"
            className="uk-margin-small-right"
          >
            Salvar
          </Button>
          <Button
            onClick={() => {
              setVisible(false);
              const btn = document?.querySelector("#submit");
              btn.removeEventListener("keypress", submitWithEnter);
            }}
          >
            Cancelar
          </Button>
        </footer>
      </section>
    </form>
  );
});

export default FormChild;
