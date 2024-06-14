import { Patient } from "./entities/patient";

export type ChangeWeight = {
  changeWeight: (params: ChangeWeight.Params) => Promise<{}>;
};

export namespace ChangeWeight {
  export type Params = {
    observation: string;
    realizedAt: string;
    tag: Patient["id"];
    technicianId: string;
    weight: string;
  };
}
