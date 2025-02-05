import {
  DashboardRankingFaturamento,
  DashboardRankingTicketMedio,
  DashboardRankingVendedores,
  DashboardTableType,
  DashboardTableTypes,
  RankingVendedores,
} from "@/domain";

import { BillSalesUserTable } from "./budgets-table";
import { SalesPerPeriodTable } from "./sales-per-period-table";
import { SalesByUserTable } from "./sales-by-user-table";
import { ActivitiesTable } from "./activities-table";
import { useTable } from "infinity-forge";

export function TableDashboard(props: DashboardTableType) {
  switch (props.name) {
    case "sales-per-period":
      return props.data.length > 0 && <SalesPerPeriodTable {...props} />;
    case "budgets":
      return props.data.length > 0 && <BillSalesUserTable {...props} />;
    case "sales-per-user":
      return props.configs.length > 0 && <SalesByUserTable {...props} />;
    case "RankingVendedores":
      return <RakingVendedores {...props} />;
    case "RankingFaturamento":
      return <RakingFaturamento {...props} />;
    case "RankingTicketMedio":
      return <RakingTicketMedio {...props} />;
    case "activities":
      return <ActivitiesTable {...props} />;
  }
}

function RakingVendedores(props: DashboardTableType) {
  const { Table } = useTable({
    columnsConfiguration: {
      columns: [
        {
          id: "grupo_economico",
          label: "Grupo",
        },
        {
          id: "unidade_negocios",
          label: "Unidade",
        },
        {
          id: "nome_vendedor",
          label: "Total",
        },
        {
          id: "total_bills",
          label: "Total",
        },
        {
          id: "tkt_medio",
          label: "TKT MÉD",
        },
      ],
    },
    configs: {
      errorMessage: "Não possui ranking de vendedores",
      isLoading: false,
      tableData: props.data as DashboardRankingVendedores["data"],
    },
  });

  return (
    <>
      <h3>{props.description}</h3>
      {Table}
    </>
  );
}

function RakingFaturamento(props: DashboardTableType) {

  const { Table } = useTable({
    columnsConfiguration: {
      columns: [
        {
          id: "unidade_negocios",
          label: "Unidade",
        },
        {
          id: "total_bills",
          label: "Total",
        },
        {
          id: "participacao",
          label: "%",
        },
      ],
    },
    configs: {
      errorMessage: "Não possui ranking de vendedores",
      isLoading: false,
      tableData: (props?.data || []) as DashboardRankingFaturamento["data"],
    },
  });

  return (
    <div>
      <h3>{props.description}</h3>
      {Table}
    </div>
  );
}

function RakingTicketMedio(props: DashboardTableType) {
  const { Table } = useTable({
    columnsConfiguration: {
      columns: [
        {
          id: "unidade_negocios",
          label: "Unidade",
        },
        {
          id: "tkt_medio",
          label: "Total",
        },
      ],
    },
    configs: {
      errorMessage: "Não possui ranking de ticket médio",
      isLoading: false,
      tableData: props.data as DashboardRankingTicketMedio["data"],
    },
  });

  return (
    <div>
      <h3>{props.description}</h3>
      {Table}
    </div>
  );
}
