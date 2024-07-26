export type Indicator = {
  name: string;
  description: string;
  type: string;
  hasData: boolean;
  data: {
    id: string;
    identification: string;
    totalConfirmados: number;
    totalOrcamentos: number;
    users: {
      userId: string;
      userName: string;
      qtdClientes: string;
      valorRealizado: number;
      tikcetMedioRealizado: number | null;
      participacaoRealizado: number;
      conversaoAvaliacoes: number;
      totalAvaliado: number;
      tikcetMedioAvaliacoes: number | null;
    }[];
  }[];
};
