// @ts-nocheck
// Core
import React, { memo } from "react";

// Components
import { Container } from "./styles";
import { Input } from "antd";

// Utils
import moment from "moment";

const CashierHeader = memo(function CashierHeader({ casherData }) {
  return (
    <>
      <Container>
        <section>
          <div className="uk-flex uk-flex-around">
            <div>
              <label>Nº Caixa</label>
              <Input value={casherData?.tag} disabled />
            </div>
            <div>
              <label>Funcionário</label>
              <Input value={casherData?.userWhoOpened?.name} disabled />
            </div>
            <div>
              <label>Data Abertura</label>
              <Input
                value={moment(casherData?.opening_date).format(
                  "DD/MM/YYYY - HH:mm"
                )}
                disabled
              />
            </div>
          </div>
          <div className="uk-flex uk-flex-around uk-margin-top">
            <div className="uk-margin-small-right">
              <label>Saldo total</label>
              <Input
                value={casherData?.sales_total ? casherData?.cashier_total : 0}
                disabled
              />
            </div>
            <div className="uk-margin-small-right">
              <label>Fundo Caixa</label>
              <Input
                disabled
                value={
                  casherData?.cashier_funds ? casherData?.cashier_funds : 0
                }
              />
            </div>
            <div className="uk-margin-small-right">
              <label>Total Caixa</label>
              <Input
                disabled
                value={
                  casherData?.cashier_balance ? casherData?.cashier_balance : 0
                }
              />
            </div>
            <div>
              <label>Saldo Caixa</label>
              <Input
                disabled
                value={
                  casherData?.cashier_total ? casherData?.cashier_total : 0
                }
              />
            </div>
          </div>
        </section>
      </Container>
    </>
  );
});

export default CashierHeader;
