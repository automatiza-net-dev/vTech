import { IMeta } from "./meta";

export type LoadMetas = {
  loadAll: (params: LoadMetas.params) => Promise<LoadMetas.Model>;
};

export namespace LoadMetas {
  export type params = {};

  export type Model = IMeta[];
}
