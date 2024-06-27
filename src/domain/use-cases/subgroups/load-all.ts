export type Subgroup = {
  id?: string;
  economic_group_id?: string | null;
  parent_id?: string | null;
  description: string;
  tree?: string | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  variation_group_id: string | null;
  parent?: string | null;
};

export type LoadSubgroups = {
  loadAll: (
    params: LoadSubgroups.Params
  ) => Promise<LoadSubgroups.Model>;
};

export namespace LoadSubgroups {
  export type Params = {
    description?: string;
    active?: boolean;
  };

  export type Model = Subgroup[];
}
