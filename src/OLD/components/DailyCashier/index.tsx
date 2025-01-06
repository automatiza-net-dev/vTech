import { PageWrapper, useTable } from "infinity-forge";

import AccessDenied from "@/OLD/components/AccessDenied";
import { useDailyCashier } from "@/OLD/hooks/useDailyCashiers";

import { usePermission } from "@/presentation";

import { columns, useDailyCashierTableActions } from "./table";

import * as S from "./styles";

export function DailyCashier() {
  const listDailyCashierPermission = usePermission("CAI00");

  const { data, isFetching, mutate } = useDailyCashier();
  const actions = useDailyCashierTableActions({ mutate }) as any;

  const { Table } = useTable({
    columnsConfiguration: {
      columns,
      actions,
    },
    configs: {
      customFilters: [
        {
          name: "fromOpening",
          InputComponent: "DatePicker",
          label: "Início",
        },
        {
          name: "toOpening",
          InputComponent: "DatePicker",
          label: "Fim",
        },
        {
          name: "tag",
          InputComponent: "Input",
          type: "text",
          label: "Cod.",
        },
        {
          name: "status",
          InputComponent: "Select",
          label: "Status",
          isClearable: true,
          value: "ABERTO",
          onlyOneValue: true,
          options: [
            {
              label: "Todos",
              value: "TODOS",
            },
            {
              label: "Aberto",
              value: "ABERTO",
            },
            {
              label: "Fechado",
              value: "FECHADO",
            },
            {
              label: "Revisão",
              value: "REVISAO",
            },
            {
              label: "Conferido",
              value: "CONFERIDO",
            },
          ],
        },
      ],
      disableRoutingUpdateFilters: true,
      errorMessage: "Não há itens no momento",
      isLoading: isFetching,
      tableData: data || [],
    },
  });

  return !listDailyCashierPermission ? (
    <AccessDenied />
  ) : (
    <PageWrapper title="Caixas diários">
      <S.DailyCashier>{Table}</S.DailyCashier>
    </PageWrapper>
  );
}
