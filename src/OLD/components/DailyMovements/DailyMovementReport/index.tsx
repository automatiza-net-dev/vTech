// @ts-nocheck
// Core
import React, { memo } from "react";

// Utils
import { Print } from "@/OLD/utils/generalUtils";
import moment from "moment";

// Components
import { Button } from "antd";
import { Container } from "./styles";

const Report = memo(function Report({ report, setReport }) {
  return (
    <Container className="uk-padding">
      <div id="toPrint" className="uk-margin-top">
        {report?.length > 0
          ? report?.map((reportItem) => (
              <div className="uk-margin-top">
                <hr />
                <h4 style={{ backgroundColor: "black" }}>
                  {`Data: ${moment(reportItem?.created_at).format(
                    "DD/MM/YYYY - HH:mm"
                  )}`}
                </h4>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <section>
                    <p>
                      Responsável Fechamento:&nbsp;
                      {reportItem?.userWhoClosed?.name}
                    </p>
                    <p>
                      Data fechamento:&nbsp;
                      {moment(reportItem?.closing_date).format(
                        "DD/MM/YYYY - HH:mm"
                      )}
                    </p>
                    <p>
                      Responsável reabertura:&nbsp;
                      {reportItem?.userWhoReopened?.name}
                    </p>
                    <p>
                      Data reabertura:&nbsp;
                      {moment(reportItem?.reopening_date).format(
                        "DD/MM/YYYY - HH:mm"
                      )}
                    </p>
                  </section>
                  <section>
                    <p> Recibos totais:&nbsp;{reportItem?.receipts_total}</p>
                    <p>Vendas totais:&nbsp;{reportItem?.sales_total}</p>
                    <p>
                      {" "}
                      Despesas totais:&nbsp;
                      {reportItem?.expenses_total}
                    </p>
                  </section>
                </div>
                <div style={{ textAlign: "center" }}>
                  <h5>Observações</h5>
                  {reportItem?.observations}
                </div>
              </div>
            ))
          : "Nenhum registro para ser apresentado"}
      </div>
      <footer className="uk-margin-top">
        {report?.length > 0 && (
          <Button
            className="uk-margin-right"
            type="primary"
            onClick={() => {
              const content = document.querySelector("#toPrint");
              Print(content.outerHTML);
            }}
          >
            Imprimir
          </Button>
        )}
        <Button onClick={() => setReport(false)}>Fechar relatório</Button>
      </footer>
    </Container>
  );
});

export default Report;
