// @ts-nocheck
import React, { memo } from "react";

import { Input } from "antd";

import moment from "moment";

const Header = memo(function Header({ cashier }) {

  return (
    <div>
      <section className="uk-flex">
        <div className="uk-margin-small-right">
          <label>Aberto por</label>
          <Input readOnly value={cashier?.userWhoOpened?.name} />
        </div>
        <div className="uk-margin-small-right">
          <label>Data abertura</label>
          <Input
            readOnly
            value={moment(cashier?.opening_date).format("DD/MM/YYYY - HH:mm")}
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Revisado por</label>
          <Input readOnly value={cashier?.userWhoRevised?.name} />
        </div>
        <div>
          <label>Data revisão</label>
          <Input
            readOnly
            value={
              cashier?.revision_date
                ? moment(cashier?.revision_date).format("DD/MM/YYYY - HH:mm")
                : ""
            }
          />
        </div>
      </section>
      <section className="uk-flex uk-flex-around">
        <div className="uk-margin-small-right">
          <label>Fechado por</label>
          <Input readOnly value={cashier?.userWhoClosed?.name} />
        </div>
        <div className="uk-margin-small-right">
          <label>Data fechamento</label>
          <Input
            readOnly
            value={
              cashier?.closing_date
                ? moment(cashier?.closing_date).format("DD/MM/YYYY - HH:mm")
                : ""
            }
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Conferido por</label>
          <Input readOnly value={cashier?.userWhoChecked?.name} />
        </div>
        <div>
          <label>Data conferência</label>
          <Input
            readOnly
            value={
              cashier?.checking_date
                ? moment(cashier?.checking_date).format("DD/MM/YYYY - HH:mm")
                : ""
            }
          />
        </div>
      </section>
    </div>
  );
});

export default Header;
