import { Departament } from "@/domain";

export type LoadDepartaments = {
  load: () => Promise<LoadDepartaments.Model>;
};

export namespace LoadDepartaments {
  export type Model = Departament[];
}
