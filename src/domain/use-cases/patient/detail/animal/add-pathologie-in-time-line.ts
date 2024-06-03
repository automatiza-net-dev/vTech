export type AddPathologieInTimeLine = {
  addPathologieInTimeLine: (params: AddPathologieInTimeLine.Params) => Promise<{}>;
};

export namespace AddPathologieInTimeLine {
  export type Params = {
    tag: string;
    pathology: string;
    realizedAt: string;
    description: string;
    technicianId: string;
    defaultProtocol: string;
  };
}
