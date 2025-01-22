import { BusinessUnit, User, Bill, Tutor, Patient, Product } from "@/domain";

export type CommissionConference = {
  dataInicio: string;
  dataFim: string;
  comissao: {
    id: User["id"];
    vendedor: User["name"];
    unidadeNegocios: BusinessUnit["companyName"];
    codigoVenda: Bill["tag"];
    cliente: Tutor["name"];
    paciente: Patient["name"];
    produtoServico: Product["description"];
    totalServicoProduto: string;
    percentualComissao: string;
    valorComissao: string;
  }[];
};

export type LoadAllCommissionReportsConference = {
  loadAllCommissionsConference: (
    params: LoadAllCommissionReportsConference.Params
  ) => Promise<LoadAllCommissionReportsConference.Model>;
};

export namespace LoadAllCommissionReportsConference {
  export type Params = {
    unit?: BusinessUnit["id"][];
    from?: string;
    to?: string;
  };

  export type Model = CommissionConference[];
}
