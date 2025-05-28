import {
  useToast,
  ActionsTable,
} from "infinity-forge";

import { IMeta } from "@/domain";
import { RemoteMetas } from "@/data";
import { container, metasTypes } from "@/container";
import { Custom } from "./custom";

export function useTableMetasActions({
  mutate,
}: {
  mutate: (params?: any) => void;
}) {
  const { createToast } = useToast();

  async function executeDelete(item) {
    await container.get<RemoteMetas>(metasTypes.RemoteMetas).delete({
      id: item?.id,
    });

    mutate();

    createToast({
      status: "success",
      message: "Excluido com sucesso!",
    });
  }

  const baseAction = {
    title: "Criar meta",
    text: "Criar nova meta",
    debugMode: true,
    initialDataIsTableItem: true,
    button: { text: "Salvar" },
    initialValues: {
      active: true,
    },
    isStickyButtons: true,
    onSucess: async (data) => {
      await container
        .get<RemoteMetas>(metasTypes.RemoteMetas)
        [data.id ? "update" : "create"]({
          ...data,
          type: data?.type[0],
        });

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
          name: "type",
          InputComponent: "Select",
          label: "Tipo meta",
          isMultiple: false,
          options: [
            {
              label: "Valor (R$)",
              value: "R$",
            },
            {
              label: "Porcentagem (%)",
              value: "%",
            },
            {
              label: "Quantidade",
              value: "Qtd",
            },
          ],
        },
      ],
    ],
  };

  const createAction = {
    ...baseAction,
    inputs: baseAction.inputs.map((inputRow) =>
      inputRow.filter((input) => input.name !== "active")
    ),
  };

  const detail = {
    title: "Criar meta",
    text: "Criar nova meta",
    debugMode: true,
    initialDataIsTableItem: true,
    button: { text: "Salvar" },
    isStickyButtons: true,
    onSucess: async (data) => {
      await container
        .get<RemoteMetas>(metasTypes.RemoteMetas)
        [data.id ? "update" : "create"]({
          ...data,
          type: data?.type[0],
        });

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
          name: "type",
          InputComponent: "Select",
          label: "Tipo meta",
          isMultiple: false,
          options: [
            {
              label: "Valor (R$)",
              value: "R$",
            },
            {
              label: "Porcentagem (%)",
              value: "%",
            },
            {
              label: "Quantidade",
              value: "Qtd",
            },
          ],
        },
      ],
    ],
  } as any;

  return {
    create: createAction,
    edit: baseAction,
    custom: [(props) => <Custom mutateTable={mutate} {...props} />],
    delete: executeDelete,
    modalStyles: { maxWidth: 1024 },
    confirmDelete: true,
  } as ActionsTable<IMeta>;
}
