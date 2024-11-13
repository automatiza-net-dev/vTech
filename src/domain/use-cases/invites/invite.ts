import { BusinessUnit } from "../business-units";
import { User } from "../user";

export type Invite = {
  id: string;
  roleId: number;
  email: string;
  active: true;
  businessUnit: {
    id: BusinessUnit["id"];
    identification: BusinessUnit["identification"];
  };
  user: {
    id: User["id"];
    email: User["emailAddress"];
  };
  invitedBy: {
    id: string;
    name: string;
  };
};
