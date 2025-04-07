import { AccessDenied, PermissionItem, usePermission } from "@/presentation";

import moment from "moment";
import { useQuery, PageWrapper, api, useTable, useToast } from "infinity-forge";

type VariationGroup = {
  active: boolean;
  created_at: string;
  description: string;
  economic_group_id: string;
  id: string;
  updated_at: string;
  variations: {
    id: string;
    economic_group_id: string;
    description: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    options: {
      id: string;
      variation_id: string;
      description: string;
      active: boolean;
      created_at: string;
      updated_at: string;
    }[];
  }[];
};

export function VariationsGroupPage() {
  return (
    <PermissionItem
      hash={"GVA01"}
      DaniedComponent={() => <AccessDenied loading={false} />}
    >
      <PageWrapper title="Controle de Variação">
        <Page />
      </PageWrapper>
    </PermissionItem>
  );
}

function Page() {
  const { createToast } = useToast();

  const { data, mutate, isFetching } = useQuery({
    queryKey: "variations_group",
    queryFn: async () => {
      const response = await api({ method: "get", url: "variation-groups" });

      return response as VariationGroup[];
    },
  });

  const variations = useQuery({
    queryKey: "variations",
    queryFn: async () => {
      const response = await api({ url: "variations", method: "get" });

      return response as { id: string; description: string }[];
    },
  });

  const canEditGroupVariations = usePermission("GVA02");
  const canCreateGroupVariations = usePermission("GVA01");
  const canDeleteGroupVariations = usePermission("GVA03");

  const { Table } = useTable<VariationGroup>({
    configs: {
      errorMessage: "Nenhum grupo de variação cadastrado",
      isLoading: isFetching,
      tableData: data?.map((item) => ({
        ...item,
        variations: item.variations?.map((item) => item.id),
      })) as any,
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
          id: "variations",
          label: "Nº de variações",
          Component: {
            Element: (props) => props?.variations?.length || 0,
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
        delete: !canDeleteGroupVariations
          ? undefined
          : {
              confirmDelete: true,
              onDelete: async (item) => {
                await api({
                  url: `variation-groups/${item.id}`,
                  method: "delete",
                });

                await mutate();

                createToast({
                  message: "Registro deletado com sucesso",
                  status: "success",
                });
              },
            },
        edit: !canEditGroupVariations
          ? undefined
          : {
              isStickyButtons: true,
              initialDataIsTableItem: true,
              button: {
                text: "Salvar",
              },
              onSucess: async (formData, _) => {
                await api({
                  url: `variation-groups/${formData.id}`,
                  method: "put",
                  body: {
                    active: formData?.active,
                    description: formData?.description,
                    options: formData?.variations,
                  },
                });

                await mutate();

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
                    InputComponent: "Select",
                    name: "variations",
                    isMultiple: true,
                    options: variations?.data?.map((vari) => ({
                      label: vari.description,
                      value: vari.id,
                    })),
                  },
                ],
              ],
              modal: { title: "Editar de grupos de variação" } as any,
            },
        create: !canCreateGroupVariations
          ? undefined
          : {
              isStickyButtons: true,
              onSucess: async (data) => {
                await api({
                  url: "variation-groups",
                  method: "post",
                  body: {
                    description: data.description,
                    options: data?.variations
                  },
                });

                await mutate();

                createToast({
                  message: "Criado com sucesso",
                  status: "success",
                });
              },
              text: "Criar grupo de variação",
              modal: { title: "Cadastro de grupos de variação" } as any,
              inputs: [
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
                    InputComponent: "Select",
                    name: "variations",
                    isMultiple: true,
                    options: variations?.data?.map((vari) => ({
                      label: vari.description,
                      value: vari.id,
                    })),
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
