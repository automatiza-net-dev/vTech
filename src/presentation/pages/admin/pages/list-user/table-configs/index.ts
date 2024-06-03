import { IColumnTable } from "@/presentation";
import { ActionsListUserController } from "./actions-list-user-controller";


export const tableListCollaboratorsConfig: IColumnTable[] = [
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
    id: "actions",
    label: "Ações",
    Component: {
      Element: ActionsListUserController,
      props: {},
      allProps: true,
      defaultProps: {}
    }
  }
];
