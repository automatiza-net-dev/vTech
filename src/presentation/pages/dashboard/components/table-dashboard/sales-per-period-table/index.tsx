import { useTable } from "infinity-forge";
import { DashboardTableType, Period } from "@/domain";

import { columns } from "./columns";

import * as S from "./styles";

const labelControl = (str: string) => {
  switch (str) {
    case "dawn":
      return "Madrugada";
    case "morning":
      return "Manhã";
    case "afternoon":
      return "Tarde";
    case "night":
      return "Noite";
    default:
      return "verificar";
  }
};

export function SalesPerPeriodTable({ data, description }: DashboardTableType) {
  const periods = Object.keys((data as any)[0]?.period);

  const { Table } = useTable<Period>({
    columnsConfiguration: {
      columns,
    },
    configs: {
      disablePagination: true,
      disableOrdenationTable: true,
      disableGetFilter: true,
      pagination: {
        endPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        page: 1,
        pages: [1],
        pageSize: 1,
        startPage: 1,
        totalItems: 3,
        totalPages: 1,
      },
      errorMessage: "Não há itens no momento",
      tableData: periods.map((item) => ({
        ...(data as any)[0].period[item],
        period: labelControl(item),
      })),
    },
  });

  return (
    <S.SalesPerPeriodTable>
      {description && <h3>{description}</h3>}

      {Table}
    </S.SalesPerPeriodTable>
  );
}
