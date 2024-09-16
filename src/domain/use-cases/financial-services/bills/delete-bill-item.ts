export type DeleteBillItem = {
  deleteBillItem: (
    params: DeleteBillItem.Params
  ) => Promise<DeleteBillItem.Model>;
};

export namespace DeleteBillItem {
  export type Params = {
    id: string;
  };
  export type Model = {};
}
