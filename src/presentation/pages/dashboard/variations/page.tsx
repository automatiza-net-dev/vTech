import { AccessDenied, PermissionItem, usePermission } from "@/presentation";

import moment from "moment";
import { useQuery, PageWrapper, api, useTable, useToast } from "infinity-forge";

export function VariationsPage() {
  return (
    <PermissionItem
      hash={"VAR00"}
      DaniedComponent={() => <AccessDenied loading={false} />}
    >
      <PageWrapper title="Controle de Variação">
        <Page />
      </PageWrapper>
    </PermissionItem>
  );
}

type Variation = {
  active: boolean;
  created_at: string;
  description: string;
  economic_group_id: string;
  id: string;
  options: {
    active: boolean;
    created_at: string;
    description: string;
    id: string;
    updated_at: string;
    variation_id: string;
  }[];
  updated_at: string;
};

function Page() {
  const { createToast } = useToast();

  const { data, mutate, isFetching } = useQuery({
    queryKey: "variations",
    queryFn: async () => {
      const response = await api({ method: "get", url: "variations" });

      return response as Variation[];
    },
  });

  const canEdit = usePermission("VAR02");
  const canCreate = usePermission("VAR01");
  const canDelete = usePermission("VAR03");

  const { Table } = useTable({
    configs: {
      errorMessage: "Nenhum variação cadastrada",
      isLoading: isFetching,
      tableData: data || [],
    },
    columnsConfiguration: {
      columns: [
        { id: "description", label: "Descrição" },
        {
          id: "active",
          label: "Status",
          Component: {
            Element: (props) => (props.active ? "Ativo" : "Inativo"),
          },
        },
        {
          id: "options",
          label: "Nº de opções",
          Component: {
            Element: (props) => props?.options?.length || 0,
          },
        },
        {
          id: "created_at",
          label: "Data de criação",
          Component: {
            Element: (props) =>
              moment(props.created_at).format("DD/MM/YYYY - HH:mm"),
          },
        },
      ],
      actions: {
        delete: !canDelete
          ? undefined
          : {
              confirmDelete: true,
              onDelete: async (item) => {
                await api({
                  url: `variations/${item.id}`,
                  method: "delete",
                });

                await mutate();

                createToast({
                  message: "Registro deletado com sucesso",
                  status: "success",
                });
              },
            },
        edit: !canEdit
          ? undefined
          : {
              isStickyButtons: true,
              initialDataIsTableItem: true,
              button: {
                text: "Salvar",
              },
              onSucess: async (formData, _, initialValue) => {
                await mutate();
                

                for (const v of formData.options || []) {
                    await api({
                      url: "variation-options",
                      method: "post",
                      body: {
                        description: formData.description,
                        variationId: formData.id,
                      },
                    });
                  }

                createToast({
                  status: "success",
                  message: "Registro atualizado com sucesso",
                });
              },
              inputs: [
                [
                  {
                    label: "Ativo",
                    InputComponent: "InputSwitch",
                    name: "active",
                  },
                ],
                [
                  {
                    label: "Descrição",
                    InputComponent: "Input",
                    name: "description",
                  },
                ],
                [
                  {
                    label: "Adicionar variação",
                    InputComponent: "InputManager",
                    name: "options",
                    inputPath: "options",
                    maxItemWidth: 450,
                    inputs: [
                      [
                        {
                          InputComponent: "Input",
                          name: "id",
                          style: { display: "none" },
                        },
                      ],
                      [{ InputComponent: "Input", name: "description" }],
                    ],
                  },
                ],
              ],
              modal: {
                title: "Editar de grupos de variação",
                styles: { maxWidth: 1300 },
              } as any,
            },
        create: !canCreate
          ? undefined
          : {
              isStickyButtons: true,
              onSucess: async (data) => {
                await api({ url: "variations", method: "post", body: data });

                await mutate();

                createToast({
                  message: "Criado com sucesso",
                  status: "success",
                });
              },
              text: "Criar variação",
              modal: { title: "Cadastro de variação" } as any,
              inputs: [
                [
                  {
                    label: "Descrição",
                    InputComponent: "Input",
                    name: "description",
                  },
                ],
              ],
              button: { text: "Criar" },
            },
      },
    },
  });

  return Table;
}
