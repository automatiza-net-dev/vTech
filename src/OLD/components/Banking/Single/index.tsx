// @ts-nocheck
// Core
import React, { memo, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Hooks
import { useSingleBanking } from "@/OLD/hooks/useBankings";

// Utils
import moment from "moment";

// Components
import { Container } from "./styles";
import { Button as CustomButtom } from "@/OLD/components/mini-components/Button";
import { Input } from "antd";

const Single = memo(function Single() {
  const [reload, setReload] = useState(false);
  const id = useRouter()?.query.innerpage;
  const { banking } = useSingleBanking(id, reload);
  const router = useRouter();

  return (
    <>
      <Container className="uk-padding">
        <h3 className="uk-margin-remove">Detalhes</h3>
        <div className="content uk-padding uk-margin-top">
          <div className="uk-flex">
            <div className="uk-margin-right">
              <label>Código</label>
              <Input disabled value="Verificar" />
            </div>
            <div className="uk-margin-right">
              <label>Data Emissão</label>
              <Input
                disabled
                value={moment(banking?.issue_date).format("DD/MM/YYYY")}
              />
            </div>
            <div className="uk-margin-right">
              <label>Tipo</label>
              <br />
              {banking?.type?.toLowerCase()}
            </div>
            <div>
              <label>Conciliado</label>
              <br />
              {banking?.reconciled ? "Sim" : "Não"}
            </div>
          </div>
          <div className="uk-flex uk-margin-top">
            <div className="uk-margin-right">
              <label>Documento</label>
              <Input value={banking?.document} disabled />
            </div>
            <div>
              <label>Conta Corrente</label>
              <Input value={banking?.checkingAccount?.bank_name} disabled />
            </div>
          </div>
          <div className="uk-flex uk-margin-top">
            <div className="uk-margin-right">
              <label>Valor Lançamento</label>
              <Input disabled value={banking?.total_value} />
            </div>
            <div>
              <label>Plano Conta</label>
              <Input disbled value="Trazer informações" disabled />
            </div>
          </div>
          <div className="uk-margin-top">
            <label>Histórico</label>
            <Input value={banking?.historic} disabled />
          </div>
          <hr />
          <footer className="uk-flex uk-flex-right">
            <div className="uk-margin-right uk-width-1-4">
              <label>Saldo antes do lançamento</label>
              <Input
                value={
                  banking?.type === "CREDITO"
                    ? (
                        banking?.checkingAccount?.balance +
                        banking?.document_value
                      ).toFixed(2)
                    : (
                        banking?.checkingAccount?.balance -
                        banking?.document_value
                      ).toFixed(2)
                }
                disabled
              />
            </div>
            <div className="uk-width-1-4">
              <label>Saldo após o lançamento</label>
              <Input
                value={banking?.checkingAccount?.balance.toFixed(2)}
                disabled
              />
            </div>
          </footer>
        </div>
      </Container>
      <div className="uk-flex uk-margin-large-left">
        <CustomButtom onClick={() => router.back()}>Voltar</CustomButtom>
      </div>
    </>
  );
});

export default Single;
