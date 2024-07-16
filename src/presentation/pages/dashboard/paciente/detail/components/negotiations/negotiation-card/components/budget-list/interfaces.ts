import { Budget } from "@/domain";

export type FormBudgetItem = {
  motivo: string;
  observacao: string;
  checked: boolean;
  status: "ABERTO" | "CONFIRMADO";
} & Budget;

export type FormData = {
  budgets: FormBudgetItem[];
};
