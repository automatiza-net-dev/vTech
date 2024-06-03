// @ts-nocheck
import React, { memo } from "react";

import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";

const Header = memo(function Header({ cashier }) {
  return (
    <section>
      <h4 className="">Conferência caixa Nº {cashier?.tag}</h4>
      <section className="uk-flex uk-flex-around">
        <div>
          <p className="uk-margin-remove">
            Usuário Abertura:&nbsp;{cashier?.opening_user?.name}
          </p>
          <p className="uk-margin-remove">
            Usuário Fechamento:&nbsp;{cashier?.closing_user?.name}
          </p>
          <p className="uk-margin-remove">
            Saldo inicial:&nbsp;{currencyFormatter(cashier?.opening_balance)}
          </p>
          <p className="uk-margin-remove">
            Total Caixa:&nbsp;{currencyFormatter(cashier?.sales_total)}
          </p>
        </div>
        <div>
          <p className="uk-margin-remove">
            Despesas:&nbsp;{currencyFormatter(cashier?.expenses_total)}
          </p>
          <p className="uk-margin-remove">
            Saldo Caixa:&nbsp;{currencyFormatter(cashier?.cashier_balance)}
          </p>
        </div>
        <div>
          <p className="uk-margin-remove">
            Data Abertura:&nbsp;
            {moment(cashier?.opening_date).format("DD/MM/YYYY - HH:mm")}
          </p>
          <p className="uk-margin-remove">
            Data Fechamento:&nbsp;
            {moment(cashier?.closing_date).format("DD/MM/YYYY - HH:mm")}
          </p>
          <p className="uk-margin-remove">
            Recebimentos:&nbsp;
            {currencyFormatter(cashier?.receipts_total)}
          </p>
          <p className="uk-margin-remove">
            Fundo de caixa:&nbsp;
            {currencyFormatter(
              cashier?.cashier_founds ? cashier?.cashier_founds : 0
            )}
          </p>
        </div>
        <div>
          <p className="uk-margin-remove">
            Vendas:&nbsp;
            {currencyFormatter(cashier?.sales_total)}
          </p>
        </div>
      </section>
    </section>
  );
});

export default Header;
