import {
  Patient,
  BusinessUnit,
  Vaccine,
  Tutor,
  VaccineProtocol,
  VaccineCalendar,
  ScheduleVaccine,
} from "@/domain";

export type VaccinesStatus = {
  units: {
    id: BusinessUnit["id"];
    identification: BusinessUnit["identification"];
    pacientes: {
      idPaciente: Patient["id"];
      nomePaciente: Patient["name"];
      idTutor: "63b41232-cbab-4881-89be-6c467d7712c6";
      nomeTutor: Tutor["name"];
      contatoTutor: Tutor["cellphone"];
      tipoContatoTutor: string;
      vacinasPaciente: {
        idVacinaPaciente: string;
        vacina: {
          tipo: "Vacina" | "Vermifugo";
          idVacina: Vaccine["id"];
          nomeVacina: Vaccine["description"];
          idProtocolo: VaccineProtocol["id"];
          nomeProtocolo: VaccineProtocol["name"];
          qtdDosesProtocolo: VaccineProtocol["doses"];
          intervaloDiasDosesProtocolo: VaccineProtocol["interval"];
          protocoloValidoPor: VaccineProtocol["expirationDays"];
          vaccineCalendar: {
            idVaccineCalendar: VaccineCalendar["id"];
            scheduleId: ScheduleVaccine["id"];
            dataAgendamento: string;
            dataAplicacao: VaccineCalendar["application_date"];
            doseAplicacao: VaccineCalendar["dose"];
            laboratorioAplicacao: VaccineCalendar["laboratory"];
            loteAplicacao: VaccineCalendar["batch"];
            statusAgendamentoVacina: Vaccine["status"];
            statusProtocolo: "Protocolo Incompleto" | "Protocolo Completo";
            validadeVacina: VaccineProtocol["expirationDays"];
          };
        }[];
      }[];
    }[];
  }[];
};

export type LoadAllVaccineStatus = {
  loadAllVaccinesStatus: (
    params: LoadAllVaccinesStatus.Params
  ) => Promise<LoadAllVaccinesStatus.Model>;
};

export namespace LoadAllVaccinesStatus {
  export type Params = {
    id: Patient["id"];
  };

  export type Model = VaccinesStatus;
}
