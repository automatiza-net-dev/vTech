import { Tutor } from "./tutor"

export type AssignTutor = {
  assign: (params: AssignTutor.Params) => Promise<AssignTutor.Model>;
};

export namespace AssignTutor {
  export type Params = {
    holder: string;
    patient: string;
  };

  export type Model = Tutor[];
}
