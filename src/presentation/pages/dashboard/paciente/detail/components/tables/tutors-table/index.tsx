import { Icon, useTable } from "infinity-forge";

import { Patient, Tutor } from "@/domain";
import { FormCreateTutor, useLoadSchedulesPatients } from "@/presentation";

import { columns } from "./columns";
import { DeleteTutor, ActiveTutor } from "./actions";

import * as S from "./styles";

export function TutorsTable(props: Patient) {
  const { data } = useLoadSchedulesPatients({
    patientFilters: { tag: props.tag },
  });

  const { Table } = useTable<Tutor>({
    columnsConfiguration: {
      columns,
      actions: {
        custom: [
          ActiveTutor,
          (props) => {
            return (
              <FormCreateTutor
                trigger={
                  <div
                    style={{
                      height: "30px",
                      width: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      borderRadius: "5px",
                      border: 0,
                      marginRight: "10px",
                      backgroundColor: "#E1E1E1"
                    }}
                  >
                    <Icon name="IconEdit" fill="#828282" />
                  </div>
                }
                isModal
                origin="Cadastro"
                tutorId={props.id}
              />
            );
          },
          DeleteTutor,
        ],
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
