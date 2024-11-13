import { Marketing, BusinessEconomicGroup, BusinessUnit } from "@/domain";

export type MarketingCampaingsReports = {
  group: {
    id: BusinessEconomicGroup["id"];
    fantasyName: BusinessEconomicGroup["fantasy_name"];
    units: {
      id: BusinessUnit["id"];
      identification: BusinessUnit["identification"];
      campaigns: Marketing &
        {
          qtyOpportunities: number;
          sumOpportunityProfit: number;
          sumOpportunityValue: number;
          cpl: number;
          qtyNovas: number;
          qtyAgendadas: number;
          qtyComparecidas: number;
          qtyFaltou: number;
          qtyDesmarcou: number;
          qtyFechadas: number;
          qtyGanhos: number;
          qtyPerdas: number;
        }[];
    }[];
  };
};

export type LoadCampaingsReports = {
  loadCampaingsReports: (
    params: LoadCampaingsReports.Params
  ) => Promise<LoadCampaingsReports.Model>;
};

export namespace LoadCampaingsReports {
  export type Params = {
    units?: BusinessUnit["id"][];
    campaign?: Marketing["id"];
    active?: string;
    period?: string;
  };

  export type Model = MarketingCampaingsReports[];
}
