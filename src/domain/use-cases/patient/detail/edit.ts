export type EditPatient = {
  edit: (params: EditPatient.Params) => Promise<EditPatient.Model>;
};

export namespace EditPatient {
  export type Params = {
    id: string;
  };

  export type Model = {};
}
