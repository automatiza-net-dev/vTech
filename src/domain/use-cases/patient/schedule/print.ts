export type PrintSchedule = {
  print: (params: PrintSchedule.Params) => Promise<PrintSchedule.Model>;
};

export namespace PrintSchedule {
  export type Params = {
    economicGroups: string;
    businessUnits: string[];
    fromDate: string;
    toDate: string;
  };

  export type Model = {};
}
