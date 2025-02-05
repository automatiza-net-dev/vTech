import {
  useState,
  Dispatch,
  useContext,
  createContext,
  SetStateAction,
} from "react";

import moment from "moment";
import { QueryState } from "infinity-forge";

import { Dashboard } from "@/domain";

import { useLoadDashboard } from "./use-load-dashboard";

export type DashboardType = "crm" | "admin" | undefined;
export type FiltersDashboard = {
  units?: string[];
  toDate?: string;
  fromDate?: string;

  to?: string;
  from?: string;
};

const dashboardContext = createContext<{
  type?: DashboardType;
  filters: FiltersDashboard;
  dashboard?: Required<QueryState<Partial<Dashboard> | undefined>>;
  setFilters: Dispatch<SetStateAction<FiltersDashboard>>;
}>({ filters: {}, setFilters: () => {} });

export function DashboardProvider({
  children,
  type,
}: {
  type?: DashboardType;
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState<FiltersDashboard>({
    toDate: moment().format("YYYY-MM-DD"),
    fromDate: moment().format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD"),
    from: moment().format("YYYY-MM-DD"),
  });

  const dashboard = useLoadDashboard({ type, filters });

  return (
    <dashboardContext.Provider value={{ type, dashboard, setFilters, filters }}>
      {children}
    </dashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(dashboardContext);
}
