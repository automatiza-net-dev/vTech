export type Specie = {
  id: string;
  description: string;
};

export type Race = {
  id: string;
  description: string;
  specie: Specie;
  fur: null;
  createdAt: string;
};
