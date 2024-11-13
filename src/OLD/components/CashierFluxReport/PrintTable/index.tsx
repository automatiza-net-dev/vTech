// @ts-nocheck
import { memo, useRef, useState } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import { Button, Empty } from "antd";
import { Container, RowBox } from "./styles";
import { PrintHeader } from "@/presentation";

import ReactToPrint from "react-to-print";
import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";

function PrintTable({ reports, filters, values }) {
  const { clinic } = useProfile();

  const componentRef = useRef();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ReactToPrint
          trigger={() => <Button>Imprimir</Button>}
          content={() => componentRef.current}
        />
      </div>
      <Container ref={componentRef}>
        <div className="clinic-header">
          <PrintHeader />
          <div className="uk-text-center">
            <h4 className="">Relatório de fluxo de caixa</h4>
            {values?.clinicFantasyName && (
              <div>Unidade: {values?.clinicFantasyName}</div>
            )}
            {filters?.fromDate && filters?.toDate && (
              <div>
                Período: {moment(filters?.fromDate).format("DD/MM/YYYY")} à{" "}
                {moment(filters?.toDate).format("DD/MM/YYYY")}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <section style={{ margin: "10px", width: "25%" }}>
            <div>
              <div className="header-table">Resumo</div>
              <div className="uk-flex uk-flex-between">
                <div>Valores a recuperar:&nbsp;</div>
                <div>
                  {currencyFormatter(
                    reports?.expiredReports[0]?.total?.credit || 0
                  )}
                </div>
              </div>
              <div className="uk-flex uk-flex-between">
                <div>Valores vencidos a pagar:&nbsp;</div>
                <div>
                  {currencyFormatter(
                    reports?.expiredReports[0]?.total?.debit || 0
                  )}
                </div>
              </div>
              <div className="uk-flex uk-flex-between">
                <div>Saldo inicial do período:</div>
                <div>
                  {currencyFormatter(
                    reports?.checkingAccountReports[0]?.total || 0
                  )}
                </div>
              </div>
              <div className="uk-flex uk-flex-between">
                <div>Total de entradas:</div>
                <div>
                  {currencyFormatter(
                    reports?.flowReports?.reduce(
                      (acc, current) => acc + current?.credit,
                      0
                    )
                  )}
                </div>
              </div>
              <div className="uk-flex uk-flex-between">
                <div>Total de saídas:</div>
                <div>
                  {currencyFormatter(
                    reports?.flowReports?.reduce(
                      (acc, current) => acc + current?.debit,
                      0
                    )
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="table-section">
          <section className="header-table">
            <div>Periodo</div>
            <div>Saldo inicial</div>
            <div>Entradas</div>
            <div>Saídas</div>
            <div>Saldo do dia</div>
            <div>Saldo Final</div>
          </section>{" "}
          {reports?.flowReports?.length > 0 ? (
            <section className="table-box">
              {reports?.flowReports?.length > 0 &&
                reports?.flowReports?.map((report) => (
                  <RowBox>
                    <div>{report?.period}</div>
                    <div>{currencyFormatter(report?.initialValue)}</div>
                    <div>{currencyFormatter(report?.credit)}</div>
                    <div>{currencyFormatter(report?.debit)}</div>
                    <div>{currencyFormatter(report?.dayBalance)}</div>
                    <div>{currencyFormatter(report?.finalBalance)}</div>
                  </RowBox>
                ))}
            </section>
          ) : (
            <div className="uk-padding">
              <Empty />
            </div>
          )}
        </div>
      </Container>
    </>
  );
}

export default PrintTable;
