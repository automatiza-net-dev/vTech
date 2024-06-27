import { Tutor } from "./tutor";

export type EditTutor = {
  update: (params: EditTutor.Params) => Promise<EditTutor.Model>;
};

export namespace EditTutor {
  export type Params = {
    id: Tutor["id"],
  };

  export type Model = {}
}
