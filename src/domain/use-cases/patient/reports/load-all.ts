import { Tutor, Patient, Race, Specie } from "@/domain";

export type LoadAllPatientReports = {
  loadAllPatientReports: (
    params: LoadAllPatientReports.Params
  ) => Promise<LoadAllPatientReports.Model>;
};

export type PatientReport = {
  tutorNome: Tutor["name"];
  tutorCelular: Tutor["cellphone"];
  tutorTelefone?: string;
  tutorEmail: Tutor["email"];
  tutorGenero: Tutor["gender"];
  tutorProfissao: Tutor["profession"];
  tutorDtNasc: Tutor["birth_date"];
  tutorDtCadastro: string;
  petRg: Patient["tag"];
  petNome: Patient["name"];
  petGenero: Patient["gender"];
  petDataNascimento: Patient["birth_date"];
  petVacinado: Patient["vaccineOrigin"];
  petObito: Patient["death"];
  petCastrado: Patient["castrated"];
  petEspecieraca: string;
  petPeso: Patient["weight"];
  petObservacao: string;
  petDtCadastro: string;
  petTemProtocoloVacina: boolean;
  petComunidadeSancla: boolean;
  petDataPrimeiraVenda: string;
  petDataUltimaVenda: string | null;
};

export namespace LoadAllPatientReports {
  export type Params = {
    races?: Race["id"][];
    species?: Specie["id"][];
    gender?: "Macho" | "Femea";
    castrated?: "Sim" | "Nao";
    death?: "Sim" | "Nao";
    microchip?: "Sim" | "Nao";
    vaccineOrigin?: "Nao Vacinado" | "Vacinado";
  };

  export type Model = PatientReport[];
}
