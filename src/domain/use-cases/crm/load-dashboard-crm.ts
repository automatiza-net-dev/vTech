import { Dashboard } from "@/domain";

export type LoadDashboardCRM = {
  loadDashboardCRM: (
    params: LoadDashboardCRM.Params
  ) => Promise<LoadDashboardCRM.Model>;
};

export namespace LoadDashboardCRM {
  export type Params = {
    period?: string;
  };

  export type Model = Dashboard;
}
