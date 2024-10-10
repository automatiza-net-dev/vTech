import { Marketing } from "./marketing";

export type LoadMarketing = {
  load: (params: LoadMarketing.Params) => Promise<LoadMarketing.Model>;
};

export namespace LoadMarketing {
  export type Params = Marketing;

  export type Model = Marketing[];
}
