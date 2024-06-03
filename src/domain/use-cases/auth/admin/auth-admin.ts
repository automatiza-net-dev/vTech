import { SystemUser } from "../../user";

export type AuthAdmin = {
  auth: (params: AuthAdmin.Params) => Promise<AuthAdmin.Model>;
};

export type AdminUser = {
  token: {
    type: "bearer";
    token: string;
  };
  isThirdParty?: boolean,
  userID: string;
  units: [];
  userType: "controller";
  systemConfig: {
    id: number;
    url: string;
    active: boolean;
    system: {
      id: number;
      name: string;
    };
  }
};

export namespace AuthAdmin {
  export type Params = {
    email: string;
    system: string;
    password: string;
  };

  export type Model = AdminUser;
}
