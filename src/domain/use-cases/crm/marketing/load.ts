export type UpdateMarketing = {
  update: (params: UpdateMarketing.Params) => void;
};

export namespace UpdateMarketing {
  export type Params = {
    id: number;
    clientOriginIdList: string[];
    description: string;
    startDate: Date;
    endDate: Date;
    investmentValue: number;
    active: boolean;
  };

  export type Model = {};
}
