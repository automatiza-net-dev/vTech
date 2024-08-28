import { Icon, Tooltip, useTable } from "infinity-forge";
import { useQueryClient } from "react-query";
import { Patient, Tutor } from "@/domain";
import { Unlink } from "@/OLD/components/Tutor/unlink";
import {
  FormCreateTutor,
  useLoadSchedulesPatients,
  useVerifyPermissions,
} from "@/presentation";
import { columns } from "./columns";
import { ActiveTutor } from "./actions";
import * as S from "./styles";

export function TutorsTable(props: Patient) {
  const { data } = useLoadSchedulesPatients({
    patientFilters: { tag: props.tag },
  });
  const queryClient = useQueryClient();

  const hasPermission = useVerifyPermissions("PET04");

  const customActions = [
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
                backgroundColor: "#E1E1E1",
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
  ];

  if (hasPermission) {
    customActions.push((p) => (
      <Tooltip
        enableHover
        idTooltip="unlink"
        content="Desvincular Tutor/Pet"
        trigger={
          <Unlink
            patientId={props.id}
            tutorId={p.id}
            customSubmit={async () =>
              await queryClient.invalidateQueries({
                queryKey: ["RemoteLoadSchedulesPatients"],
              })
            }
          />
        }
      />
    ));
  }

  const { Table } = useTable<Tutor>({
    columnsConfiguration: {
      columns,
      actions: {
        custom: customActions,
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
