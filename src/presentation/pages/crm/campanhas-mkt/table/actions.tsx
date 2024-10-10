import {
  useToast,
  ActionsTable,
  FetcherParams,
  TableActionEdit,
  TableActionCreate,
} from "infinity-forge";

import moment from "moment";

import {
  DateToYYYYMMDD,
  useLoadTutorOrigins,
  useVerifyPermissions,
} from "@/presentation";
import { Marketing } from "@/domain";
import { RemoteMarketing } from "@/data";
import { container, MarketingTypes } from "@/container";

export function useTableMarketingActions({
  mutate,
}: {
  mutate: (params?: FetcherParams) => void;
}) {
  const hasPermissionCreate = useVerifyPermissions("MKT01");
  const hasPermissionUpdate = useVerifyPermissions("MKT02");
  const hasPermissionDelete = useVerifyPermissions("MKT03");

  const { createToast } = useToast();
  const { data, isLoading } = useLoadTutorOrigins();

  async function executeDelete(item) {
    await container
      .get<RemoteMarketing>(MarketingTypes.RemoteMarketing)
      .delete({
        id: item?.id,
      });

    mutate();

    createToast({
      status: "success",
      message: "Excluido com sucesso!",
    });
  }

  const action = {
    title: "Campanha de Marketing",
    text: "Nova Campanha",
    debugMode: true,
    initialDataIsTableItem: true,
    button: { text: "Salvar" },
    isStickyButtons: true,
    onSucess: async (data) => {
      await container
        .get<RemoteMarketing>(MarketingTypes.RemoteMarketing)
        [data.id ? "update" : "create"]({
          ...data,
          startDate: DateToYYYYMMDD(data?.startDate),
          endDate: DateToYYYYMMDD(data?.endDate),
          investmentValue: data?.investmentValue || 0,
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
          label: "Nome da Campanha",
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
          name: "startDate",
          InputComponent: "InputDatePicker",
          label: "Data Início Campanha",
          mode: "date",
          date: {},
          language: "pt",
        },
        {
          name: "endDate",
          label: "Data Fim Campanha",
          InputComponent: "InputDatePicker",
          mode: "date",
          date: {},
          language: "pt",
        },
        {
          name: "investmentValue",
          label: "Valor Investido Campanha",
          InputComponent: "InputCurrency",
        },
      ],
      [
        {
          options:
            data?.map((option) => ({
              label: option?.description,
              value: option?.id,
            })) || [],
          isMultiple: true,
          loading: isLoading,
          name: "clientOriginIdList",
          InputComponent: "Select",
          label: "Origens de Clientes vinculados à campanha",
        },
      ],
    ],
  } as TableActionCreate<Marketing> & TableActionEdit<Marketing>;

  return {
    create: hasPermissionCreate && action,
    edit: hasPermissionUpdate && action,
    delete: hasPermissionDelete && executeDelete,
    modalStyles: { maxWidth: 1024 },
    confirmDelete: true,
  } as ActionsTable<Marketing>;
}
