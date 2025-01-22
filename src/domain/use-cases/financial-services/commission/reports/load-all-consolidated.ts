import { BusinessUnit, User } from "@/domain";

export type CommissionConsolidated = {
  dataInicio: string;
  dataFim: string;
  vendedor: [
    {
      id: User["id"];
      totalVendas: string;
      valorComissao: string;
    }[]
  ];
};

export type LoadAllCommissionReportsConsolidated = {
  loadCommissionsConsolidated: (
    params: LoadAllCommissionReportsConsolidated.Params
  ) => Promise<LoadAllCommissionReportsConsolidated.Model>;
};

export namespace LoadAllCommissionReportsConsolidated {
  export type Params = {
    unit?: BusinessUnit["id"][];
    from?: string;
    to?: string;
  };

  export type Model = CommissionConsolidated[];
}
