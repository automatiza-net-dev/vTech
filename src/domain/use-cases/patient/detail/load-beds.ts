import { Patient } from "./patient";

export type LoadBeds = {
  loadBeds: (params: LoadBeds.Params) => Promise<LoadBeds.Model>;
};

export type Bed = {
  active: boolean;
  id: string;
  name: string;
  occupied: boolean;
  tag: string;
  type: "HOSPITALIZATION";
};

export namespace LoadBeds {
  export type Params = {
    active: boolean;
  };

  export type Model = Bed[];
}
