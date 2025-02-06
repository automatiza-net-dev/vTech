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
};

const dashboardContext = createContext<{
  type?: DashboardType;
  filters: FiltersDashboard | null;
  dashboard?: Required<QueryState<Partial<Dashboard> | undefined>>;
  setFilters: Dispatch<SetStateAction<FiltersDashboard | null>>;
}>({ filters: {}, setFilters: () => {} });

export function DashboardProvider({
  children,
  type,
}: {
  type?: DashboardType;
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState<FiltersDashboard | null>({
    fromDate: moment().startOf("month").format("YYYY-MM-DD"),
    toDate: moment().endOf("month").format("YYYY-MM-DD"),
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
