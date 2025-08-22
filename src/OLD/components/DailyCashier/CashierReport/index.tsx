// @ts-nocheck
// Core
import React, { memo, useState, useEffect, useRef } from "react";

// Hooks
import { useDumpDailyCasher } from "@/OLD/hooks/useDailyCashiers";

// Utils
import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";
import ReactToPrint, { useReactToPrint } from "react-to-print";

// Components
import { Button } from "antd";
import { Container } from "./styles";
import Header from "./Header";

const CashierReport = memo(function ({ selectedData, type, setVisible }) {
  const [paymentMethods, setPaymentMethods] = useState([]);

  const { reports } = useDumpDailyCasher(selectedData?.id);

  const componentRef = useRef();

  useEffect(() => {
    const arr = [];
    reports &&
      reports?.bill_payments.map((item) => {
        if (
          !arr.includes(
            `${item?.payment_method?.description}${
              item?.payment_description?.tef_aquirer_description
                ? ` - ${item?.payment_description?.tef_aquirer_description}`
                : ""
            }`
          )
        ) {
          arr.push(
            `${item?.payment_method?.description}${
              item?.payment_description?.tef_aquirer_description
                ? ` - ${item?.payment_description?.tef_aquirer_description}`
                : ""
            }`
          );
        }
      });
    setPaymentMethods(arr);
  }, [reports]);

  const imprimir = useReactToPrint({ contentRef: componentRef });

  return (
    <>
      <Container ref={componentRef} id="to-print">
        <Header cashier={selectedData} />
        <hr />
        <section className="uk-margin-top">
          <h5
            className="uk-margin-remove"
            style={{
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            <strong>Despesas</strong>
          </h5>
          <div className="uk-flex uk-flex-around">
            <div>
              <label>Descrição</label>
              {reports?.despesas?.map((despesa) => (
                <p className="uk-margin-remove">{despesa.description}</p>
              ))}
            </div>
            <div>
              <label>Data</label>
              {reports?.despesas?.map((despesa, i) => (
                <p className="uk-margin-remove" key={i}>
                  {moment(despesa?.entry_date).format("DD/MM/YYYY - HH:mm")}
                </p>
              ))}
            </div>
            <div>
              <label>Valor</label>
              {reports?.despesas?.map((despesa, i) => (
                <p className="uk-margin-remove" key={i}>
                  {currencyFormatter(despesa?.value)}
                </p>
              ))}
            </div>
          </div>
        </section>
        <hr />
        <section className="uk-margin-small-top">
          <h5
            className="uk-margin-remove custom-title"
            style={{
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            <strong>Recebimentos</strong>
          </h5>
          <div className="uk-flex uk-flex-around">
            <div>
              <label>Descrição</label>
              {reports?.recebimentos?.map((recebimento, i) => (
                <p key={i} className="uk-margin-remove">
                  {recebimento.description}
                </p>
              ))}
            </div>
            <div>
              <label>Data</label>
              {reports?.recebimentos?.map((recebimento, i) => (
                <p key={i} className="uk-margin-remove">
                  {moment(recebimento?.entry_date).format("DD/MM/YYYY - HH:mm")}
                </p>
              ))}
            </div>
            <div>
              <label>Valor</label>
              {reports?.recebimentos?.map((recebimento, i) => (
                <p className="uk-margin-remove" key={i}>
                  {currencyFormatter(recebimento?.value)}
                </p>
              ))}
            </div>
          </div>
        </section>
        <hr />
        {paymentMethods?.map((method, i) => (
          <section className="uk-margin-top">
            <h5
              className="uk-margin-remove custom-title"
              style={{
                color: "#ffffff",
                textAlign: "center",
              }}
            >
              <strong>{method}</strong>
            </h5>
            <div className="uk-flex uk-flex-around">
              <div>
                <label>Data:</label>
                {reports.bill_payments
                  .filter(
                    (bill) =>
                      `${bill?.payment_method?.description}${
                        bill?.payment_description?.tef_aquirer_description
                          ? ` - ${bill?.payment_description?.tef_aquirer_description}`
                          : ""
                      }` === method
                  )
                  .map((bill) => {
                    return (
                      <p className="uk-margin-remove">
                        {moment(
                          bill?.payment_description?.expiration_date
                        ).format("DD/MM/YYYY - HH:mm")}
                      </p>
                    );
                  })}
              </div>
              <div>
                <label>Documento:</label>
                {reports.bill_payments
                  .filter(
                    (bill) =>
                      `${bill?.payment_method?.description}${
                        bill?.payment_description?.tef_aquirer_description
                          ? ` - ${bill?.payment_description?.tef_aquirer_description}`
                          : ""
                      }` === method
                  )
                  .map((bill) => (
                    <p className="uk-margin-remove">
                      {bill?.payment_description?.nsu_document}
                    </p>
                  ))}
              </div>
              <div>
                <label>Nota fiscal:</label>
                {reports.bill_payments
                  .filter(
                    (bill) =>
                      `${bill?.payment_method?.description}${
                        bill?.payment_description?.tef_aquirer_description
                          ? ` - ${bill?.payment_description?.tef_aquirer_description}`
                          : ""
                      }` === method
                  )
                  .map((bill) => (
                    <p className="uk-margin-remove">
                      {bill?.payment_description?.bill_tag}
                    </p>
                  ))}
              </div>
              <div>
                <label>Cliente:</label>
                {reports.bill_payments
                  .filter(
                    (bill) =>
                      `${bill?.payment_method?.description}${
                        bill?.payment_description?.tef_aquirer_description
                          ? ` - ${bill?.payment_description?.tef_aquirer_description}`
                          : ""
                      }` === method
                  )
                  .map((bill) => (
                    <p className="uk-margin-remove">{bill?.client?.name}</p>
                  ))}
              </div>
              <div>
                <label>Qtd Parcelas:</label>
                {reports.bill_payments
                  .filter(
                    (bill) =>
                      `${bill?.payment_method?.description}${
                        bill?.payment_description?.tef_aquirer_description
                          ? ` - ${bill?.payment_description?.tef_aquirer_description}`
                          : ""
                      }` === method
                  )
                  .map((bill) => (
                    <p className="uk-margin-remove">
                      {bill?.payment_description?.installments}
                    </p>
                  ))}
              </div>
              <div>
                <label>Valor:</label>
                {reports.bill_payments
                  .filter(
                    (bill) =>
                      `${bill?.payment_method?.description}${
                        bill?.payment_description?.tef_aquirer_description
                          ? ` - ${bill?.payment_description?.tef_aquirer_description}`
                          : ""
                      }` === method
                  )
                  .map((bill) => (
                    <p className="uk-margin-remove">
                      {currencyFormatter(
                        bill?.payment_description?.installment_value
                      )}
                    </p>
                  ))}
              </div>
              <div>
                <label>Valor total:</label>
                {reports.bill_payments
                  .filter(
                    (bill) =>
                      `${bill?.payment_method?.description}${
                        bill?.payment_description?.tef_aquirer_description
                          ? ` - ${bill?.payment_description?.tef_aquirer_description}`
                          : ""
                      }` === method
                  )
                  .map((bill) => (
                    <p className="uk-margin-remove">
                      {currencyFormatter(
                        bill?.payment_description?.total_value
                      )}
                    </p>
                  ))}
              </div>
            </div>
            <hr />
          </section>
        ))}
        <hr />
        <section>
          <h5
            className="uk-margin-remove custom-title"
            style={{
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            <strong>Resumos para conferência</strong>
          </h5>
          <section className="uk-flex">
            <section className="uk-width-1-2">
              <h5
                className="uk-margin-remove custom-title"
                style={{
                  color: "#ffffff",
                  textAlign: "center",
                }}
              ></h5>
            </section>
            <section className="uk-width-1-2 uk-margin-small-top">
              <h5
                className="uk-margin-remove custom-title"
                style={{
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                <strong>Caixa</strong>
              </h5>
              <div className="uk-flex uk-flex-between">
                <p className="uk-margin-remove">Saldo inicial / troco:</p>
                <p className="uk-margin-remove">
                  {selectedData?.opening_balance
                    ? currencyFormatter(selectedData?.opening_balance)
                    : currencyFormatter("0")}
                </p>
              </div>
              <div className="uk-flex uk-flex-between">
                <p className="uk-margin-remove">Total Vendas:</p>
                <p className="uk-margin-remove">
                  {selectedData?.sales_total
                    ? currencyFormatter(selectedData?.sales_total)
                    : currencyFormatter("0")}
                </p>
              </div>
              <div className="uk-flex uk-flex-between">
                <p className="uk-margin-remove">Total Suprimentos:</p>
                <p className="uk-margin-remove">
                  {selectedData?.receipts_total
                    ? currencyFormatter(selectedData?.receipts_total)
                    : currencyFormatter("0")}
                </p>
              </div>
              <div className="uk-flex uk-flex-between">
                <p className="uk-margin-remove">Total Sangrias:</p>
                <p className="uk-margin-remove">
                  {selectedData?.expenses_total
                    ? currencyFormatter(selectedData?.expenses_total)
                    : currencyFormatter("0")}
                </p>
              </div>
              <div className="uk-flex uk-flex-between">
                <p className="uk-margin-remove">Fundo Caixa:</p>
                <p className="uk-margin-remove">
                  {selectedData?.cashier_funds
                    ? currencyFormatter(selectedData?.cashier_funds)
                    : currencyFormatter("0")}
                </p>
              </div>
              <div className="uk-flex uk-flex-between">
                <p className="uk-margin-remove">Total caixa (gaveta):</p>
                <p className="uk-margin-remove">
                  {selectedData?.cashier_total
                    ? currencyFormatter(selectedData?.cashier_total)
                    : currencyFormatter("0")}
                </p>
              </div>
              <div className="uk-flex uk-flex-between">
                <p className="uk-margin-remove">Saldo caixa:</p>
                <p className="uk-margin-remove">
                  {selectedData?.cashier_balance
                    ? currencyFormatter(selectedData?.cashier_balance)
                    : currencyFormatter("0")}
                </p>
              </div>
            </section>
          </section>
        </section>
        <hr />
        <section className="uk-margin-small-top">
          <h5
            className="uk-margin-remove custom-title"
            style={{
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            <strong>Observação de fechamento</strong>
          </h5>
          <p className="uk-margin-remove">{selectedData?.observations}</p>
        </section>
      </Container>
      <footer className="uk-flex uk-flex-right uk-margin-top">
        <Button className="uk-margin-small-right" onClick={() => imprimir()}>
          Imprimir
        </Button>

        <Button onClick={() => setVisible(false)}>Fechar</Button>
      </footer>
    </>
  );
});

export default CashierReport;
