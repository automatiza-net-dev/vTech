import { Error } from "infinity-forge";

import { IClientPermissionProps } from "./interfaces";

export function ClientPermission({ children, client }: IClientPermissionProps) {
  if (client) {
    const permission = process.env.client === client;
    if (!permission) return <></>;
  }

  return <Error name="ClientPermission">{children}</Error>;
}
