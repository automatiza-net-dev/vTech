import { Column } from "infinity-forge";

import { StatusRoleController } from "./status";
import { ActionsListAccessControls } from "./actions";
import { ExternalAccessRoleController } from "./external-access";

export const tableConfiguration: Column<any>[] = [
  {
    id: "name",
    label: "Nome",
    width: 200,
  },
  {
    id: "active",
    label: "Status",
    width: 200,
    Component: {
      Element: StatusRoleController as any,
      allProps: true,
      defaultProps: {},
      props: {}
    }, 
  },
  {
    id: "external_access",
    label: "Acesso Externo",
    width: 200,
    Component: {
      Element: ExternalAccessRoleController as any,
      allProps: true,
      defaultProps: {},
      props: {}
    },
  },
  {
    width: 300,
    id: "actions",
    label: "Ações",
    Component: {
      Element: ActionsListAccessControls as any,
      props: {},
      allProps: true,
      defaultProps: {}
    }
  }
];
