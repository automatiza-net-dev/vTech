import { Tutor } from "./tutor";

export type LoadTutor = {
  load: (params: LoadTutor.Params) => Promise<LoadTutor.Model>;
};

export namespace LoadTutor {
  export type Params = {
    id: Tutor["id"]
  };

  export type Model = Tutor
}
