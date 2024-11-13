import { Invite } from "./invite";

export type LoadInvite = {
  load: (params: LoadInvite.Params) => Promise<LoadInvite.Model>;
};

export namespace LoadInvite {
  export type Params = {
    id: string;
  };

  export type Model = Invite;
}
