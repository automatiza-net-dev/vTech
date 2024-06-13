export type FinancesResume = {
  name?: string;
  hasData?: boolean;
  title?: string;
  total?: string;
  data?: {
    description?: string;
    value?: string;
  }[];
};
