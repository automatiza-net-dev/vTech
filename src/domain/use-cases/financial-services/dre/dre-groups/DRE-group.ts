import { SystemUser } from "@/domain/use-cases/user";

export type DreGroup = {
  id?: string;
  description?: string;
  sequence?: number;
  active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  createUser?: SystemUser["name"] | null;
  updateUser?: SystemUser["name"] | null;
};
