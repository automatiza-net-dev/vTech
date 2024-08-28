import { ReactNode } from "react";

import { IClient } from "@/presentation";

export interface IClientPermissionProps {
  children: ReactNode;
  client?: IClient;
}
