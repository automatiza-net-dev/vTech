export type SetPhone = {
  setPhone: (params: SetPhone.Params) => Promise<SetPhone.Model>;
};

export namespace SetPhone {
  export type Params = {
    phone: string;
  };

  export type Model = {
    id: string;
    name: string;
    email: string | null;
    cellphone: string;
    clientOrigin: ClientOrigin;
    dependents: Dependent[];
  };

  export type ClientOrigin = {
    id: string;
    description: string;
    type: string;
    active: boolean;
    created_at: string | null;
    updated_at: string | null;
    group: string | null;
    default: boolean;
  };

  export type Dependent = {
    id: string;
    name: string;
    gender: string;
    race: Race;
  };

  export type Race = {
    id: string;
    description: string;
    specie_id: string;
    created_at: string;
    updated_at: string;
    fur: string | null;
    specie: Specie;
  };

  export type Specie = {
    id: string;
    description: string;
    economic_group_id: string | null;
    created_at: string;
    updated_at: string;
  };
}
