import {
  BusinessUnit,
  BusinessUser,
  Event,
  Tutor,
  Budget,
  Bill,
  TimeLine,
  User,
} from "@/domain";

export type DocumentTemplate = {
  id: string;
  description: string;
  template: string;
  type: "text" | "pdf";
};

export type Document = {
  id: number;
  bill_id: Bill["id"];
  timeline_ref: TimeLine["_id"];
  printed_at: null;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  documentTemplate: DocumentTemplate;
  printUser: { id: string; name: string } | null;
  generationUser: {
    id: User["user"]["id"];
    name: User["user"]["name"];
  };
};

export type Treatments = {
  id: number;
  emission_date: string;
  observations: string | null;
  status: "Confirmado";
  cancellation_date: string | null;
  cancellation_observations: string | null;
  items: {
    description: string;
    quantity: number;
    quantity_executed: number | null;
    scheduled_quantity: number;
    observations: string | null;
    status: "Ativo";
    executions: {
      schedule_id: Event["event"]["id"];
      schedule_date: string | null;
      scheduled_quantity: number;
      quantity_executed: number;
      execution_date: string | null;
      observations: string | null;
      status: "Ativo";
      user: string | null;
      productivitItem: {
        id: number;
        description: string;
      };
    }[];
  }[];
};

export type Negotiation = {
  id: string;
  resume: string;
  protocol: string;
  start_date: Date;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
  internal_observation: string | null;
  bills: Bill[];
  documents: Document[];
  unit: {
    id: BusinessUnit["id"];
    identification: BusinessUnit["identification"];
  };
  closeUser: BusinessUser["name"] | null;
  scheduleService: {
    id: Event["event"]["id"];
    description: Event["event"]["serviceType"]["description"];
  };
  openUser: {
    id: BusinessUser["id"];
    name: BusinessUser["name"];
  };
  patient: {
    id: Tutor["id"];
    name: Tutor["name"];
  };
  budgets: Budget[];
  treatments: Treatments[];
};

export type LoadOpenNegotiations = {
  loadNegotiations: (
    params: LoadOpenNegotiations.Params
  ) => Promise<LoadOpenNegotiations.Model>;
};

export namespace LoadOpenNegotiations {
  export type Params = {
    id: Tutor["id"];
  };

  export type Model = Negotiation[];
}
