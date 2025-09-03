import {
  BusinessUnit,
  Patient,
  Tutor,
  VaccineProtocol,
  Specie,
} from "@/domain";

export type Vaccine = {
  created_at: string;
  description: string;
  id: string;
  name: string;
  reserved_for_system: boolean;
  type: "vaccine" | "vermifuge";
  updated_at: string;
  active?: boolean;
  subgroupId?: string;
  economic_group_id: string | null
  unidade: BusinessUnit["identification"];
  paciente: Patient["name"];
  tutor: Tutor["name"];
  contato_tutor: Tutor["cellphone"];
  vacina_vermifugo: "vacina" | "vermifugo";
  nome_vacina: string;
  descricao_vacina: string;
  nome_protocolo: VaccineProtocol["name"];
  especie: Specie["description"];
  data_agendamento: string;
  data_aplicacao: string;
  dose: number;
  laboratorio: string;
  lote: string;
  status:
    | "Dose aplicada"
    | "Dose Pendente - em dia"
    | "Dose Pendente - atrasada";
  aplicado_fora: boolean;
};
