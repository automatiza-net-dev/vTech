import { useTable } from "infinity-forge";
import { ButtonSetSchedulling } from "./table-configurations/button-set-scheduling";

export function TableClients({ data, isLoading }) {
  const { Table } = useTable<any>({
    columnsConfiguration: {
      columns: [
        { id: "name", label: "Nome", width: 100 },
        { id: "email", label: "Email", width: 100 },
        {
          id: "tag",
          label: "Tag",
          width: 100,
        },
        {
          id: "cellphone",
          label: "Celular",
          width: 100,
        },
        {
          id: "agendamento",
          label: "",
          width: 100,
          Component: {
            Element: ButtonSetSchedulling,
            props: { agendamento: "agendamento" },
          },
        },
      ],
    },
    configs: {
      tableData: data || [],
      isLoading: isLoading,
      errorMessage: "Nenhum cliente encontrado",
      disableOrdenationTable: true,
      disablePagination: true,
    },
  });

  return Table;
}
