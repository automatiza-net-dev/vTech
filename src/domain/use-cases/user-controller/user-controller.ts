import { BusinessUnit } from "@/domain";

export type UserController = {
  id?: string;
  name: string;
  email: string;
  document: string;
  password?: string;
  roleId?: number;
  units: BusinessUnit[];
};