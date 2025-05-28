import {
  api,
  useQuery,
  useTable,
  useToast,
  BadRequestError,
  useFiltersTable,
} from "infinity-forge";

import {
  useSystem,
  AccessDenied,
  usePermission,
  PermissionItem,
  LayoutDashboard,
} from "@/presentation";

import * as yup from "yup";

export default function TipoVendaRelacionada() {
  return (
    <LayoutDashboard>
      <Page />
    </LayoutDashboard>
  );
}

function Page() {
  const deletePermission = usePermission("VRL03");
  const createPermission = usePermission("VRL01");
  const updatePermission = usePermission("VRL02");

  const { createToast } = useToast();
  const { unit } = useSystem();

  const economicGroupId = unit?.economicGroup?.id;

  const { filtersObject } = useFiltersTable();

  const { data, isFetching, mutate } = useQuery({
    queryKey: ["bill-related-types", JSON.stringify(filtersObject)],
    queryFn: async () => {
      const active =
       filtersObject?.active 
          ? filtersObject?.active === "true"
            ? true
            : false
          : undefined;

      const response = await api({
        url: "bill-related-types",
        method: "get",
        body: {
          description: filtersObject?.description,
          active,
        },
      });

      return response as { id: string; description: string; active: boolean }[];
    },
  });

  const { Table } = useTable<{ id: string; description: string; active: boolean }>({
    columnsConfiguration: {
      columns: [
        { id: "description", label: "Descrição" },
        {
          id: "active",
          label: "ATIVO",
          Component: { Element: (props) => (props.active ? "Sim" : "Não") },
        },
      ],
      actions: {
        create: createPermission
          ? {
              text: "Criar novo",
              disableEnterKeySubmitForm: true,
              isStickyButtons: true,
              button: { text: "Salvar" },
              schema: { description: yup.string().required("Campo requerido") },
              onSucess: async (formData) => {
                const response = await api({
                  url: "bill-related-types/store",
                  method: "post",
                  body: { economicGroupId, description: formData?.description },
                });

                await mutate();

                createToast({
                  status: "success",
                  message: "Registro criado com sucesso",
                });
              },
              inputs: [
                [
                  {
                    label: "Descrição",
                    InputComponent: "Input",
                    name: "description",
                  },
                ],
              ],
            }
          : undefined,
        edit: updatePermission
          ? {
              disableEnterKeySubmitForm: true,
              isStickyButtons: true,
              button: { text: "Salvar" },
              initialDataIsTableItem: true,
              schema: { description: yup.string().required("Campo requerido") },
              onSucess: async (formData) => {
                const response = await api({
                  url: "bill-related-types/update",
                  method: "put",
                  body: {
                    id: formData?.id,
                    active: formData?.active,
                    economicGroupId,
                    description: formData?.description,
                  },
                });

                await mutate();

                createToast({
                  status: "success",
                  message: "Registro criado com sucesso",
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
              ],
            }
          : undefined,
        delete: deletePermission
          ? {
              confirmDelete: true,
              onDelete: async (props) => {
                try {
                  await api({
                    url: `bill-related-types/delete/${props.id}`,
                    method: "delete",
                  });

                  await mutate();
                } catch (err) {
                  if (err instanceof BadRequestError) {
                    createToast({
                      status: "warning",
                      message: err.error.message,
                      duration: 10000,
                    });
                  }
                }
              },
            }
          : undefined,
      },
    },
    configs: {
      tableData: data || [],
      errorMessage: "Não há tipo de venda relacionada cadastrada",
      isLoading: isFetching,
      customFilters: [
        {
          InputComponent: "Input",
          name: "description",
          placeholder: "Digite a descrição",
          type: "text",
          onChangeMode: "blur"
        },
        {
          InputComponent: "Select",
          name: "active",
          onlyOneValue: true,
          placeholder: "Seleciona o Status",
          options: [
            { label: "Todos", value: "" },
            { label: "Ativo", value: "true" },
            { label: "Inativo", value: "false" },
          ],
        },
      ],
    },
  });

  return (
    <PermissionItem hash="VRL00" DaniedComponent={AccessDenied}>
      {Table}
    </PermissionItem>
  );
}
