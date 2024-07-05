export type Meta = {
  id: number;
  description: string;
  unitMetaId: null;
  value: number;
  type: "R$" | "Qtd" | "%"
};

export type Goal = {
  id: string;
  identification: string;
  period: string;
  metas: Meta[];
  unitMetaId: number;
};
