import { Vaccine } from './vaccine';

export type CreateVaccine = {
  createVaccine: (params: CreateVaccine.Params) => Promise<void>;
};

export namespace CreateVaccine {
  export type Params = {
    name: string;
    description: string;
    subgroupId?: string;
    type: string;
  };

  export type Model = Vaccine;
}
