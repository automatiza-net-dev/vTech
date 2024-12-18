
export type LoadAllStates = {
  loadAllStates: () => Promise<LoadAllStates.Model>;
};

export namespace LoadAllStates {
  export type Model = string[];
}
