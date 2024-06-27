
export type LoadAllHairs = {
  loadAllHairs: () => Promise<LoadAllHairs.Model>;
};

export type Hair = {
  id: string;
  description: string;
};

export namespace LoadAllHairs {
  export type Model = Hair[];
}
