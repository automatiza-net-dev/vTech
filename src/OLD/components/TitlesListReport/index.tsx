// @ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import TitlesFilterReport from "./TitlesFilterReport";
import { currencyFormatter } from "@/OLD/components/Budget";
import { Table } from "antd";
import AccessDenied from "@/OLD/components/AccessDenied";

import { useFinancesReports } from "@/OLD/hooks/useReports";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { usePlans } from "@/OLD/hooks/usePlans";
import { useTutor } from "@/OLD/hooks/useTutor";
import { useClinic } from "@/OLD/hooks/useClinics";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import ReactToPrint from "react-to-print";
import PrintTable from "./PrintTable";
import { Button, PageWrapper } from "infinity-forge";

import { Reload } from "styled-icons/zondicons";

import { Columns } from "./Columns";

import * as XLSX from "xlsx/xlsx.mjs";

const TitlesListReport = () => {
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);
  const [formatedFinances, setFormatedFinances] = useState([]);

  const { financesReport, loadingFinances } = useFinancesReports(
    filters,
    reload
  );
  const { paymentMethods } = usePaymentMethods(false, false);
  const { plans } = usePlans();
  const { tutors } = useTutor(false, false);
  const { clinics } = useClinic(Reload);

  const listTitlesPermission = useUserHasPermission("REL01");

  const handleExport = () => {
    const formatted = financesReport?.map((finance) => ({
      sistema: finance?.system?.name,
      cidade: finance?.unit?.city || "-",
      uf: finance?.unit?.uf || "-",
      plano_contas: finance?.accountPlan?.description,
      pessoa: finance?.client?.name,
      documento: `${finance?.document}`,
      origem: finance?.originFlag,
      status: finance?.status,
      competencia: finance?.competenceDate,
      dt_emissao: finance?.issueDate
        ? moment(finance?.issueDate).format("DD/MM/YYYY")
        : "_",
      dt_vencimento: moment(finance?.expiration_date).format("DD/MM/YYYY"),
      dt_pagamento: finance?.paymentDate
        ? moment(finance?.paymentDate).format("DD/MM/YYYY")
        : "-",
      valor_documento: finance?.totalValue?.toFixed(2).replace(".", ","),
      deb_cred: finance?.type,
      v_juros: finance?.feeValue?.toFixed(2).replace(".", ",") || "-",
      v_desc: finance?.discountValue?.toFixed(2).replace(".", ",") || "-",
      valor_pago: finance?.paymentValue?.toFixed(2).replace(".", ",") || "-",
      forma_pagamento: finance?.paymentMethod?.description,
      parcela: finance?.installment,
      historico: finance?.historic || "-",
    }));

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "relatório - títulos" + ".xlsx");
  };

  const formatFinances = (recentDown = false) => {
    setFormatedFinances(
      financesReport.map((finance) => {
        return {
          ...finance,
          plan: finance?.accountPlan?.description,
          document: `${finance?.document}`,
          installment: `${finance?.installment} / ${finance?.qtyInstallments}`,
          fiscalNote: finance?.fiscalNote ? finance?.fiscalNote : "-",
          accept: finance.accept,
          client: finance?.client?.name,
          issueDate: finance?.issueDate
            ? moment(finance?.issueDate).format("DD/MM/YYYY")
            : "Não informado",
          value: currencyFormatter(finance?.totalValue),
          expirationDate: moment(finance?.expiration_date).format("DD/MM/YYYY"),
          paymentValue: currencyFormatter(finance?.paymentValue) || "-",
          paymentDate: finance?.paymentDate
            ? moment(finance?.paymentDate).format("DD/MM/YYYY")
            : "-",
          paymentMethod: finance?.paymentMethod?.description,
          nsu: finance?.nsuDocument || "-",
        };
      })
    );

    if (recentDown) {
      setFormatedFinances((prv) => prv.filter((item) => item?.document));
    }
  };

  useEffect(() => {
    financesReport?.length > 0 ? formatFinances() : setFormatedFinances([]);
  }, [financesReport, reload]);

  const printRef = useRef();

  return !listTitlesPermission || listTitlesPermission === "loading" ? (
    <AccessDenied loading={listTitlesPermission} />
  ) : (
    <PageWrapper title="Relatório financeiro - Listagem de títulos">
      <div>
        <div className="uk-flex uk-flex-between"></div>
        <TitlesFilterReport
          filters={filters}
          setFilters={setFilters}
          paymentMethods={paymentMethods}
          tutors={tutors}
          plans={plans.filter((plan) => {
            if (filters.type === "receive") {
              return plan?.type === "CREDITO";
            } else {
              return plan?.type === "DEBITO";
            }
          })}
          reload={reload}
          setReload={setReload}
          clinics={clinics}
          loadingFinances={loadingFinances}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            text="Filtrar"
            onClick={() => {
              setReload(!reload);
            }}
            classCallback="uk-margin-right"
          />
        </div>
        <hr />
        <div style={{ overflowX: "auto" }}>
          <Table
            columns={Columns}
            dataSource={formatedFinances}
            pagination={false}
            scroll={{ y: 320 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "5px",
          }}
        >
          <ReactToPrint
            trigger={() => <Button type="primary" text="Imprimir Tabela" />}
            content={() => printRef.current} // Use a referência aqui
          />
          <Button onClick={() => handleExport()} text="Exportar (Excel)" />
          <div style={{ display: "none" }}>
            <PrintTable
              ref={printRef}
              columns={Columns}
              dataSource={formatedFinances}
              filters={filters}
              unit={
                filters?.unit
                  ? clinics?.find((clinic) => clinic?.id === filters?.unit)
                  : ""
              }
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default TitlesListReport;
