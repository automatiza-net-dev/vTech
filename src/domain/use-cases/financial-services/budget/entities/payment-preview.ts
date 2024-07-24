import { Budget, PaymentMethod, Payment, BusinessUser } from "@/domain";

export type PaymentsPreview = {
  id_orcamento_pgto: number;
  id_orcamento: Budget["id"];
  bloco: number;
  valor_total: number;
  qtd_parcelas_bloco_pgto: number;
  id_forma_pagamento: PaymentMethod["id"];
  descricao_forma_pagamento: PaymentMethod["description"];
  id_badeira_tef: Payment['flag']['id'];
  descricao_bandeira_tef: Payment['flag']['description'];
  id_adquirente_tef: Payment['acquirer']['id'];
  descricao_adquirente_tef: Payment['acquirer']['description'];
  status: Payment['status'];
  data_lancamento: Date;
  id_usuario_lancamento: BusinessUser['id'];
  nome_usuario_lancamento: BusinessUser['name'];
  data_alteracao: null | Date;
  id_usuario_alteracao: null | BusinessUser['id'];
  nome_usuario_alteracao: null | BusinessUser['name'];
  data_confirmacao: null | Date;
  id_usuario_confirmacao: null | BusinessUser['id'];
  nome_usuario_confirmacao: null | BusinessUser['name'];
  data_exclusao: null | Date;
  id_usuario_exclusao: BusinessUser['id'];
  nome_usuario_exclusao: BusinessUser['name'];
  origem_exclusao: "Orçamento" | null;
};

// TODO Verfificar possíveis origens de exclusão
