import { Marketing } from "./marketing";

export type CreateMarketing = {
  create: (params: CreateMarketing.Params) => Promise<CreateMarketing.Model>;
};

export namespace CreateMarketing {
  export type Params = Marketing;

  export type Model = {};
}
