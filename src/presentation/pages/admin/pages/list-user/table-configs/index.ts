import { Column } from "infinity-forge";

import { UserController } from "@/domain";
import { ActionsListUserController } from "./actions-list-user-controller";

export const tableListCollaboratorsConfig: Column<UserController>[] = [
  {
    id: "name",
    label: "Nome",
    width: 200,
  },
  {
    id: "email",
    label: "Email",
    width: 200,
  },
  {
    id: "document",
    label: "Documento",
    width: 200,
  },
  {
    width: 300,
    id: "roleId",
    label: "Ações",
    Component: {
      Element: ActionsListUserController,
      props: {},
      allProps: true,
      defaultProps: {}
    }
  }
];
