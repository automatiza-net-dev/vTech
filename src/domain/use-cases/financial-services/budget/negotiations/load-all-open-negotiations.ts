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
}

export type Document = {
  id: number;
  bill_id: Bill["id"];
  timeline_ref: TimeLine["_id"];
  printed_at: null;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  documentTemplate: DocumentTemplate;
  printUser: {id: string, name: string} | null;
  generationUser: {
    id: User["user"]["id"];
    name: User["user"]["name"];
  };
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
  bills: {
    budget_id: Budget["id"];
    created_at: Bill["created_at"];
    document_status: Bill["document_status"];
    id: Bill["id"];
    tag: Bill["tag"];
  }[];
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
