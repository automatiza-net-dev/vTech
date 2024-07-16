import { BusinessUnit, Tutor, User, Balance } from "@/domain";

export type OpportunityReport = {
  unidade: BusinessUnit["identification"];
  codigo_oportunidade: number;
  nome_contato: Tutor["name"];
  celular_contato: Tutor["cellphone"];
  profissao: null | Tutor["profession"];
  origem_cliente: Tutor["clientOrigin"];
  data_contato: Date;
  data_abertura: Date;
  data_lancamento: Date;
  valor_oportunidade: number;
  titulo_oportunidade: null | string;
  status_oportunidade: "Nova Oportunidade";
  assunto_contato: null | string;
  tipo_contato: null;
  responsavel: User["user"]["name"];
  situacao: "Em Aberto";
  observacao: null | string;
  motivo_ganho_perda: null | string;
  obse_ganho_perda: null | string;
  valor_ganho: null | number;
};

export type LoadOpportunitiesReport = {
  loadOpportunitiesReport: (
    params: LoadOpportunitiesReport.Params
  ) => Promise<LoadOpportunitiesReport.Model>;
};

export namespace LoadOpportunitiesReport {
  export type Params = {
    units?: BusinessUnit["id"][];
    statuses?: number[];
    users?: User["id"][];
    contact?: Tutor["id"];
    clients?: Tutor["id"][];
    balances?: Balance["description"][];
    fromOpening?: Date;
    toOpening?: Date;
    fromContact?: Date;
    toContact?: Date;
  };

  export type Model = OpportunityReport[];
}
