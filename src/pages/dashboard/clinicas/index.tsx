import {
  api,
  useTable,
  useToast,
  PageWrapper,
  removeDigits,
  TableActionCreate,
  TableActionEdit,
} from "infinity-forge";

import { RemoteBusinessUnits } from "@/data";
import { container, TypesAutomatiza } from "@/container";
import { LayoutDashboard, useMe, usePermission } from "@/presentation";
import { BusinessUnit } from "@/domain";
import { useQuery } from "infinity-forge";

function Page() {
  const canEditClinic = usePermission("CLI02");
  const canCreateClinic = usePermission("CLI01");
  const canDeleteClinic = usePermission("CLI03");

  const user = useMe();
  const { createToast } = useToast();

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["load_users"],
    queryFn: async () => {
      const response = await container.get<RemoteBusinessUnits>(TypesAutomatiza.RemoteBusinessUnits).loadAll( )

      return response;
    },
  });

  const dynamicFormHandler = {
    isStickyButtons: true,
    button: { text: "Salvar" },
    initialDataIsTableItem: true,
    modifyInitialData: (initialData) => {
      return {
        ...initialData,
        address: {
          bairro: initialData?.district,
          logradouro: initialData?.address,
          numero: initialData?.number,
          complemento: initialData?.complement,
          uf: initialData?.state,
          localidade: initialData?.city,
          ibge: initialData?.city_code,
          // máscara do InputCep aceita só os 8 dígitos
          postalCode: initialData?.postal_code?.replace(/\D/g, ""),
        },
        companyName: initialData?.company_name,
        fantasyName: initialData?.fantasy_name
      }
    },
    initialData: { economic_group_id: user?.data?.unit?.economicGroup?.id },
    onSucess: async (data) => {

      await api({
        url: data.id ? `business-units/${data.id}` : `business-units`,
        method: data.id ? "put" : "post",
        body: {
          ...data,
          // criar espera postalCode e editar espera postal_code (antes o CEP nunca era gravado na edição)
          postalCode: data?.address?.postalCode,
          postal_code: data?.address?.postalCode,
          cityCode: data?.address?.ibge,
          phone: removeDigits(data.phone),
          document: removeDigits(data.document),
          address: data.address?.logradouro,
          number: data.address?.numero,
          complement: data.address?.complemento,
          state: data.address?.uf,
          district: data.address?.bairro,
          city: data.address?.localidade,
          simple: !!data.simple,
        },
      });

      await refetch()

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
          InputComponent: "Input",
          name: "state_registration",
          label: "Inscrição estadual",
        },
        {
          InputComponent: "Input",
          name: "city_registration",
          label: "Inscrição municipal",
        },
        {
          InputComponent: "Input",
          name: "cnae",
          label: "CNAE",
        },
      ],
      [
        {
          name: "InputCep",
          InputComponent: "InputCep",
          nameZipCode: "postalCode",
          // mostra o endereço sempre (antes só aparecia após digitar um CEP)
          // e deixa cidade/UF editáveis caso o CEP não seja encontrado
          showAllFields: true,
          fields: [
            { logradouro: { label: "Rua" }, bairro: { label: "Bairro" } },
            { localidade: { label: "Cidade" }, uf: { label: "Estado" } },
            { complemento: { label: "Complemento" }, numero: { label: "Número" } },
          ],
        },
      ],
    ],
  } as TableActionCreate<BusinessUnit> & TableActionEdit<BusinessUnit>;

  const { Table } = useTable({
    columnsConfiguration: {
      columns: [
        { id: "identification", label: "Identificação" },
        { id: "document", label: "CNPJ" },
        { id: "company_name", label: "Razão social" },
        { id: "fantasy_name", label: "Nome Fantasia" },
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
        delete: {
          onDelete: canDeleteClinic ? () => {} : undefined
        },
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
