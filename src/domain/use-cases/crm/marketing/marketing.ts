export type Marketing = {
  id: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  investmentValue?: number;
  active?: boolean;
  clientOriginIdList?: string[];
  clientOrigins: {
    clientOriginId: string;
    id: string;
  }[];
};
