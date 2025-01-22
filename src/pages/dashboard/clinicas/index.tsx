import {
  api,
  useQuery,
  useTable,
  useToast,
  PageWrapper,
  removeDigits,
  TableActionCreate,
  TableActionEdit,
} from "infinity-forge";

import { LayoutDashboard, useMe, usePermission } from "@/presentation";

function Page() {
  const canEditClinic = usePermission("CLI02");
  const canCreateClinic = usePermission("CLI01");
  const canDeleteClinic = usePermission("CLI03");

  const user = useMe();
  const { createToast } = useToast();

  const { data, isFetching } = useQuery({
    queryKey: ["load_users"],
    queryFn: async () => {
      const response = await api({
        url: "business-units/user",
        method: "get",
      });

      return response;
    },
  });

  const dynamicFormHandler = {
    isStickyButtons: true,
    button: { text: "Salvar" },
    initialDataIsTableItem: true,
    initialData: { economic_group_id: user?.data?.unit?.economicGroup?.id },
    onSucess: async (data) => {
      console.log(data);

      await api({
        url: data.id ? `business-units/${data.id}` : `business-units`,
        method: data.id ? "put" : "post",
        body: {
          ...data,
          phone: removeDigits(data.phone),
          document: removeDigits(data.document),
          address: data.address?.logradouro,
          number: data.address?.numero,
          complement: data.address?.complemento,
          state: data.address?.estado,
          district: data.address?.localidade,
          simple: !!data.simple,
        },
      });

      createToast({
        status: "success",
        message: "Clinica editada com sucesso",
      });
    },
    inputs: [
      [
        {
          InputComponent: "Input",
          name: "identification",
          label: "Identificação",
        },
        {
          InputComponent: "Input",
          name: "email",
          type: "email",
          label: "Email",
        },
        {
          InputComponent: "InputMask",
          name: "phone",
          label: "Telefone",
          mask: "(__) _ ____-____",
        },
      ],
      [
        {
          InputComponent: "Input",
          name: "fantasyName",
          label: "Nome fantasia",
        },
        {
          InputComponent: "Input",
          name: "companyName",
          label: "Razão social",
        },
        {
          InputComponent: "InputMask",
          name: "document",
          label: "CNPJ",
          mask: "__.___.___/____-__",
        },
        {
          InputComponent: "InputSwitch",
          name: "simple",
          label: "Simples",
        },
      ],
      [
        {
          name: "InputCep",
          InputComponent: "InputCep",
          nameZipCode: "postalCode",
        },
      ],
    ],
  } as TableActionCreate<any> & TableActionEdit<any>;

  const { Table } = useTable({
    columnsConfiguration: {
      columns: [
        { id: "identification", label: "Identificação" },
        { id: "document", label: "CNPJ" },
        { id: "companyName", label: "Razão social" },
        { id: "fantasyName", label: "Nome Fantasia" },
        { id: "phone", label: "Telefone" },
      ],
      actions: {
        create: canCreateClinic
          ? {
              text: "Criar nova clinica",
              ...dynamicFormHandler,
            }
          : undefined,
        edit: canEditClinic ? dynamicFormHandler : undefined,
        delete: canDeleteClinic ? () => {} : undefined,
        modalStyles: {
          maxWidth: "900px",
          width: "100%",
        },
      },
    },
    configs: {
      disableRoutingUpdateFilters: true,
      errorMessage: "Não há nenhuma clínica cadastrada",
      tableData: data || [],
      isLoading: isFetching,
    },
  });

  return <PageWrapper title="Clinicas">{Table}</PageWrapper>;
}

export default function ClinicasPage() {
  return (
    <LayoutDashboard>
      <Page />
    </LayoutDashboard>
  );
}
