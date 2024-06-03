export type ReplaceTextTemplate = {
  replace: (
    params: ReplaceTextTemplate.Params
  ) => Promise<ReplaceTextTemplate.Model>;
};

export namespace ReplaceTextTemplate {
  export type Params = {
    base?: string;
    businessUnitId?: string;
    dependentId?: string;
    documentId?: string;
    tag?: string;
    tutorId?: string;
    userId?: string;
  };

  export type Model = {
    result: string;
  }
}
