export type CrmStatus = {
  id: number;
  description:
    | "Agendado"
    | "Comparecido"
    | "Faltou"
    | "Desmarcou"
    | "Fechado"
    | "Nova oportunidade";
  tag: "A" | "C" | "F" | "D" | "D" | "FE" | "N";
  type: "OP";
  active: boolean;
  created_at: null | Date;
  updated_at: null | Date;
};
