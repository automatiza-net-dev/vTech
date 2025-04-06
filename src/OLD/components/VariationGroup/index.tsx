import { AccessDenied, PermissionItem, usePermission, useSystem } from "@/presentation";
import { useQuery, PageWrapper, api, useTable, useToast } from "infinity-forge";
import moment from "moment";

export default function Subgroups() {
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

type VariationGroup = {
  active: boolean;
  created_at: string;
  description: string;
  economic_group_id: string;
  id: string;
  updated_at: string;
  variations: any[];
};

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
      })),
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
        delete: !canDeleteGroupVariations ? undefined : {
          confirmDelete: true,
          onDelete: async (item) => {
            await api({ url: `variation-groups/${item.id}`, method: "delete" });

            await mutate();

            createToast({
              message: "Registro deletado com sucesso",
              status: "success",
            });
          },
        },
        edit: !canEditGroupVariations ? undefined : {
        
          initialDataIsTableItem: true,
          button: {
            text: "Salvar",
          },
          onSucess: async (formData, _, initialValue) => {
            for (const v of formData.variations || []) {
              await api({
                url: "variation-groups/assign",
                method: "post",
                body: {
                  group_variation_id: formData.id,
                  variation_id: v,
                },
              });
            }

            for(const v of (initialValue?.variations || [])) {
              if(!formData?.variations?.includes(v)) {
                await api({
                  url: `variation-groups/${formData?.id}/${v}`,
                  method: "delete",
                });
              }
            }

            await api({
              url: `variation-groups/${formData.id}`,
              method: "put",
              body: {
                active: formData?.active,
                description: formData?.description,
              },
            });

            await mutate()

            createToast({ status: "success", message: "Registro atualizado com sucesso" })
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
        create: !canCreateGroupVariations ? undefined : {
          onSucess: async (data) => {
            await api({ url: "variation-groups", method: "post", body: data });

            await mutate();

            createToast({ message: "Criado com sucesso", status: "success" });
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
          ],
          button: { text: "Criar" },
        },
      },
    },
  });

  return Table;
}

// function Test() {
//   return (
//         <Table
//           className="uk-margin-top"
//           dataSource={data?.map((item) => ({
//             description: item?.description,
//             nVariations: item?.variations.length,
//             createdAt: moment(item?.created_at).format("DD/MM/YYYY - HH:mm"),
//             status: item?.active ? "Ativo" : "Inativo",
//             options: (
//               <div className="uk-flex uk-flex-around">
//                 <ExpandOutlined
//                   size={15}
//                   onClick={() => {
//                     setSelectedId(item.id);
//                   }}
//                 />
//               </div>
//             ),
//             actions: (
//               <div className="uk-flex uk-flex-around">
//                 {canEditGroupVariations && (
//                   <EditTwoTone
//                     size={15}
//                     onClick={() => {
//                       setSelectedGroup(item);
//                     }}
//                   />
//                 )}
//                 {canDeleteGroupVariations && (
//                   <DeleteVariationGroup
//                     id={item?.id}
//                     close={() => setSelectedGroup(null)}
//                   />
//                 )}
//               </div>
//             ),
//           }))}
//           columns={columns}
//         />
//         <UpdateGroupVariations
//           visible={!!selectedId}
//           id={selectedId}
//           hide={() => {
//             refetch();
//             setSelectedId(null);
//           }}
//         />
//         <CreateVariationGroup
//           visible={visible}
//           hide={() => {
//             setVisible(false);
//           }}
//         />
//         <EditVariationGroup
//           visible={!!selectedGroup}
//           hide={() => setSelectedGroup(null)}
//           groupInfo={selectedGroup}
//         />
//   );
// }
