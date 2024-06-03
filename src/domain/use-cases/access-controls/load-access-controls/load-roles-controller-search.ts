export type LoadRolesControllerSearch = {
  load: () => Promise<LoadRolesControllerSearch.Model>;
};

export namespace LoadRolesControllerSearch {
  export type Model = {
    id: number;
    name: string;
    active: boolean;
    externalAccess: boolean;
    profiles: {
      id: number;
      description: string;
    }[];
  };
}
