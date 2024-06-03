export type SetMainTutor = {
  setMain: (params: SetMainTutor.Params) => Promise<{}>;
};

export namespace SetMainTutor {
  export type Params = {
    patient: string;
    holder: string;
  };
}
