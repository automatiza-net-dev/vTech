import { Error } from "infinity-forge";

import { IClientPermissionProps } from "./interfaces";
import { useConfigurationsSystem } from "@/presentation/context";

export function ClientPermission({ children, client }: IClientPermissionProps) {

  const {name} = useConfigurationsSystem()

  if (client) {
    const permission = name === client;
    if (!permission) return <></>;
  }

  return <Error name="ClientPermission">{children}</Error>;
}
