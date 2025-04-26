import { Patient, Race, Specie } from "../../detail";

export type Event = {
  end: string;
  start: string;
  type?: "working" | "unavailable" | "schedule";
  event: {
    financesExpired?: number;
    attendances?: {
      id: number;
      scheduleService: {
        id: string;
        description: string;
      };
    }[];
    title?: string;
    id: string;
    specie: Specie;
    race: Race;
    week_day: string;
    end_hour: string;
    start_hour: string;
    age: null;
    reschedules: any[];
    contacts: any[];
    statusChanges: any[];
    endHour: string;
    on_duty: boolean;
    opportunity_id: null;
    major_complaint?: string;
    observation: string;
    reason: {
      reason: string;
      id?: string;
    };
    patient: Patient;
    serviceStatus: {
      id: string;
      color: string;
      description:
        | "Atendimento cancelado"
        | "Em atendimento"
        | "Agendado (Não confirmado)"
        | "Na recepção"
        | "Atendimento finalizado"
        | "Agendado (Confirmado)";
    };
    holder: {
      id: string;
      name: string;
      tutor: {
        id: string;
        cellphone: string;
        telephone: string | null;
        patient_id: string;
      };
    };
    serviceType: {
      type: string;
      description: string;
      id: string;
    };

    startHour: string;
    started_at: null;
    user_id: string;
    start: string;
    type: "schedule";
  };
  name?: string;
  late?: number;
  date?: string;
};
