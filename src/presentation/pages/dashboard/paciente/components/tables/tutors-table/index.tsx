import { useTable } from "infinity-forge";

import { Patient, Tutor } from "@/domain";
import { useLoadSchedulesPatients } from "@/presentation";

import { columns } from "./columns";
import { EditTutor, DeleteTutor, ActiveTutor } from "./actions";

import * as S from "./styles"

export function TutorsTable(props: Patient) {
  const { data } = useLoadSchedulesPatients({
    patientFilters: { tag: props.tag },
  });

  const { Table } = useTable<Tutor>({
    columnsConfiguration: {
      columns,
      actions: {
        custom: [ActiveTutor, EditTutor, DeleteTutor],
      },
    },
    configs: {
      disablePagination: true,
      disableOrdenationTable: true,
      disableGetFilter: true,
      pagination: {
        endPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        page: 1,
        pages: [1],
        pageSize: 1,
        startPage: 1,
        totalItems: 3,
        totalPages: 1,
      },
      errorMessage: "Não há itens no momento",
      tableData: data && data.length > 0 ? data[0].tutors : [],
    },
  });

  return <S.TutorsTable>{Table}</S.TutorsTable>;
}
