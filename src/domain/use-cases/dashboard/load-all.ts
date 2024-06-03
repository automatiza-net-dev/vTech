import { Dashboard } from "./chart";

export type LoadDashboard = {
  loadAll: (params: LoadDashboard.Params) => Promise<LoadDashboard.Model>;
};

export namespace LoadDashboard {
  export type Params = {
    fromDate?: string;
    toDate?: string;
    units?: string[];
    groups?: string[];
    type?: string;
  };

  export type Model = Dashboard;
}
