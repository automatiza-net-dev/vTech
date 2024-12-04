import { Error } from "infinity-forge";

import { LoadScheduleIdMock } from "@/domain";
import { DateToDDMMYYYY } from "@/presentation/utils";

import * as S from "./styles";

export function AvailableSchedules({
  data,
  setMockScheduleId,
}: {
  data: LoadScheduleIdMock.Model;
  setMockScheduleId;
}) {
  function handleSubmit(scheduleId) {
    setMockScheduleId(scheduleId);
  }

  return (
    <Error name="AvailableSchedules">
      <S.AvailableSchedules>
        <p className="title">
          Na lista abaixo estão os agendamentos que podem ser{" "}
          <strong>vinculados</strong> ao atendimento que será criado. <br />
          Clique no Agendamento desejado para vincular ao atendimento, <br />
          ou clique em <strong>cancelar</strong> que será criada uma nova agenda
          para vincular ao atendimento;
        </p>

        <table>
          <thead className="font-14-regular">
            <tr>
              <th>Usuário Agenda</th>
              <th>Data Agenda</th>
              <th>Data Finalização Agenda</th>
            </tr>
          </thead>
          <tbody className="font-12-regular">
            {data?.map((item, index) => (
              <tr
                onClick={() => handleSubmit(item.id)}
                className="button"
                key={index}
              >
                <td>{item.name || "-"}</td>
                <td>{DateToDDMMYYYY(item?.start_hour as Date) || "-"}</td>
                <td>{DateToDDMMYYYY(item?.finished_at as Date) || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="cancelButton"
          onClick={() => {
            setMockScheduleId({});
          }}
        >
          Cancelar
        </button>
      </S.AvailableSchedules>
    </Error>
  );
}
