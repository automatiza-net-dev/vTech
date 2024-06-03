export type UpdateDepartaments = {
  update: (
    params: UpdateDepartaments.Params
  ) => Promise<UpdateDepartaments.Model>;
};
export namespace UpdateDepartaments {
  export type Params = { roleId: number; profileAccessIdList: number[] };

  export type Model = {};
}
