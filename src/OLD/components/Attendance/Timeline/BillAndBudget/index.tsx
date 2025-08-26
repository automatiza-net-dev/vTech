// @ts-nocheck
import React, { useState, useEffect } from "react";

import { usePatientSalesMetadata } from "@/OLD/hooks/usePatientMetadata";
import { useDailyCasher } from "@/OLD/hooks/useDailyCashiers";

import { Table } from "antd";
import BudgetActions from "@/OLD/components/Budget/Actions/Container";
import BillActions from "@/OLD/components/Bill/Actions/Container";

import { billAndBudgetColumns, billAndBudgetLiftColumns } from "./Columns";
import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";
import { useDictionary, useConfigurationsSystem } from "@/presentation";

import { billStatusFormatter } from "@/OLD/components/Bill/utils/status-formater";
import { budgetStatusFormatter } from "@/OLD/components/Budget";

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


  const {type} = useConfigurationsSystem()
  const { getWord } = useDictionary();
  const { cashiers } = useDailyCasher(cashierFilters);
  const { salesMetadata } = usePatientSalesMetadata(patient?.id, reload);

  useEffect(() => {
    setCashierFilters({
      from: moment(new Date()).startOf("day"),
      to: moment(new Date()).endOf("day"),
      status: "ABERTO",
    });
  }, []);

  const formatMetadata = () => {
    setFormatedMetadata(
      salesMetadata.map((item) => {
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
          client: item?.client,
          actions:
            item?._type === "sale" ? (
              <BillActions
                bill={item}
                setReload={setReload}
                cashiers={cashiers}
              />
            ) : (
              <BudgetActions
                key={item.id}
                budget={item}
                setReload={setReload}
                mode={'tooltip'}
              />
            ),
        };
      })
    );
  };

  useEffect(() => {
    salesMetadata?.length > 0 && formatMetadata();
  }, [salesMetadata, reload]);

  return (
    <Table
      columns={
        type !== "Vet"
          ? billAndBudgetLiftColumns
          : billAndBudgetColumns
      }
      dataSource={formatedMetadata}
    />
  );
}
