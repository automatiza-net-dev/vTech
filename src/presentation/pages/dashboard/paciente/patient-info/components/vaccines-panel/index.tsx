import { Patient } from "@/domain";
import { useLoadAllVaccinesStatus } from "@/presentation";

import * as S from "./styles";

import moment from "moment";

export function VaccinesPanel({ patientId }: { patientId: Patient["id"] }) {
  const vaccinesStatus = useLoadAllVaccinesStatus({ id: patientId });

  return (
    <S.VaccinesPanel>
      {vaccinesStatus?.data &&
        vaccinesStatus?.data?.units?.map((vaccineData) => {
          const businessUnitIdentification = vaccineData?.identification;
          return vaccineData?.pacientes?.map((patientData) => {
            const tutor = patientData?.nomeTutor;
            return patientData?.vacinasPaciente?.map((vaccine) => (
              <section key={vaccine?.id}>
                <hr />
                <div className="main-header">
                  <span>Unidade</span>
                  <span>Tipo</span>
                  <span>Tutor</span>
                  <span>Vacina/Vermifugo</span>
                  <span>Protocolo</span>
                  <span>Qtd Doses</span>
                  <span>Validade Protocolo</span>
                  <span>Status Vacina</span>
                  <span>Validade Vacina</span>
                </div>
                <div key={vaccine?.id} className="main-content">
                  <span>{businessUnitIdentification}</span>
                  <span>{vaccine?.vacina?.tipo}</span>
                  <span>{tutor}</span>
                  <span>{vaccine?.vacina?.nomeVacina}</span>
                  <span>{vaccine?.vacina?.nomeProtocolo}</span>
                  <span>{vaccine?.vacina?.qtdDosesProtocolo}</span>
                  <span>{vaccine?.vacina?.protocoloValidoPor}</span>
                  <span>{vaccine?.vacina?.statusVacina}</span>
                  <span>
                    {vaccine?.vacina?.dataValido
                      ? moment(vaccine?.vacina?.dataValido).format(
                          "DD/MM/YYYY - hh:mm"
                        )
                      : "--"}
                  </span>
                </div>
                <div>
                  <div className="secondary-header">
                    <span>Data agendamento</span>
                    <span>Data Aplicação</span>
                    <span>Dose</span>
                    <span>Laboratório</span>
                    <span>Lote</span>
                    <span>Status agendamento</span>
                  </div>
                  {vaccine?.vacina?.vaccineCalendar?.map((vaccineSchedule) => (
                    <div
                      key={vaccineSchedule?.id}
                      className="secondary-content"
                    >
                      <span>
                        {vaccineSchedule?.dataAgendamento
                          ? moment(vaccineSchedule?.dataAgendamento).format(
                              "DD/MM/YYYY - hh:mm"
                            )
                          : "--"}
                      </span>
                      <span>
                        {vaccineSchedule?.dataAplicacao
                          ? moment(vaccineSchedule?.dataAplicacao).format(
                              "DD/MM/YYYY - hh:mm"
                            )
                          : "--"}
                      </span>
                      <span>{vaccineSchedule?.doseAplicacao}</span>
                      <span>
                        {vaccineSchedule?.laboratorioAplicacao || "--"}
                      </span>
                      <span>{vaccineSchedule?.loteAplicacao || "--"}</span>
                      <span>{vaccineSchedule?.statusAgendamentoVacina}</span>
                    </div>
                  ))}
                </div>
              </section>
            ));
          });
        })}
    </S.VaccinesPanel>
  );
}
