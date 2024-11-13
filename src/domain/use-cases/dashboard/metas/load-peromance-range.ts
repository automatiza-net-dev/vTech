import { Range } from "./peromance-range";

export type LoadPerfomanceRange = {
  loadPerfomanceRange: (
    params: LoadPerfomanceRange.params
  ) => Promise<LoadPerfomanceRange.Model>;
};

export namespace LoadPerfomanceRange {
  export type params = {
    id: Range["metaId"];
  };

  export type Model = Range;
}
