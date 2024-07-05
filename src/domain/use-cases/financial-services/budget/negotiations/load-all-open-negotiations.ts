import { BusinessUnit, BusinessUser, Event, Tutor, Budget } from "@/domain";

export type Negotiation = {
  id: string;
  resume: string;
  protocol: string;
  start_date: Date;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
  internal_observation: string | null;
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
