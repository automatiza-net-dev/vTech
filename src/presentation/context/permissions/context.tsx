import { createContext, useContext, useMemo } from "react";

import { useMe } from "@/presentation";

const PermissionsContext = createContext<Record<string, boolean>>({});

export function PermissionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useMe();

  const permissions = useMemo(() => {
    const result: Record<string, boolean> = {};
    if (data) {
      data.cl.forEach((hash) => (result[hash] = true));
    }
    return result;
  }, [data]);

  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermission(hash: string) {
  const permissions = useContext(PermissionsContext);
  return permissions[hash] || false;
}
