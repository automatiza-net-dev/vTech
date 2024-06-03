export type SubgroupsDetails = {
  id: string;
  identification: string;
  description: string;
  subgroup: string;
  qtySales: number;
  qtyClients: number;
  totalSales: number;
  percentage: string;
};

export type LoadSubgroupDetails = {
  loadDetails: (
    params: LoadSubgroupDetails.Params
  ) => Promise<LoadSubgroupDetails.Model>;
};

export namespace LoadSubgroupDetails {
  export type Params = {
    fromDate?: string;
    toDate?: string;
    units?: string[];
    type?: "service" | "product";
    subgroup?: string;
  };

  export type Model = SubgroupsDetails[];
}
