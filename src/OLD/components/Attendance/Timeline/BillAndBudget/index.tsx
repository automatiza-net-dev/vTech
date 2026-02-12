// @ts-nocheck
import React, {
  useMemo,
  useState, useEffect } from "react";

import { usePatientSalesMetadata } from "@/OLD/hooks/usePatientMetadata";
import { useDailyCasher } from "@/OLD/hooks/useDailyCashiers";

import { Table } from "antd";
import BudgetActions from "@/OLD/components/Budget/Actions/Container";
import BillActions from "@/OLD/components/Bill/Actions/Container";
import TutorAggregatedCredits from "@/OLD/components/Bill/tutor-aggregated-credits";

import { billAndBudgetColumns, billAndBudgetLiftColumns } from "./Columns";
import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";
import { useDictionary, useConfigurationsSystem } from "@/presentation";

import { billStatusFormatter } from "@/OLD/components/Bill/utils/status-formater";
import { budgetStatusFormatter } from "@/OLD/components/Budget";
import AddBillPaymentWithCredits from "@/OLD/components/Bill/add-payment-with-credits";

const labelControl = (str) => {
  switch (str) {
    case "ABERTO":
      return <span style={{ color: "var(--red)" }}>Aberta</span>;
    case "BAIXADA":
      return <span style={{ color: "var(--green)" }}>Baixada</span>;
  }
};

export function BillAndBudget({ patient }) {
  const [formatedMetadata, setFormatedMetadata] = useState([]);
  const [reload, setReload] = useState(false);
  const [cashierFilters, setCashierFilters] = useState({});

  const mainTutor =
    patient?.holders.find((tutor) => tutor.main) ?? patient?.holders[0];

  const { type } = useConfigurationsSystem();
  const { getWord } = useDictionary();
  const { cashiers } = useDailyCasher(cashierFilters);
  const salesMetadataQuery = usePatientSalesMetadata(
    patient?.id,
    mainTutor?.id,
  );
  const [openCredits, setOpenCredits] = React.useState(false);

  useEffect(() => {
    setCashierFilters({
      from: moment(new Date()).startOf("day"),
      to: moment(new Date()).endOf("day"),
      status: "ABERTO",
    });
  }, []);

  const openTotal = useMemo(() => {
    if (!salesMetadataQuery.data) {
      return 0
    }

    return salesMetadataQuery.data
      ?.filter((item) => item._type === 'sale')
      .reduce((acc, curr) => acc + Number.parseFloat(curr.missing_value), 0)
  }, [salesMetadataQuery.data])

  const formatMetadata = () => {
    setFormatedMetadata(
      salesMetadataQuery?.data.map((item) => {
        return {
          mov: item._type === "sale" ? "Venda" : getWord("Orçamento"),
          code: item?.tag,
          date: moment(item?.date).format("DD/MM/YYYY"),
          totalValue: currencyFormatter(item?.total_value),
          missingValue: currencyFormatter(item?.missing_value),
          status:
            item?._type === "sale"
              ? billStatusFormatter(item, setReload)
              : budgetStatusFormatter(item, setReload),
          clientID: item?.clientID,
          client: item?.client,
          patientID: item?.patientID,
          patient: item?.patient,
          actions:
            item?._type === "sale" ? (
              <BillActions
                bill={item}
                setReload={setReload}
                cashiers={cashiers}
                setOpenCredits={setOpenCredits}
              />
            ) : (
              <BudgetActions
                key={item.id}
                budget={item}
                setReload={setReload}
                mode={"tooltip"}
              />
            ),
        };
      }),
    );
  };

  useEffect(() => {
    salesMetadataQuery.data?.length > 0 && formatMetadata();
  }, [salesMetadataQuery.data, reload]);

  return (
    <>
      <Table
        columns={
          type !== "Vet" ? billAndBudgetLiftColumns : billAndBudgetColumns
        }
        dataSource={formatedMetadata}
        rowClassName={(record, index) =>
          `ant-table-row ant-table-row-level-0 ${record.patientID === patient.id ? "______table-row" : ""}`
        }
      />
      <AddBillPaymentWithCredits
        isOpen={openCredits}
        toggle={() => setOpenCredits((old) => !old)}
        params={{
          tutor: mainTutor?.id,
          patient: patient?.id,
        }}
        onDelete={() => salesMetadataQuery.refetch()}
      />
      <TutorAggregatedCredits tutorID={mainTutor.id ?? patient.id} selectedDebits={openTotal} />
    </>
  );
}
