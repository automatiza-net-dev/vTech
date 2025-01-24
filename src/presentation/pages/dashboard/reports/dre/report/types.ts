
export type Agrupamento = {
  id: number;
  tag: string;
  basear: boolean;
  hasRefCusto: boolean;
  type: "CREDITO" | "DEBITO" | "AMBOS";
  description: string;
  custo: number;
  refCusto: string;
  itens: Agrupamento[];
  refs?: number[];
  total: number
};

export type DreItem = {
  id: string;
  identification: string;
  periodo: string;
  itens: Agrupamento[];
};
