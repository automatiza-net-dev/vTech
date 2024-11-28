import { Patient, BusinessUnit, Event } from "@/domain";

export type LoadAllSchedullingToMovement = {
  loadSchedullingToMovement: (
    params: LoadAllSchedullingToMovement.Params
  ) => Promise<any>;
};

// Verificar erro ao tipar

export namespace LoadAllSchedullingToMovement {
  export type Params = {
    patientId: Patient["id"];
    businessUnitId: BusinessUnit["id"];
    type: "bill" | "budget";
  };

  export type Model = {
    id: Event["event"]["id"];
    start_hour: Event["event"]["start_hour"];
    description: Event["event"]["serviceType"]["description"];
    tipo: "agendas_passadas" | "agendas_futuras";
  }[];
}
