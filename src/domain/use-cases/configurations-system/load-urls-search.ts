export type LoadUrlsSearch = {
  load: (params: LoadUrlsSearch.Params) => Promise<LoadUrlsSearch.Model>;
};

export namespace LoadUrlsSearch {
  export type Params = {
    url: string;
  };

  export type Model = {
    id: number;
    url: string;
    system: { id: number; name: string };
  };
}
