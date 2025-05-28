import {
  useToast,
  ActionsTable,
  TableActionEdit,
  TableActionCreate,
} from "infinity-forge";

import { useVerifyPermissions } from "@/presentation";
import { Marketing } from "@/domain";
import { RemoteDre } from "@/data";
import { container, TypesAutomatiza } from "@/container";

export function useDreGroupsTableActions({
  mutate,
}: {
  mutate: (params?: any) => void;
}) {
  const hasPermissionCreate = useVerifyPermissions("AGR01");
  const hasPermissionUpdate = useVerifyPermissions("AGR02");
  const hasPermissionDelete = useVerifyPermissions("AGR03");

  const { createToast } = useToast();

  async function executeDelete(data) {
    await container
      .get<RemoteDre>(TypesAutomatiza.RemoteDre)
      .deleteDreGroup(data);

    mutate();

    createToast({
      status: "success",
      message: "Excluido com sucesso!",
    });
  }

  const action = {
    title: "Agrupamento DRE",
    text: "Cadastrar",
    initialDataIsTableItem: true,
    button: { text: "Salvar", style: { backgroundColor: "red !important" } },
    isStickyButtons: true,
    onSucess: async (data) => {
      await container
        .get<RemoteDre>(TypesAutomatiza.RemoteDre)
        [data.id ? "editDreGroup" : "createDreGroup"](data);

      mutate();

      createToast({
        status: "success",
        message: "Ação realizada com sucesso!",
      });
    },
    inputs: [
      [
        {
          name: "description",
          InputComponent: "Input",
          type: "text",
          label: "Descrição",
        },
        {
          name: "active",
          InputComponent: "InputSwitch",
          type: "text",
          label: "Ativo",
        },
      ],
      [
        {
          name: "sequence",
          InputComponent: "Input",
          label: "Sequencia Dre",
          type: "number",
        },
      ],
    ],
  } as TableActionCreate<Marketing> & TableActionEdit<Marketing>;

  return {
    create: action,
    edit: hasPermissionUpdate && action,
    delete: hasPermissionDelete && executeDelete,
    modalStyles: { maxWidth: 1024 },
    confirmDelete: true,
  } as ActionsTable<Marketing>;
}
