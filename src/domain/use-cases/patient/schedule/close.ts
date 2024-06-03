export type CloseSchedule = {
  close: (params: CloseSchedule.Params) => Promise<CloseSchedule.Model>;
};

export namespace CloseSchedule {
  export type Params = {
    idAtendimento: number;
  };

  export type Model = {};
}
