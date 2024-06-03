export interface ISearchBar {
  isFetching?: boolean;
  options: {
    label: string;
    value: string;
  }[];
}
