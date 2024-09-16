import { Patient } from "./entities/patient";

export type LoadLastUpdates = {
  loadLastUpdates: (
    params: LoadLastUpdates.Params
  ) => Promise<LoadLastUpdates.Model>;
};

export type TimelineType =
  | "15"
  | "Vendas"
  | "Glicemia"
  | "Consulta"
  | "Peso"
  | "Orçamentos"
  | "Documento"
  | "Exames"
  | "Fotos"
  | "Pressão arterial"
  | "Patologia"
  | "Observação"
  | "Formato Receita Médica"
  | "Vacinas"
  | "Hospitalização"
  | "Vermifugos";

export type TimeLineEvent = "TROCA_TUTOR_PRINCIPAL" | "new_vaccine" | "OBITO";

export type TimeLine = {
  timeline_type: {
    description: TimelineType;
    color: string;
    requires_observation: boolean;
  };
  _id: string;
  timeline_id: string;
  timeline_info: {
    print?: {
      date: string;
      user_id: string;
    };
    $meta?: {
      bill_document_id?: string;
      bill_id?: string;
    };
    origin?:
      | "new_vaccine"
      | "vaccine_application"
      | "new_vermifuge"
      | "vermifuge_application";
    attachments?: any[];
    photos?: any[];
    medias?: any[];
    title?: string;
    type?: string;
    observation?: string;
    weight?: string;
    attendance: { id: number };
    finishedAt: null;
    internalObservation: string;
    protocol: string;
    realizedAt: string;
    resume: string;
    exam: { id: string; name: string };
    service: {
      id: string;
      resume: string;
      description: string;
    };
    tag: string;
    event: TimeLineEvent;
    technician: {
      id: string;
      name: string;
    };
    old_tutor: {
      id: string;
      name: string;
    };
    new_tutor: {
      id: string;
      name: string;
    };
    vaccine: {
      id: string;
      name: string;
      description: string;
      origin: string;
    };
    bed?: { name: string }
    complaint?: string;
    diagnosis?: string;
    expectedDischarge?: string;
    prognosis?: string;
    realized?: string;
    risk?: number;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export namespace LoadLastUpdates {
  export type Params = {
    id: Patient["id"];
  };

  export type Model = TimeLine[];
}
