import { Vaccine } from "@/domain";

export type EditVaccine = {
  editVaccine: (params: EditVaccine.Params) => Promise<EditVaccine.Model>;
};

export namespace EditVaccine {
  export type Params = {
    id?: string;
    subgroupId?: string;
    name?: string;
    description?: string;
    type?: "vaccine" | "vermifuge";
    active?: boolean;
  };

  export type Model = Vaccine;
}
