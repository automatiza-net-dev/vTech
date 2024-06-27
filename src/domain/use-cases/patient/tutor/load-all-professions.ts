export type LoadAllProfessions = {
  loadAllProfessions: () => Promise<LoadAllProfessions.Model>;
};

export type Profession = {
  id: number;
  description: string;
  created_at: string;
  updated_at: string | null;
};

export namespace LoadAllProfessions {
  export type Model = Profession[];
}
