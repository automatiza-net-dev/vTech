export type Range = {
  metaId: number;
  ranges: {
    startValue: number;
    endValue: number;
    color: string;
  }[];
};

export type PerfomanceRange = {
  perfomanceRange: (
    params: PerfomanceRange.params
  ) => Promise<PerfomanceRange.Model>;
};

export namespace PerfomanceRange {
  export type params = Range;

  export type Model = {};
}
