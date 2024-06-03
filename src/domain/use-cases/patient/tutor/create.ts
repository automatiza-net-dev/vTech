export type CreateTutor = {
  create: (params: CreateTutor.Params) => Promise<CreateTutor.Model>;
};

export namespace CreateTutor {
  export type Params = {
    name: string;
    cellphone: string;
    clientOriginId: string;
    tutorOriginId: string;
  };

  export type Model = {
    id: string;
    name: string;
    type: string;
    tag: string;
    created_at: string;
    updated_at: string;
  };
}
