import { createContext, useContext } from "react";

import { QueryState } from "infinity-forge";

import { Dashboard } from "@/domain";

import { useLoadDashboard } from "./use-load-dashboard";

export type DashboardType = "crm" | "admin" | undefined;

const dashboardContext = createContext<{
  type?: DashboardType;
  dashboard?: Required<QueryState<Partial<Dashboard> | undefined>>;
}>({});

export function DashboardProvider({
  children,
  type,
}: {
  type?: DashboardType;
  children: React.ReactNode;
}) {
  const dashboard = useLoadDashboard({ type });

  return (
    <dashboardContext.Provider value={{ type, dashboard }}>
      {children}
    </dashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(dashboardContext);
}
