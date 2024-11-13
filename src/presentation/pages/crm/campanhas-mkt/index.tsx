import { useTable } from "infinity-forge";

import { Marketing } from "@/domain";
import { useLoadMarketing } from "@/presentation";

import { columns, useTableMarketingActions } from "./table";

import * as S from "./styles";

export function CampanhasMkt() {
  const { data, mutate } = useLoadMarketing({ allCampaigns: false });
  const actions = useTableMarketingActions({ mutate });

  const { Table } = useTable<Marketing>({
    columnsConfiguration: {
      columns,
      actions,
    },
    configs: {
      disableRoutingUpdateFilters: true,
      customFilters: [
        {
          name: "description",
          label: "Nome Campanha",
          InputComponent: "Input",
        },
        {
          name: "dateFrom",
          label: "Data Início",
          InputComponent: "InputDatePicker",
          language: "pt",
          mode: "date",
        },
        {
          name: "dateTo",
          label: "Data Fim",
          InputComponent: "InputDatePicker",
          language: "pt",
          mode: "date",
        },
      ] as any,
      errorMessage: "Não há itens no momento",
      tableData: data || [],
    },
  });

  return <S.CamapanhaMkt>{Table}</S.CamapanhaMkt>;
}
