import { User } from "../../user";

export type DailyMovement = {
  id: string;
  opening_date: string;
  closing_date: null;
  checking_date: null;
  sales_total: null;
  expenses_total: null;
  receipts_total: null;
  observations: null;
  status: "Aberto" | "Fechado";
  created_at: string;
  updated_at: string;
  userWhoOpened: User["user"]
  userWhoClosed: null;
  userWhoChecked: null;
  logs: [];
};
